// @hireclaw/maimai-adapter — 脉脉平台适配器
//
// 实现 PlatformAdapter 接口：
// 1. 候选人搜索（多轮次搜索矩阵）
// 2. 防封控（频率控制、退避策略）
// 3. 触达（幂等保护、留痕）
// 4. 消息处理（状态机）

import type {
  PlatformAdapter,
  CandidateFetchRequest,
  CandidateFetchResult,
  ReachOutRequest,
  ReachOutResult,
  ConversationStatus,
  PlatformStatus,
  Candidate,
  JobConfig,
} from '@hireclaw/core';
import { join } from 'node:path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import type { MaimaiBrowserSession, MaimaiBrowserConfig } from './browser.js';
import { rawToMaimaiCandidate, MaimaiRateLimiter } from './browser.js';

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface MaimaiAdapterConfig {
  headless?: boolean;
  executablePath?: string;
  accountStatePath?: string;
  userDataDir?: string;
  /** 缓存目录（默认 ~/.hireclaw/maimai_cache） */
  cacheDir?: string;
}

export interface MaimaiCandidateRaw {
  id: string;
  name: string;
  school?: string;
  degree?: string;
  company?: string;
  title?: string;
  /** 活跃度评分（来自平台标签） */
  activityScore?: number;
  /** 是否顶级院校 */
  isTopSchool?: boolean;
  /** 是否大厂/明星公司 */
  isTopCompany?: boolean;
  /** 求职意愿 */
  jobIntent?: 'active' | 'considering' | 'inactive';
  /** 按钮状态 */
  buttonState?: 'contacted' | 'uncontacted';
  /** 标签（如"简历"、"近期有动向"） */
  tags?: string[];
}

export interface MaimaiSearchRound {
  roundName: string;
  keyword: string;
  filters: {
    city?: string[];
    education?: string[];
    experience?: string[];
    school?: string[];
    company?: string[];
  };
}

export interface MaimaiFilterConfig {
  aiSkillRequired?: boolean;
  aiSkillKeywords?: string[];
  schoolTiers?: string[];
  targetCompanies?: string[];
  experienceRange?: [number, number];
  scoreThreshold?: number;
}

/** 触达记录 */
export interface MaimaiContactRecord {
  fingerprint: string;
  timestamp: string;
  round: string;
  score: number;
  messageSent: string;
  status: 'sent' | 'failed';
}

// ────────────────────────────────────────────────────────────
// MaimaiCandidateFilter
// ────────────────────────────────────────────────────────────

export class MaimaiCandidateFilter {
  private config: Required<MaimaiFilterConfig>;
  private contactedFingerprints = new Set<string>();

  constructor(config: MaimaiFilterConfig = {}) {
    this.config = {
      aiSkillRequired: true,
      aiSkillKeywords: [],
      schoolTiers: [],
      targetCompanies: [],
      experienceRange: [0, 99],
      scoreThreshold: 60,
      ...config,
    } as Required<MaimaiFilterConfig>;
  }

  /**
   * 硬性筛选
   */
  screen(raw: MaimaiCandidateRaw): { pass: boolean; reason?: string } {
    // 1. 已联系检查
    if (raw.buttonState === 'contacted' || this.isContacted(raw)) {
      return { pass: false, reason: 'already_contacted' };
    }

    // 2. AI 技能要求
    if (this.config.aiSkillRequired && this.config.aiSkillKeywords.length > 0) {
      if (!this.checkSkills(raw)) {
        return { pass: false, reason: 'skill_mismatch' };
      }
    }

    // 3. 学校要求
    if (this.config.schoolTiers && this.config.schoolTiers.length > 0) {
      if (!this.checkSchool(raw)) {
        return { pass: false, reason: 'school_mismatch' };
      }
    }

    // 4. 目标公司（软筛，不直接拒绝）
    // 公司匹配只影响评分，不做硬性排除

    return { pass: true };
  }

