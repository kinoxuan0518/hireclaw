#!/usr/bin/env node
// @hireclaw/cli — HireClaw 命令行入口
//
// 用法：
//   npx hireclaw search <job-id>          搜索候选人
//   npx hireclaw reach <job-id>          触达候选人
//   npx hireclaw run <job-id>            完整招聘流程（搜索+触达）
//   npx hireclaw status                  查看平台状态
//   npx hireclaw init                    初始化配置
//   npx hireclaw --help                  显示帮助

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { BossAdapter, type BossFilterConfig, type BossAdapterConfig } from '@hireclaw/boss-adapter';
import { MaimaiAdapter, type MaimaiFilterConfig, type MaimaiAdapterConfig } from '@hireclaw/maimai-adapter';
import { evaluate, evaluateBatch } from '@hireclaw/core';
import type { JobConfig, Candidate, PlatformAdapter } from '@hireclaw/core';

// ────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────

const DEFAULT_CONFIG_DIR = join(homedir(), '.hireclaw');
const DEFAULT_CONFIG_PATH = join(DEFAULT_CONFIG_DIR, 'config.json');

interface HireClawConfig {
  /** 默认触达消息模板 */
  defaultGreetingTemplate?: string;
  /** 触达上限（每天） */
  dailyReachLimit?: number;
  /** dry run 模式 */
  dryRun?: boolean;
  /** Boss 适配器配置 */
  boss?: BossAdapterConfig & { filter?: BossFilterConfig };
  /** Maimai 适配器配置 */
  maimai?: MaimaiAdapterConfig & { filter?: MaimaiFilterConfig };
  /** 岗位列表 */
  jobs?: Record<string, JobConfig & { enabled?: boolean }>;
}

