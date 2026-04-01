// @hireclaw/maimai-adapter/browser — Playwright 脉脉浏览器自动化
//
// 实现脉脉企业招聘端（maimai.cn/ent）的浏览器操作：
// 1. 初始化（持久化登录态检测）
// 2. 人才搜索（关键词、筛选、滚动、解析）
// 3. 触达（选择职位、填写消息、发送、幂等校验）
// 4. 触达历史管理（去重缓存）

import { chromium, type Browser, type BrowserContext, type Page, type ElementHandle } from 'playwright';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { Candidate, CandidateProfile, Education, Experience, ConversationStatus } from '@hireclaw/core';
import type { MaimaiCandidateRaw } from './index.js';

// ────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────

export interface MaimaiBrowserConfig {
  headless?: boolean;
  executablePath?: string;
  userDataDir?: string;
  /** 基础 URL */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = 'https://maimai.cn/ent/v41/recruit/talents?tab=1';
const DEFAULT_USER_DATA_DIR = join(homedir(), '.hireclaw', 'maimai-browser-data');

// ────────────────────────────────────────────────────────────
// Selectors
// ────────────────────────────────────────────────────────────

const SEL = {
  // 登录检测
  loggedInIndicator: '.header-user-avatar, .user-avatar, .nav-user-info, [class*="userInfo"]',

  // 搜索框
  searchInput: '.search-input input, input[class*="search"], [class*="search"] input',

  // 筛选面板
  filterPanel: '.filter-panel, .search-filter, [class*="filterWrap"]',
  filterSchoolBtn: '[class*="school"], [class*="edu"]',
  filterCompanyBtn: '[class*="company"]',
  filterCityBtn: '[class*="city"], [class*="location"]',
  filterExpBtn: '[class*="exp"], [class*="experience"]',
  filterEduBtn: '[class*="education"], [class*="degree"]',

  // 候选人卡片
  candidateCard: '[class*="talents-item"], [class*="candidate"], .list-item, [class*="resume-card"]',

  // 候选人字段
  candidateName: '[class*="name"], .name, [class*="userName"]',
  candidateSchool: '[class*="school"], .school-tag, [class*="edu"]',
  candidateCompany: '[class*="company"], .company-name, [class*="curCompany"]',
  candidateTitle: '[class*="title"], .title, [class*="position"]',
  candidateActive: '[class*="active"], [class*="online"], [class*="recent"]',
  candidateIntent: '[class*="intent"], [class*="job-intent"]',

  // 触达按钮
  contactBtn: '[class*="contact"], [class*="reach"], .btn-contact, [class*="chat"]',

  // 触达弹窗
  outreachModal: '[class*="modal"], [class*="dialog"], [class*="popup"]',
  outreachModalTitle: /招聘立即沟通|立即沟通/,

  // 弹窗内部字段
  jobSelectDropdown: '.job-select, [class*="jobSelect"], select, [class*="positionSelect"]',
  messageTextarea: 'textarea, [class*="message"], [class*="textarea"]',
  sendBtn: 'button:has-text("发送"), [class*="send"], [class*="submit"]',
  stayOnPageBtn: 'button:has-text("留在此页"), [class*="stay"]',

  // 按钮状态
  contactedBtnText: /沟通|已联系/,
  uncontactedBtnText: /立即沟通/,

  // 分页/结束
  noMoreResult: /没有更多|暂无更多|已加载全部|未找到符合条件/,

  // 风控
  rateLimitModal: /操作太频繁|请稍后再试|账号异常/,
} as const;

// ────────────────────────────────────────────────────────────
// Rate Limiter
// ────────────────────────────────────────────────────────────

export class MaimaiRateLimiter {
  private consecutiveHits = 0;
  private backoffUntil = 0;
  private baseDelay = 2000; // 2s 基础间隔
  private maxBackoff = 60000;

  async waitAndRecord(): Promise<void> {
    const now = Date.now();
    if (now < this.backoffUntil) {
      await this.sleep(this.backoffUntil - now);
    }
    const jitter = Math.random() * 1500;
    await this.sleep(this.baseDelay + jitter);
  }

  async handleRateLimit(): Promise<{ waitedMs: number }> {
    this.consecutiveHits++;
    const backoffMs = Math.min(
      15000 + this.consecutiveHits * 5000 + Math.random() * 5000,
      this.maxBackoff
    );
    this.backoffUntil = Date.now() + backoffMs;
    await this.sleep(backoffMs);
    return { waitedMs: backoffMs };
  }