  /**
   * 评分排序（总分 100）
   * - 公司层级 40 分
   * - 学校层级 30 分
   * - 活跃度 15 分
   * - 求职意愿 15 分
   */
  score(raw: MaimaiCandidateRaw): number {
    let total = 0;

    // 公司层级 (40)
    if (raw.isTopCompany) total += 40;
    else if (this.config.targetCompanies.some(c => raw.company?.includes(c))) total += 35;
    else if (raw.company) total += 20;
    else total += 5;

    // 学校层级 (30)
    if (raw.school) {
      if (raw.school.includes('清华') || raw.school.includes('北大') || raw.school.includes('复旦') || raw.school.includes('上交') || raw.school.includes('浙大')) {
        total += 30; // C9
      } else if (raw.school.includes('985') || raw.isTopSchool) {
        total += 25; // 985
      } else {
        total += 15;
      }
    } else {
      total += 5;
    }

    // 活跃度 (15)
    total += raw.activityScore ?? 5;

    // 求职意愿 (15)
    const intentScore: Record<string, number> = {
      active: 15,
      considering: 10,
      inactive: 5,
    };
    total += intentScore[raw.jobIntent ?? 'inactive'];

    // 可选附加分（上限 +5）
    if (raw.tags) {
      if (raw.tags.some(t => t.includes('简历'))) total += 2;
      if (raw.tags.some(t => t.includes('近期有动向'))) total += 2;
      if (raw.tags.some(t => t.includes('有过意向'))) total += 1;
    }

    return Math.min(total, 105); // 封顶 105
  }

  /**
   * 批量筛选 + 评分
   */
  filterAndRank(candidates: MaimaiCandidateRaw[]): {
    passed: Array<{ raw: MaimaiCandidateRaw; score: number }>;
    rejected: Array<{ raw: MaimaiCandidateRaw; reason: string }>;
  } {
    const passed: Array<{ raw: MaimaiCandidateRaw; score: number }> = [];
    const rejected: Array<{ raw: MaimaiCandidateRaw; reason: string }> = [];

    for (const raw of candidates) {
      const { pass, reason } = this.screen(raw);
      if (pass) {
        const score = this.score(raw);
        if (score >= (this.config.scoreThreshold ?? 60)) {
          passed.push({ raw, score });
        } else {
          rejected.push({ raw, reason: `score_below_threshold(${score})` });
        }
      } else {
        rejected.push({ raw, reason: reason! });
      }
    }

    passed.sort((a, b) => b.score - a.score);
    return { passed, rejected };
  }

  static fingerprint(raw: MaimaiCandidateRaw): string {
    return `${raw.name}|${raw.school ?? ''}|${raw.company ?? ''}`;
  }

  isContacted(raw: MaimaiCandidateRaw): boolean {
    return this.contactedFingerprints.has(MaimaiCandidateFilter.fingerprint(raw));
  }

  markContacted(raw: MaimaiCandidateRaw): void {
    this.contactedFingerprints.add(MaimaiCandidateFilter.fingerprint(raw));
  }

  isContactedByFingerprint(fp: string): boolean {
    return this.contactedFingerprints.has(fp);
  }

  markContactedByFingerprint(fp: string): void {
    this.contactedFingerprints.add(fp);
  }

  private checkSkills(raw: MaimaiCandidateRaw): boolean {
    if (!this.config.aiSkillKeywords || this.config.aiSkillKeywords.length === 0) return true;
    const text = [raw.title, raw.company, raw.tags?.join(' ')].filter(Boolean).join(' ').toLowerCase();
    return this.config.aiSkillKeywords.some(kw => text.includes(kw.toLowerCase()));
  }

  private checkSchool(raw: MaimaiCandidateRaw): boolean {
    if (!raw.school) return false;
    return this.config.schoolTiers!.some(tier => {
      if (tier === '985') return raw.school!.includes('985') || raw.isTopSchool;
      if (tier === 'QS100') return raw.isTopSchool;
      return raw.school!.includes(tier);
    });
  }
}

// ────────────────────────────────────────────────────────────
// Cache Manager
// ────────────────────────────────────────────────────────────

interface MaimaiCache {
  jobConfigs: Record<string, MaimaiJobConfig>;
  contactHistory: MaimaiContactRecord[];
}

interface MaimaiJobConfig {
  title: string;
  searchRounds: MaimaiSearchRound[];
  filterConfig: MaimaiFilterConfig;
  scoring: {
    companyTiers: Record<string, number>;
    schoolTiers: Record<string, number>;
  };
  outreachContext: {
    companyName: string;
    teamDesc: string;
    opportunityHighlights: string[];
    tone: string;
  };
}

class MaimaiCacheManager {
  private cachePath: string;
  private cache: MaimaiCache;

  constructor(cacheDir: string) {
    this.cachePath = join(cacheDir, 'maimai_cache.json');
    this.cache = this.load();
  }

  private load(): MaimaiCache {
    if (existsSync(this.cachePath)) {
      try {
        return JSON.parse(readFileSync(this.cachePath, 'utf-8'));
      } catch { /* corrupt cache */ }
    }
    return { jobConfigs: {}, contactHistory: [] };
  }

  save(): void {
    const dir = join(this.cachePath, '..');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(this.cachePath, JSON.stringify(this.cache, null, 2), 'utf-8');
  }

  getJobConfig(jobId: string): MaimaiJobConfig | null {
    return this.cache.jobConfigs[jobId] ?? null;
  }