function loadConfig(): HireClawConfig {
  if (existsSync(DEFAULT_CONFIG_PATH)) {
    try {
      return JSON.parse(readFileSync(DEFAULT_CONFIG_PATH, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveConfig(config: HireClawConfig): void {
  if (!existsSync(DEFAULT_CONFIG_DIR)) {
    mkdirSync(DEFAULT_CONFIG_DIR, { recursive: true });
  }
  writeFileSync(DEFAULT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

// ────────────────────────────────────────────────────────────
// Logging
// ────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

function log(msg: string, color = RESET): void {
  console.log(`${color}${msg}${RESET}`);
}

function logHeader(msg: string): void {
  console.log(`\n${BOLD}${CYAN}━━ ${msg} ━━${RESET}\n`);
}

function logSuccess(msg: string): void {
  log(`  ${GREEN}✓${RESET} ${msg}`, GREEN);
}

function logError(msg: string): void {
  log(`  ${RED}✗${RESET} ${msg}`, RED);
}

function logWarn(msg: string): void {
  log(`  ${YELLOW}⚠${RESET} ${msg}`, YELLOW);
}

function logInfo(msg: string): void {
  log(`  ${GRAY}ℹ${RESET} ${msg}`, GRAY);
}

// ────────────────────────────────────────────────────────────
// Adapters
// ────────────────────────────────────────────────────────────

async function createAdapters(config: HireClawConfig): Promise<Record<string, PlatformAdapter>> {
  const adapters: Record<string, PlatformAdapter> = {};

  if (config.boss) {
    logInfo('Initializing BOSS adapter...');
    const boss = new BossAdapter(config.boss, config.boss.filter);
    await boss.init();
    adapters.boss = boss;
    logSuccess('BOSS adapter ready');
  }

  if (config.maimai) {
    logInfo('Initializing Maimai adapter...');
    const maimai = new MaimaiAdapter(config.maimai, config.maimai.filter);
    await maimai.init();
    adapters.maimai = maimai;
    logSuccess('Maimai adapter ready');
  }

  return adapters;
}

async function destroyAdapters(adapters: Record<string, PlatformAdapter>): Promise<void> {
  for (const [name, adapter] of Object.entries(adapters)) {
    logInfo(`Closing ${name} adapter...`);
    if (adapter.destroy) {
      await adapter.destroy();
    }
  }
}

// ────────────────────────────────────────────────────────────
// Commands
// ────────────────────────────────────────────────────────────

/**
 * init — 初始化配置文件
 */
async function cmdInit(): Promise<void> {
  logHeader('Initialize HireClaw Configuration');

  const existing = loadConfig();
  if (existsSync(DEFAULT_CONFIG_PATH)) {
    logWarn(`Config already exists at ${DEFAULT_CONFIG_PATH}`);
    logInfo('Run with --force to overwrite');
    console.log(existing);
    return;
  }

  const defaultConfig: HireClawConfig = {
    dailyReachLimit: 50,
    dryRun: false,
    defaultGreetingTemplate: '您好！看了您的履历觉得很匹配我们的岗位，想进一步了解您的意向，方便聊聊吗？',
    boss: {
      headless: false,
    },
    maimai: {
      headless: false,
    },
    jobs: {},
  };

  saveConfig(defaultConfig);
  logSuccess(`Config written to ${DEFAULT_CONFIG_PATH}`);
  logInfo('Edit this file to configure your job positions and platform credentials.');
}

/**
 * status — 查看平台状态
 */
async function cmdStatus(): Promise<void> {
  logHeader('Platform Status');

  const config = loadConfig();
  const adapters = await createAdapters(config);

  for (const [name, adapter] of Object.entries(adapters)) {
    try {
      const status = await adapter.getStatus();
      log(`\n${BOLD}[${name.toUpperCase()}]${RESET}`);
      console.table({
        Platform: status.platform,
        LoggedIn: status.loggedIn ? `${GREEN}Yes${RESET}` : `${RED}No${RESET}`,
        RateLimited: status.rateLimited ? `${YELLOW}Yes${RESET}` : 'No',
        AccountStatus: status.accountStatus,
        RemainingQuota: status.remainingQuota?.toString() ?? 'N/A',
      });
    } catch (err) {
      logError(`Failed to get ${name} status: ${(err as Error).message}`);
    }
  }

  await destroyAdapters(adapters);
}

/**
 * search — 搜索候选人
 */
async function cmdSearch(jobId: string, options: { platform?: string; limit?: number }): Promise<void> {
  logHeader(`Search Candidates for Job: ${jobId}`);

  const config = loadConfig();
  const job = config.jobs?.[jobId];
  if (!job) {
    logError(`Job "${jobId}" not found in config. Run 'hireclaw init' first.`);
    return;
  }

  const adapters = await createAdapters(config);
  const platform = options.platform ?? job.platforms?.[0] ?? 'boss';
  const adapter = adapters[platform];

  if (!adapter) {
    logError(`Platform "${platform}" not configured. Check your config.`);
    await destroyAdapters(adapters);
    return;
  }

  try {
    logInfo(`Searching on ${platform}...`);
    const result = await adapter.getCandidates({
      job: { ...job, id: jobId },
      limit: options.limit ?? 50,
    });

    logSuccess(`Found ${result.candidates.length} candidates`);
    if (result.hasMore) {
      logInfo('More candidates available (use --limit to fetch more)');
    }

    // 展示结果
    if (result.candidates.length > 0) {
      console.log('\n' + BOLD + 'Top Candidates:' + RESET);
      for (const c of result.candidates.slice(0, 20)) {
        const score = c.evaluation?.score ?? '?';
        const priority = c.evaluation?.priority ?? '';
        const edu = c.profile.education[0];
        const exp = c.profile.experience[0];
        console.log(
          `  ${GREEN}${c.name}${RESET}` +
          ` | ${edu?.school ?? 'N/A'}` +
          ` | ${exp?.company ?? 'N/A'}` +
          ` | Score: ${score}` +
          ` | ${priority ? priority.toUpperCase() : ''}`
        );
      }
    }

    // 平台状态
    if (result.platformStatus) {
      console.log('\n' + BOLD + 'Platform Status:' + RESET);
      console.table(result.platformStatus);
    }
  } catch (err) {
    logError(`Search failed: ${(err as Error).message}`);
  } finally {
    await destroyAdapters(adapters);
  }
}

/**
 * reach — 触达候选人
 */
async function cmdReach(jobId: string, options: { platform?: string; limit?: number; dryRun?: boolean }): Promise<void> {
  logHeader(`Reach Candidates for Job: ${jobId}`);

  const config = loadConfig();
  const job = config.jobs?.[jobId];
  if (!job) {
    logError(`Job "${jobId}" not found in config.`);
    return;
  }

  const dryRun = options.dryRun ?? config.dryRun ?? false;
  if (dryRun) {
    logWarn('DRY RUN MODE — no actual messages will be sent');
  }

  const adapters = await createAdapters(config);
  const platform = options.platform ?? job.platforms?.[0] ?? 'boss';
  const adapter = adapters[platform];

  if (!adapter) {
    logError(`Platform "${platform}" not configured.`);
    await destroyAdapters(adapters);
    return;
  }

  try {
    // 先搜索
    logInfo(`Fetching candidates from ${platform}...`);
    const searchResult = await adapter.getCandidates({
      job: { ...job, id: jobId },
      limit: options.limit ?? 20,
    });

    if (searchResult.candidates.length === 0) {
      logWarn('No candidates found.');
      return;
    }

    logSuccess(`Fetched ${searchResult.candidates.length} candidates`);

    // 运行评估
    const evaluated = evaluateBatch(searchResult.candidates, { ...job, id: jobId });
    const passed = evaluated
      .filter(item => item.result.passed)
      .map(item => ({ ...item.candidate, evaluation: item.result }));
    logInfo(`Passed evaluation: ${passed.length}`);

    if (passed.length === 0) {
      logWarn('No candidates passed evaluation.');
      return;
    }

    // 触达
    let reached = 0;
    let failed = 0;
    const dailyLimit = config.dailyReachLimit ?? 50;

    for (const candidate of passed.slice(0, dailyLimit)) {
      if (dryRun) {
        logInfo(`[DRY RUN] Would reach: ${candidate.name} (${candidate.platform})`);
        reached++;
        continue;
      }

      const message = config.defaultGreetingTemplate ?? `您好！看了您的履历觉得很匹配我们${job.title}的岗位，想进一步了解您的意向，方便聊聊吗？`;

      try {
        const result = await adapter.reachOut({ candidate, message });
        if (result.success) {
          reached++;
          logSuccess(`Reached: ${candidate.name}`);
        } else {
          failed++;
          logWarn(`Failed to reach ${candidate.name}: ${result.error}`);
          if (result.rateLimited) {
            logWarn('Rate limited — stopping.');
            break;
          }
        }
      } catch (err) {
        failed++;
        logError(`Error reaching ${candidate.name}: ${(err as Error).message}`);
      }
    }

    console.log(`\n${BOLD}Summary:${RESET}`);
    console.table({ Searched: searchResult.candidates.length, Passed: passed.length, Reached: reached, Failed: failed });
  } catch (err) {
    logError(`Reach failed: ${(err as Error).message}`);
  } finally {
    await destroyAdapters(adapters);
  }
}

/**
 * run — 完整招聘流程
 */
async function cmdRun(jobId: string, options: { platform?: string; limit?: number; dryRun?: boolean }): Promise<void> {
  logHeader(`Run Full Pipeline for Job: ${jobId}`);

  const config = loadConfig();
  const job = config.jobs?.[jobId];
  if (!job) {
    logError(`Job "${jobId}" not found in config.`);
    return;
  }

  const dryRun = options.dryRun ?? config.dryRun ?? false;

  const adapters = await createAdapters(config);
  const platform = options.platform ?? job.platforms?.[0] ?? 'boss';
  const adapter = adapters[platform];

  if (!adapter) {
    logError(`Platform "${platform}" not configured.`);
    await destroyAdapters(adapters);
    return;
  }

  try {
    // Step 1: Search
    logHeader('Step 1 — Search');
    const searchResult = await adapter.getCandidates({
      job: { ...job, id: jobId },
      limit: options.limit ?? 50,
    });
    logSuccess(`Found ${searchResult.candidates.length} candidates`);

    // Step 2: Evaluate (if not already done by adapter)
    logHeader('Step 2 — Evaluate');
    const evaluated = evaluateBatch(searchResult.candidates, { ...job, id: jobId });
    const passed = evaluated
      .filter(item => item.result.passed)
      .map(item => ({ ...item.candidate, evaluation: item.result }));
    logSuccess(`${passed.length} candidates passed (threshold: ${evaluated[0]?.result.threshold ?? '?'})`);

    // Step 3: Reach
    logHeader('Step 3 — Reach');
    if (dryRun) logWarn('DRY RUN MODE');

    let reached = 0;
    let failed = 0;
    const dailyLimit = config.dailyReachLimit ?? 50;
    const toReach = passed.slice(0, dailyLimit);

    for (let i = 0; i < toReach.length; i++) {
      const candidate = toReach[i];
      const msg = config.defaultGreetingTemplate ?? `您好！看了您的履历觉得很匹配我们${job.title}的岗位，方便聊聊吗？`;

      logInfo(`[${i + 1}/${toReach.length}] ${candidate.name} (score: ${candidate.evaluation?.score})`);

      if (dryRun) {
        reached++;
        continue;
      }

      try {
        const result = await adapter.reachOut({ candidate, message: msg });
        if (result.success) {
          reached++;
          logSuccess(`  ✓ Sent`);
        } else {
          failed++;
          logWarn(`  ✗ ${result.error}`);
          if (result.rateLimited) {
            logWarn('Rate limited — stopping reach phase.');
            break;
          }
        }
      } catch (err) {
        failed++;
        logError(`  ✗ ${(err as Error).message}`);
      }
    }

    // Summary
    logHeader('Pipeline Summary');
    console.log(`
  Platform:     ${platform}
  Job:          ${job.title}
  Searched:     ${searchResult.candidates.length}
  Evaluated:    ${evaluated.length}
  Passed:       ${passed.length}
  Reached:      ${reached}
  Failed:       ${failed}
  Mode:         ${dryRun ? 'DRY RUN' : 'LIVE'}
`);

    if (searchResult.platformStatus) {
      console.log(BOLD + 'Platform Status:' + RESET);
      console.table(searchResult.platformStatus);
    }
  } catch (err) {
    logError(`Pipeline failed: ${(err as Error).message}`);
  } finally {
    await destroyAdapters(adapters);
  }
}

/**
 * list — 列出配置的岗位
 */
async function cmdList(): Promise<void> {
  logHeader('Configured Jobs');

  const config = loadConfig();
  const jobs = config.jobs ?? {};

  if (Object.keys(jobs).length === 0) {
    logWarn('No jobs configured. Run "hireclaw init" to get started.');
    return;
  }

  for (const [id, job] of Object.entries(jobs)) {
    console.log(`\n${BOLD}[${id}]${RESET} ${job.title}`);
    if (job.location) console.log(`  Location: ${job.location}`);
    if (job.platforms) console.log(`  Platforms: ${job.platforms.join(', ')}`);
    console.log(`  Enabled: ${job.enabled !== false ? GREEN + 'Yes' + RESET : RED + 'No' + RESET}`);
  }
}

/**
 * add-job — 添加岗位
 */
async function cmdAddJob(jobId: string, title: string, platforms: string[]): Promise<void> {
  logHeader('Add Job');

  const config = loadConfig();
  if (!config.jobs) config.jobs = {};

  config.jobs[jobId] = {
    id: jobId,
    title,
    platforms,
    filters: {},
  };

  saveConfig(config);
  logSuccess(`Job "${jobId}" added: ${title}`);
  logInfo(`Platforms: ${platforms.join(', ')}`);
  logInfo(`Edit ${DEFAULT_CONFIG_PATH} to configure filters and details.`);
}

// ────────────────────────────────────────────────────────────
// CLI Entry Point
// ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'init': {
        await cmdInit();
        break;
      }

      case 'status': {
        await cmdStatus();
        break;
      }

      case 'list':
      case 'ls': {
        await cmdList();
        break;
      }

      case 'search': {
        const jobId = args[1];
        if (!jobId) {
          logError('Usage: hireclaw search <job-id> [--platform boss|maimai] [--limit N]');
          process.exit(1);
        }
        const platform = extractFlag(args, '--platform', '-p');
        const limit = parseInt(extractFlag(args, '--limit', '-l') ?? '50', 10);
        await cmdSearch(jobId, { platform: platform ?? undefined, limit });
        break;
      }

      case 'reach': {
        const jobId = args[1];
        if (!jobId) {
          logError('Usage: hireclaw reach <job-id> [--platform boss|maimai] [--limit N] [--dry-run]');
          process.exit(1);
        }
        const platform = extractFlag(args, '--platform', '-p');
        const limit = parseInt(extractFlag(args, '--limit', '-l') ?? '20', 10);
        const dryRun = hasFlag(args, '--dry-run', '-n');
        await cmdReach(jobId, { platform: platform ?? undefined, limit, dryRun });
        break;
      }

      case 'run': {
        const jobId = args[1];
        if (!jobId) {
          logError('Usage: hireclaw run <job-id> [--platform boss|maimai] [--limit N] [--dry-run]');
          process.exit(1);
        }
        const platform = extractFlag(args, '--platform', '-p');
        const limit = parseInt(extractFlag(args, '--limit', '-l') ?? '50', 10);
        const dryRun = hasFlag(args, '--dry-run', '-n');
        await cmdRun(jobId, { platform: platform ?? undefined, limit, dryRun });
        break;
      }

      case 'add-job': {
        const jobId = args[1];
        const title = args[2];
        const platforms = args.slice(3);
        if (!jobId || !title || platforms.length === 0) {
          logError('Usage: hireclaw add-job <job-id> <title> <platform1> [platform2 ...]');
          process.exit(1);
        }
        await cmdAddJob(jobId, title, platforms);
        break;
      }

      case '--help':
      case '-h':
      case 'help': {
        printHelp();
        break;
      }

      default: {
        if (command) {
          logError(`Unknown command: ${command}`);
        }
        printHelp();
        process.exit(command ? 1 : 0);
      }
    }
  } catch (err) {
    logError(`Fatal: ${(err as Error).message}`);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
${BOLD}HireClaw CLI${RESET} — 招聘自动化工具

${BOLD}Usage:${RESET}
  hireclaw <command> [options]

${BOLD}Commands:${RESET}
  init               初始化配置文件
  list               列出已配置的岗位
  add-job <id> <title> <platforms...>    添加新岗位
  search <job-id>     搜索候选人
  reach <job-id>      触达候选人（先搜索再触达）
  run <job-id>        完整招聘流程
  status             查看平台状态

${BOLD}Options:${RESET}
  --platform, -p      指定平台 (boss|maimai)
  --limit, -l         结果数量上限
  --dry-run, -n       只评估不实际触达
  --help, -h          显示帮助

${BOLD}Examples:${RESET}
  hireclaw init
  hireclaw add-job algo AI算法工程师 boss maimai
  hireclaw search algo --limit 100
  hireclaw run algo --dry-run
  hireclaw run algo --platform boss --limit 30
  hireclaw status

${BOLD}Config:${RESET}
  ${DEFAULT_CONFIG_PATH}
`);
}

function hasFlag(args: string[], ...names: string[]): boolean {
  return names.some(n => args.includes(n));
}

function extractFlag(args: string[], ...names: string[]): string | null {
  for (let i = 0; i < names.length; i++) {
    const idx = args.indexOf(names[i]);
    if (idx !== -1 && idx + 1 < args.length) {
      return args[idx + 1];
    }
  }
  return null;
}

main();