  resetBackoff(): void {
    this.consecutiveHits = 0;
    this.backoffUntil = 0;
  }

  getStats() {
    return {
      consecutiveHits: this.consecutiveHits,
      backoffUntil: this.backoffUntil ? new Date(this.backoffUntil).toISOString() : null,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve as () => void, ms));
  }
}

// ────────────────────────────────────────────────────────────
// Session
// ────────────────────────────────────────────────────────────

export class MaimaiBrowserSession {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: Required<MaimaiBrowserConfig>;
  private logger: (msg: string) => void;

  // 触达去重（进程内）
  private contactedFingerprints = new Set<string>();

  constructor(config: MaimaiBrowserConfig = {}, logger?: (msg: string) => void) {
    this.config = {
      headless: config.headless ?? false,
      executablePath: config.executablePath ?? '',
      userDataDir: config.userDataDir ?? DEFAULT_USER_DATA_DIR,
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
    };
    this.logger = logger ?? (() => {});
  }

  // ── Init & Destroy ──

  async init(): Promise<void> {
    this.log('Initializing Playwright browser for 脉脉...');

    const launchOptions: Parameters<typeof chromium.launch>[0] = {
      headless: this.config.headless,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    };

    if (this.config.executablePath) {
      launchOptions.executablePath = this.config.executablePath;
    }

    this.browser = await chromium.launch(launchOptions);

    this.context = await this.browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1440, height: 900 },
      locale: 'zh-CN',
      timezoneId: 'Asia/Shanghai',
    });

    this.page = await this.context.newPage();

    this.log('Navigating to 脉脉招聘端...');
    await this.page.goto(this.config.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.randomDelay(2000, 4000);

    const isLoggedIn = await this.checkLoginStatus();
    if (!isLoggedIn) {
      await this.destroy();
      throw new Error(
        '未检测到登录状态。请在浏览器中手动登录脉脉企业端，然后重新调用 init()。'
      );
    }

    this.log('Login verified ✓');
  }

  async checkLoginStatus(): Promise<boolean> {
    if (!this.page) return false;
    try {
      const indicator = await this.page.$(SEL.loggedInIndicator);
      if (indicator) return true;
      const url = this.page.url();
      return url.includes('/ent/');
    } catch {
      return false;
    }
  }

  async destroy(): Promise<void> {
    this.log('Destroying browser session...');
    try {
      if (this.context) await this.context.close();
    } catch { /* already closed */ }
    try {
      if (this.browser) await this.browser.close();
    } catch { /* already closed */ }
    this.context = null;
    this.browser = null;
    this.page = null;
  }

  getPage(): Page {
    if (!this.page) throw new Error('MaimaiBrowserSession not initialized');
    return this.page;
  }

  // ── Search ──

  /**
   * 执行搜索：设置关键词 → 应用筛选 → 获取候选人列表
   */
  async search(options: {
    keyword?: string;
    filters?: {
      school?: string[];
      company?: string[];
      city?: string[];
      education?: string[];
      experience?: string[];
    };
    onBatch?: (raws: MaimaiCandidateRaw[]) => void;
    rateLimiter?: MaimaiRateLimiter;
    signal?: { stop: boolean };
    maxScrolls?: number;
  }): Promise<{
    candidates: MaimaiCandidateRaw[];
    terminatedBy: 'no_more' | 'signal' | 'scroll_stable';
  }> {
    const page = this.getPage();
    const allCandidates = new Map<string, MaimaiCandidateRaw>();
    let emptyScrollCount = 0;
    const MAX_SCROLLS = options.maxScrolls ?? 40;
    const MAX_EMPTY_SCROLLS = 3;

    // 设置关键词
    if (options.keyword) {
      await this.setKeyword(options.keyword);
    }

    // 应用筛选
    if (options.filters) {
      await this.applyFilters(options.filters);
    }

    // 搜索按钮
    const searchBtn = await page.$('button:has-text("搜索"), [class*="searchBtn"], [class*="submit"]');
    if (searchBtn) {
      await searchBtn.click();
      await this.randomDelay(2000, 4000);
    }

    // 滚动收集
    for (let i = 0; i < MAX_SCROLLS; i++) {
      if (options.signal?.stop) {
        return { candidates: Array.from(allCandidates.values()), terminatedBy: 'signal' };
      }

      if (options.rateLimiter) {
        await options.rateLimiter.waitAndRecord();
      }

      const batch = await this.parseVisibleCandidates();

      let newInBatch = 0;
      for (const raw of batch) {
        const fp = this.fingerprint(raw);
        if (!allCandidates.has(raw.id) && !this.contactedFingerprints.has(fp)) {
          allCandidates.set(raw.id, raw);
          newInBatch++;
        }
      }

      if (newInBatch === 0) {
        emptyScrollCount++;
      } else {
        emptyScrollCount = 0;
        this.log(`Scroll ${i + 1}: found ${newInBatch} new candidates (total: ${allCandidates.size})`);
        if (options.onBatch) {
          options.onBatch(batch);
        }
      }

      if (await this.checkNoMore(page)) {
        this.log('No more results detected');
        return { candidates: Array.from(allCandidates.values()), terminatedBy: 'no_more' };
      }

      if (emptyScrollCount >= MAX_EMPTY_SCROLLS) {
        this.log(`Stable after ${MAX_EMPTY_SCROLLS} empty scrolls`);
        return { candidates: Array.from(allCandidates.values()), terminatedBy: 'scroll_stable' };
      }

      await page.evaluate(() => window.scrollBy(0, 500 + Math.random() * 400));
      await this.randomDelay(2000, 4000);
    }

    return { candidates: Array.from(allCandidates.values()), terminatedBy: 'scroll_stable' };
  }

  /**
   * 触达候选人
   */
  async reachOut(candidate: MaimaiCandidateRaw, message: string, jobId?: string): Promise<{
    success: boolean;
    alreadyContacted?: boolean;
    rateLimited?: boolean;
    error?: string;
  }> {
    const page = this.getPage();
    const fp = this.fingerprint(candidate);

    // 幂等检查
    if (this.contactedFingerprints.has(fp)) {
      return { success: false, alreadyContacted: true };
    }

    // 找到候选人卡片
    const card = await this.findCandidateCard(candidate);
    if (!card) {
      return { success: false, error: 'CANDIDATE_CARD_NOT_FOUND' };
    }

    // 检查按钮状态
    const btnText = await card.textContent().catch(() => '');
    if (SEL.contactedBtnText.test(btnText || '')) {
      this.contactedFingerprints.add(fp);
      return { success: false, alreadyContacted: true };
    }

    // 点击触达按钮
    const contactBtn = await card.$(SEL.contactBtn as string);
    if (!contactBtn) {
      return { success: false, error: 'CONTACT_BUTTON_NOT_FOUND' };
    }

    await this.randomDelay(2000, 5000);

    // 检测频率限制
    const rlResult = await this.detectRateLimitModal();
    if (rlResult) {
      return { success: false, rateLimited: true, error: rlResult };
    }

    await contactBtn.click();
    await this.randomDelay(1500, 3000);

    // 等待触达弹窗出现
    const modal = await this.waitForOutreachModal();
    if (!modal) {
      return { success: false, error: 'OUTREACH_MODAL_NOT_FOUND' };
    }

    // 选择职位（如果有 jobId）
    if (jobId) {
      await this.selectJobInModal(jobId);
    }

    // 填写消息
    const textarea = await modal.$('textarea, [class*="message"], [class*="textarea"]');
    if (textarea) {
      await textarea.click();
      await textarea.fill(message);
      await this.randomDelay(500, 1000);
    }

    // 点击发送后留在此页
    const stayBtn = await modal.$(SEL.stayOnPageBtn as string) ?? await modal.$('button[type="submit"]');
    if (stayBtn) {
      await stayBtn.click();
      await this.randomDelay(1000, 2000);
    } else {
      // 尝试直接点发送
      const sendBtn = await modal.$(SEL.sendBtn as string);
      if (sendBtn) {
        await sendBtn.click();
        await this.randomDelay(1000, 2000);
      }
    }

    // 标记已触达
    this.contactedFingerprints.add(fp);

    // 关闭可能出现的弹窗
    await this.closeTopModal();

    this.log(`Outreach sent to ${candidate.name}`);
    return { success: true };
  }

  /**
   * 批量预加载触达历史（从外部 JSON 恢复）
   */
  loadContactHistory(records: Array<{ fingerprint: string }>): void {
    for (const rec of records) {
      this.contactedFingerprints.add(rec.fingerprint);
    }
    this.log(`Loaded ${records.length} contact history records`);
  }

  /**
   * 导出触达历史（用于持久化）
   */
  exportContactHistory(): Array<{ fingerprint: string; timestamp: string }> {
    return Array.from(this.contactedFingerprints).map(fp => ({
      fingerprint: fp,
      timestamp: new Date().toISOString(),
    }));
  }

  // ── Private helpers ──

  private async setKeyword(keyword: string): Promise<void> {
    const page = this.getPage();
    const input = await page.$(SEL.searchInput as string);
    if (input) {
      await input.click();
      await input.fill('');
      await this.randomDelay(300, 600);
      await input.type(keyword, { delay: 50 });
      await this.randomDelay(500, 1000);
    }
  }

  private async applyFilters(filters: {
    school?: string[];
    company?: string[];
    city?: string[];
    education?: string[];
    experience?: string[];
  }): Promise<void> {
    if (!filters) return;
    const page = this.getPage();

    // 打开筛选面板
    const filterPanel = await page.$(SEL.filterPanel as string);
    if (filterPanel) {
      await filterPanel.click();
      await this.randomDelay(500, 1000);
    }

    if (filters.school?.length) {
      await this.clickFilterOption('学校', filters.school);
    }
    if (filters.company?.length) {
      await this.clickFilterOption('公司', filters.company);
    }
    if (filters.city?.length) {
      await this.clickFilterOption('城市', filters.city);
    }
    if (filters.education?.length) {
      await this.clickFilterOption('学历', filters.education);
    }
    if (filters.experience?.length) {
      await this.clickFilterOption('经验', filters.experience);
    }
  }

  private async clickFilterOption(category: string, values: string[]): Promise<void> {
    const page = this.getPage();

    // 查找分类按钮并点击展开
    const categoryBtn = await page.$(`[class*="${category}"], [data-label*="${category}"]`);
    if (categoryBtn) {
      await categoryBtn.click();
      await this.randomDelay(500, 1000);
    }

    // 在展开的选项中勾选目标值
    for (const val of values) {
      const option = await page.$(`span:has-text("${val}"), label:has-text("${val}"), [class*="option"]:has-text("${val}")`);
      if (option) {
        await option.click();
        await this.randomDelay(300, 600);
      }
    }
  }

  private async parseVisibleCandidates(): Promise<MaimaiCandidateRaw[]> {
    const page = this.getPage();
    const candidates: MaimaiCandidateRaw[] = [];

    const cards = await page.$$(SEL.candidateCard as string);
    this.log(`Found ${cards.length} candidate cards`);

    for (const card of cards) {
      try {
        const raw = await this.parseCandidateCard(card);
        if (raw && raw.name) {
          candidates.push(raw);
        }
      } catch (err) {
        this.log(`Card parse error: ${(err as Error).message}`);
      }
    }

    return candidates;
  }

  private async parseCandidateCard(card: ElementHandle<Element>): Promise<MaimaiCandidateRaw | null> {
    const name = await card.$eval(SEL.candidateName as string, el => el.textContent?.trim() ?? '').catch(() => '');
    if (!name) return null;

    const id = await card.evaluate(el =>
      el.getAttribute('data-id') ?? el.getAttribute('data-user-id') ?? `mm-${Date.now()}-${Math.random().toString(36).slice(2)}`
    ).catch(() => undefined);

    const school = await card.$eval(SEL.candidateSchool as string, el => el.textContent?.trim() ?? '').catch(() => '');
    const company = await card.$eval(SEL.candidateCompany as string, el => el.textContent?.trim() ?? '').catch(() => '');
    const title = await card.$eval(SEL.candidateTitle as string, el => el.textContent?.trim() ?? '').catch(() => '');
    const activeText = await card.$eval(SEL.candidateActive as string, el => el.textContent?.trim() ?? '').catch(() => '');
    const intentText = await card.$eval(SEL.candidateIntent as string, el => el.textContent?.trim() ?? '').catch(() => '');

    // 解析活跃度
    const activityScore = this.parseActivity(activeText);

    // 解析求职意愿
    const intent = this.parseIntent(intentText);

    // 按钮状态
    const btnText = await card.textContent().catch(() => '');
    const isContacted = SEL.contactedBtnText.test(btnText || '');
    const buttonState = isContacted ? 'contacted' : 'uncontacted';

    return {
      id: id ?? `${name}-${company}`,
      name,
      school: school || undefined,
      company: company || undefined,
      title: title || undefined,
      activityScore,
      jobIntent: intent,
      buttonState,
    };
  }

  private parseActivity(text: string): number {
    const lower = text.toLowerCase();
    if (lower.includes('今日') || lower.includes('今天')) return 15;
    if (lower.includes('本周') || lower.includes('近7天')) return 12;
    if (lower.includes('近1月') || lower.includes('近30天')) return 8;
    return 5;
  }

  private parseIntent(text: string): 'active' | 'considering' | 'inactive' {
    const lower = text.toLowerCase();
    if (lower.includes('正在看') || lower.includes('主动')) return 'active';
    if (lower.includes('关注') || lower.includes('观望')) return 'considering';
    return 'inactive';
  }

  private async findCandidateCard(candidate: MaimaiCandidateRaw): Promise<ElementHandle<Element> | null> {
    const page = this.getPage();
    const cards = await page.$$(SEL.candidateCard as string);

    for (const card of cards) {
      const nameEl = await card.$(SEL.candidateName as string);
      if (!nameEl) continue;
      const nameText = await nameEl.textContent();
      if (nameText?.trim() === candidate.name) {
        return card;
      }
    }

    return null;
  }

  private async waitForOutreachModal(timeoutMs = 5000): Promise<ElementHandle<Element> | null> {
    const page = this.getPage();
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const modals = await page.$$(SEL.outreachModal as string);
      for (const modal of modals) {
        const text = await modal.textContent().catch(() => '');
        if (SEL.outreachModalTitle.test(text || '')) {
          return modal;
        }
      }
      await this.randomDelay(500, 1000);
    }

    return null;
  }

  private async selectJobInModal(_jobId: string): Promise<void> {
    const page = this.getPage();
    // 选择职位下拉框
    const dropdown = await page.$(SEL.jobSelectDropdown as string);
    if (dropdown) {
      await dropdown.click();
      await this.randomDelay(500, 1000);
      // 选第一个可用职位（实际 jobId 匹配逻辑由调用方保证）
      const firstOption = await page.$('option:nth-child(2), [class*="option"]:nth-child(2)');
      if (firstOption) {
        await firstOption.click();
        await this.randomDelay(300, 600);
      }
    }
  }

  private async detectRateLimitModal(): Promise<string | null> {
    const page = this.getPage();
    try {
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (SEL.rateLimitModal.test(bodyText)) {
        await page.keyboard.press('Escape');
        await this.randomDelay(500, 1000);
        return 'RATE_LIMITED';
      }
    } catch { /* ignore */ }
    return null;
  }

  private async closeTopModal(): Promise<void> {
    const page = this.getPage();
    try {
      await page.keyboard.press('Escape');
      await this.randomDelay(500, 1000);
    } catch { /* ignore */ }
  }

  private async checkNoMore(page: Page): Promise<boolean> {
    try {
      const text = await page.evaluate(() => document.body.innerText);
      return SEL.noMoreResult.test(text as string);
    } catch {
      return false;
    }
  }

  private fingerprint(raw: MaimaiCandidateRaw): string {
    return `${raw.name}|${raw.school ?? ''}|${raw.company ?? ''}`;
  }

  private randomDelay(minMs: number, maxMs: number): Promise<void> {
    const ms = minMs + Math.random() * (maxMs - minMs);
    return new Promise<void>(resolve => setTimeout(resolve as () => void, ms));
  }

  private log(msg: string): void {
    this.logger(`[MaimaiBrowser] ${msg}`);
  }
}

// ────────────────────────────────────────────────────────────
// Helpers — convert MaimaiCandidateRaw → Candidate
// ────────────────────────────────────────────────────────────

export function rawToMaimaiCandidate(raw: MaimaiCandidateRaw): Candidate {
  const profile: CandidateProfile = {
    education: [],
    experience: [],
    skills: [],
    ext: {
      activityScore: raw.activityScore,
      jobIntent: raw.jobIntent,
      buttonState: raw.buttonState,
    },
  };

  if (raw.school) {
    profile.education.push({ school: raw.school, isTopSchool: raw.isTopSchool });
  }

  if (raw.company || raw.title) {
    profile.experience.push({
      company: raw.company ?? '',
      title: raw.title ?? '',
      isTopCompany: raw.isTopCompany,
    });
  }

  return {
    id: raw.id,
    name: raw.name,
    platform: 'maimai',
    profile,
    source: { rawData: { ...raw } },
  };
}