  setJobConfig(jobId: string, config: MaimaiJobConfig): void {
    this.cache.jobConfigs[jobId] = config;
    this.save();
  }

  getContactHistory(): MaimaiContactRecord[] {
    return this.cache.contactHistory;
  }

  addContactRecord(record: MaimaiContactRecord): void {
    // 幂等：检查是否已存在
    const exists = this.cache.contactHistory.some(r => r.fingerprint === record.fingerprint);
    if (!exists) {
      this.cache.contactHistory.push(record);
      this.save();
    }
  }

  getContactedFingerprints(): Set<string> {
    return new Set(this.cache.contactHistory.map(r => r.fingerprint));
  }
}

// ────────────────────────────────────────────────────────────
// MaimaiAdapter
// ────────────────────────────────────────────────────────────

export class MaimaiAdapter implements PlatformAdapter {
  readonly name = 'maimai';

  private config: Required<MaimaiAdapterConfig>;
  private initialized = false;
  private filter: MaimaiCandidateFilter;
  private browserSession: MaimaiBrowserSession | null = null;
  private cacheManager: MaimaiCacheManager | null = null;
  private sessionContactRecords: MaimaiContactRecord[] = [];

  constructor(config: MaimaiAdapterConfig = {}, filterConfig?: MaimaiFilterConfig) {
    const cacheDir = config.cacheDir ?? join(process.env.HOME ?? process.env.USERPROFILE ?? '', '.hireclaw', 'maimai_cache');
    this.config = {
      headless: config.headless ?? false,
      executablePath: config.executablePath ?? '',
      accountStatePath: config.accountStatePath ?? '',
      userDataDir: config.userDataDir ?? '',
      cacheDir,
    };
    this.filter = new MaimaiCandidateFilter(filterConfig);
  }

  async init(): Promise<void> {
    const { MaimaiBrowserSession } = await import('./browser.js');
    const browserConfig: MaimaiBrowserConfig = {
      headless: this.config.headless,
      executablePath: this.config.executablePath,
      userDataDir: this.config.userDataDir,
    };
    this.browserSession = new MaimaiBrowserSession(browserConfig, msg => console.log(msg));
    await this.browserSession.init();

    // 初始化缓存管理器并加载触达历史
    this.cacheManager = new MaimaiCacheManager(this.config.cacheDir);
    const fingerprints = this.cacheManager.getContactedFingerprints();
    for (const fp of fingerprints) {
      this.filter.markContactedByFingerprint(fp);
    }
    this.browserSession.loadContactHistory(
      Array.from(fingerprints).map(fp => ({ fingerprint: fp }))
    );

    this.initialized = true;
  }

  async destroy(): Promise<void> {
    if (this.browserSession) {
      await this.browserSession.destroy();
      this.browserSession = null;
    }
    this.initialized = false;
  }

  async getCandidates(request: CandidateFetchRequest): Promise<CandidateFetchResult> {
    this.ensureInitialized();
    if (!this.browserSession) throw new Error('Browser session not available');

    const filters = request.job.filters as Record<string, unknown> | undefined;
    const jobConfig = this.cacheManager?.getJobConfig(request.job.id);

    // 如果有保存的搜索轮次，按轮次执行
    if (jobConfig?.searchRounds?.length) {
      return this.searchByRounds(request, jobConfig.searchRounds);
    }

    // 否则按请求中的 filters 执行单次搜索
    return this.searchSingle(request, filters);
  }

  private async searchByRounds(
    request: CandidateFetchRequest,
    rounds: MaimaiSearchRound[]
  ): Promise<CandidateFetchResult> {
    if (!this.browserSession) throw new Error('Browser session not available');

    const allCandidates: Candidate[] = [];
    const limit = request.limit ?? 50;

    for (const round of rounds) {
      if (allCandidates.length >= limit) break;

      const { candidates } = await this.browserSession.search({
        keyword: round.keyword,
        filters: round.filters,
        onBatch: (raws) => {
          const { passed } = this.filter.filterAndRank(raws);
          for (const { raw, score } of passed) {
            const candidate = rawToMaimaiCandidate(raw);
            candidate.evaluation = {
              score,
              passed: true,
              threshold: this.filter['config'].scoreThreshold ?? 60,
              dimensions: [],
              vetoed: [],
              bonuses: [],
              priority: score >= 90 ? 'critical' : score >= 80 ? 'high' : score >= 70 ? 'medium' : 'low',
            };
            allCandidates.push(candidate);
          }
        },
        signal: { stop: false },
      });
    }

    return {
      candidates: allCandidates.slice(0, limit),
      hasMore: allCandidates.length > limit,
      platformStatus: {
        platform: 'maimai',
        loggedIn: true,
        rateLimited: false,
        accountStatus: 'active',
      },
    };
  }

  private async searchSingle(
    request: CandidateFetchRequest,
    filters?: Record<string, unknown>
  ): Promise<CandidateFetchResult> {
    if (!this.browserSession) throw new Error('Browser session not available');

    const maimaiFilters = filters?.maimai as {
      keyword?: string;
      school?: string[];
      company?: string[];
      city?: string[];
      education?: string[];
      experience?: string[];
    } | undefined;

    const { candidates: raws } = await this.browserSession.search({
      keyword: maimaiFilters?.keyword ?? request.job.title,
      filters: {
        school: maimaiFilters?.school,
        company: maimaiFilters?.company,
        city: maimaiFilters?.city,
        education: maimaiFilters?.education,
        experience: maimaiFilters?.experience,
      },
      onBatch: undefined,
      signal: { stop: false },
    });

    const { passed } = this.filter.filterAndRank(raws);
    const limit = request.limit ?? 50;
    const candidates = passed.slice(0, limit).map(({ raw, score }) => {
      const candidate = rawToMaimaiCandidate(raw);
      candidate.evaluation = {
        score,
        passed: true,
        threshold: this.filter['config'].scoreThreshold ?? 60,
        dimensions: [],
        vetoed: [],
        bonuses: [],
        priority: score >= 90 ? 'critical' : score >= 80 ? 'high' : score >= 70 ? 'medium' : 'low',
      };
      return candidate;
    });

    return {
      candidates,
      hasMore: passed.length > limit,
      platformStatus: {
        platform: 'maimai',
        loggedIn: true,
        rateLimited: false,
        accountStatus: 'active',
      },
    };
  }

  async reachOut(request: ReachOutRequest): Promise<ReachOutResult> {
    this.ensureInitialized();
    if (!this.browserSession) throw new Error('Browser session not available');

    const raw = request.candidate.source.rawData as unknown as MaimaiCandidateRaw;
    const fingerprint = MaimaiCandidateFilter.fingerprint(raw);

    // 幂等检查
    if (this.filter.isContactedByFingerprint(fingerprint)) {
      return { success: false, error: 'ALREADY_CONTACTED' };
    }

    const message = request.message;

    const result = await this.browserSession.reachOut(raw, message);

    if (result.alreadyContacted) {
      this.filter.markContactedByFingerprint(fingerprint);
      return { success: false, error: 'ALREADY_CONTACTED' };
    }

    if (result.rateLimited) {
      return { success: false, error: 'RATE_LIMITED', rateLimited: true };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // 留痕
    this.filter.markContactedByFingerprint(fingerprint);

    const record: MaimaiContactRecord = {
      fingerprint,
      timestamp: new Date().toISOString(),
      round: 'default',
      score: this.filter.score(raw),
      messageSent: message,
      status: 'sent',
    };

    this.sessionContactRecords.push(record);
    this.cacheManager?.addContactRecord(record);

    return { success: true };
  }

  async getConversationStatus(candidateId: string): Promise<ConversationStatus> {
    this.ensureInitialized();
    // 脉脉的对话状态需要进入详情页获取，这里简化处理
    // 实际实现中可以从已缓存的候选人状态推断
    const history = this.cacheManager?.getContactHistory() ?? [];
    const found = history.find(r => r.fingerprint.includes(candidateId));
    return found ? 'contacted' : 'uncontacted';
  }

  async getStatus(): Promise<PlatformStatus> {
    return {
      platform: 'maimai',
      loggedIn: this.initialized,
      rateLimited: false,
      accountStatus: 'active',
    };
  }

  /**
   * 注册岗位配置（搜索轮次、评分参数、触达上下文）
   */
  registerJobConfig(jobId: string, config: MaimaiJobConfig): void {
    this.cacheManager?.setJobConfig(jobId, config);
  }

  /**
   * 获取岗位配置
   */
  getJobConfig(jobId: string): MaimaiJobConfig | null {
    return this.cacheManager?.getJobConfig(jobId) ?? null;
  }

  /**
   * 获取当前会话的触达记录
   */
  getSessionContactRecords(): MaimaiContactRecord[] {
    return [...this.sessionContactRecords];
  }

  /**
   * 重置会话状态
   */
  resetSession(): void {
    this.sessionContactRecords = [];
  }

  // ── Helpers ──

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('MaimaiAdapter not initialized. Call await adapter.init() first.');
    }
  }
}

// ── Re-export browser module ──

export { MaimaiBrowserSession, rawToMaimaiCandidate } from './browser.js';
export type { MaimaiBrowserConfig } from './browser.js';
