import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface StoredPost {
  id: string;
  network: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  platforms: string[];
  handle: string;
  content: string;
  scheduledTime: string;
  dateKey?: string;
  presetId?: string | null;
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published';
  likes: number;
  comments: number;
  shares: number;
  reach: string;
  mediaUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredMention {
  id: string;
  network: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  author: string;
  handle: string;
  avatar: string;
  content: string;
  time: string;
  sentiment: 'Positive' | 'Neutral' | 'Question' | 'Urgent';
  replied: boolean;
  replyText?: string;
}

export interface StoredSocialAccount {
  id: string;
  provider: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  accountName: string;
  handle: string;
  followers: string;
  status: 'connected' | 'disconnected';
  lastSynced: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  refreshTokenAvailable?: boolean;
  tokenStatus?: 'valid' | 'expiring_soon' | 'expired';
  scopes?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredCampaign {
  id: string;
  name: string;
  description: string;
  type: 'social' | 'email' | 'seo' | 'multi-channel' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  channels: string[];
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  timezone: string;
  language: string;
  bio: string;
  avatarUrl: string;
  notifications: {
    emailDigest: boolean;
    publishAlerts: boolean;
    mentionAlerts: boolean;
    weeklyReports: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StoredBrandVoice {
  id: string;
  userId: string;
  brandName: string;
  tone: string;
  targetAudience: string;
  keyPillars: string;
  bannedWords: string;
  ctaStyle: string;
  enabled: boolean;
  updatedAt: string;
}

export interface StoredWorkspaceItem {
  id: string;
  userId: string;
  suite: 'content' | 'cro' | 'crm' | 'segment' | 'project' | 'inbox';
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface StoredStreamColumn {
  id: string;
  title: string;
  network: 'all' | 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  type: 'scheduled' | 'mentions' | 'published' | 'analytics';
  position: number;
}

export interface StoredDispatchJob {
  id: string;
  postId: string;
  network: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  handle: string;
  contentPreview: string;
  status: 'queued' | 'processing' | 'published' | 'retrying' | 'dead_letter';
  attempts: number;
  maxAttempts: number;
  scheduledAt?: string;
  nextRetryAt?: string;
  idempotencyKey: string;
  lastError?: string;
  externalUrl?: string;
  latencyMs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredWebhookEvent {
  id: string;
  provider: 'hubspot' | 'stripe';
  eventType: string;
  signatureVerified: boolean;
  signatureMode: 'hmac-sha256' | 'sandbox-signed';
  payloadSummary: string;
  status: 'processed' | 'rejected';
  latencyMs: number;
  processedAt: string;
}

export interface VisionAiStoreData {
  users: StoredUser[];
  posts: StoredPost[];
  mentions: StoredMention[];
  socialAccounts: StoredSocialAccount[];
  campaigns: StoredCampaign[];
  streamColumns: StoredStreamColumn[];
  brandVoice: StoredBrandVoice;
  workspaceItems: StoredWorkspaceItem[];
  dispatchQueue: StoredDispatchJob[];
  webhookLedger: StoredWebhookEvent[];
}

const DEFAULT_USER_ID = 'usr_visionai_admin';

export function computeIdempotencyKey(
  userId: string,
  network: string,
  content: string,
  scheduledTime: string
): string {
  const hash = crypto
    .createHash('sha256')
    .update(`${userId}|${network}|${content.trim()}|${scheduledTime}`)
    .digest('hex')
    .slice(0, 12);
  return `idem_${network.slice(0, 2)}_${hash}`;
}

const INITIAL_DISPATCH_QUEUE: StoredDispatchJob[] = [
  {
    id: 'job_queued_x_01',
    postId: 'post_x_q4_bench',
    network: 'twitter',
    handle: '@VisionAI_HQ',
    contentPreview: 'Q4 Omnichannel Benchmark: Teams using fold-aware social previews see +38% higher CTR above the mobile cutoff. https://visionai.studio/launch',
    status: 'queued',
    attempts: 0,
    maxAttempts: 3,
    idempotencyKey: 'idem_tw_8f91a2c4b012',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    updatedAt: new Date(Date.now() - 1800_000).toISOString(),
  },
  {
    id: 'job_retry_ig_02',
    postId: 'post_ig_reel_sync',
    network: 'instagram',
    handle: '@visionai.studio',
    contentPreview: 'Carousel + Reel Hook Preview: Stop losing 42% of mobile engagement to mid-sentence truncation. #GrowthMarketing #B2BSaaS',
    status: 'retrying',
    attempts: 2,
    maxAttempts: 3,
    nextRetryAt: new Date(Date.now() + 4_000).toISOString(),
    idempotencyKey: 'idem_in_3c90e1f455a2',
    lastError: 'HTTP 429 Too Many Requests (Instagram Graph API container rate limit) — Exponential Backoff 4s',
    latencyMs: 310,
    createdAt: new Date(Date.now() - 2400_000).toISOString(),
    updatedAt: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    id: 'job_dlq_youtube_01',
    postId: 'post_yt_short_09',
    network: 'youtube',
    handle: 'youtube.com/@VisionAI',
    contentPreview: 'VisionAI Studio 2.5 Walkthrough: Zero-Trust Firestore Persistence & Multi-Channel Attribution in 60 Seconds',
    status: 'dead_letter',
    attempts: 3,
    maxAttempts: 3,
    idempotencyKey: 'idem_yo_1a2b3c4d5e6f',
    lastError: 'HTTP 503 Upstream Timeout after 3 attempts (1s → 4s → 16s backoff exhausted). Ready for manual DLQ replay.',
    latencyMs: 485,
    createdAt: new Date(Date.now() - 5400_000).toISOString(),
    updatedAt: new Date(Date.now() - 35_000).toISOString(),
  },
  {
    id: 'job_pub_li_01',
    postId: 'post_li_exec_01',
    network: 'linkedin',
    handle: 'linkedin.com/company/visionai',
    contentPreview: 'Why B2B CMOs are replacing fragmented schedulers with unified Brand Voice Memory and deterministic pipeline attribution.',
    status: 'published',
    attempts: 1,
    maxAttempts: 3,
    idempotencyKey: 'idem_li_98234a771c09',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7253918201',
    latencyMs: 162,
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    updatedAt: new Date(Date.now() - 180_000).toISOString(),
  },
];

const INITIAL_WEBHOOK_LEDGER: StoredWebhookEvent[] = [
  {
    id: 'wh_stripe_01',
    provider: 'stripe',
    eventType: 'checkout.session.completed',
    signatureVerified: true,
    signatureMode: 'hmac-sha256',
    payloadSummary: 'Enterprise Growth Annual Plan ($499.00) • customer@visionai.studio',
    status: 'processed',
    latencyMs: 28,
    processedAt: new Date(Date.now() - 75_000).toISOString(),
  },
  {
    id: 'wh_hubspot_01',
    provider: 'hubspot',
    eventType: 'deal.propertyChange',
    signatureVerified: true,
    signatureMode: 'hmac-sha256',
    payloadSummary: 'HubSpot Deal #948210 updated dealstage → closedwon ($18,500 ARR attributed)',
    status: 'processed',
    latencyMs: 34,
    processedAt: new Date(Date.now() - 210_000).toISOString(),
  },
];

const INITIAL_STORE_DATA: VisionAiStoreData = {
  users: [
    {
      id: DEFAULT_USER_ID,
      name: 'Alex Morgan',
      email: 'admin@vision.ai',
      role: 'VP of Growth & Social',
      company: 'VisionAI Technologies',
      timezone: 'America/New_York',
      language: 'en',
      bio: 'Leading multi-channel social strategy, AI content velocity, and brand engagement across 5 global channels.',
      avatarUrl: 'https://placehold.co/100x100.png',
      notifications: {
        emailDigest: true,
        publishAlerts: true,
        mentionAlerts: true,
        weeklyReports: true,
      },
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  brandVoice: {
    id: 'bv_default',
    userId: DEFAULT_USER_ID,
    brandName: 'VisionAI Technologies',
    tone: 'Authoritative, Data-Driven & Executive',
    targetAudience: 'B2B SaaS CMOs, VPs of Growth, and Social Media Directors',
    keyPillars:
      '1. Fold-Aware Native Previews above the mobile cutoff\n2. Quantifiable Multi-Network Pipeline Attribution (4.2x ROI)\n3. Zero-Slop Executive Clarity & High-Contrast Visuals',
    bannedWords: 'synergy, delve, game-changer, revolutionary, unleash',
    ctaStyle: 'Include a direct benchmark URL (https://visionai.studio/launch) with concrete ROI metrics before the fold.',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  workspaceItems: [],
  posts: [],
  mentions: [],
  socialAccounts: [],
  campaigns: [],
  streamColumns: [
    {
      id: 'col-scheduled',
      title: 'Scheduled Queue (All Networks)',
      network: 'all',
      type: 'scheduled',
      position: 0,
    },
    {
      id: 'col-mentions',
      title: 'Unified Mentions & Inbox',
      network: 'all',
      type: 'mentions',
      position: 1,
    },
    {
      id: 'col-published',
      title: 'Published & Live Metrics',
      network: 'all',
      type: 'published',
      position: 2,
    },
  ],
  dispatchQueue: INITIAL_DISPATCH_QUEUE,
  webhookLedger: INITIAL_WEBHOOK_LEDGER,
};

const LEGACY_SEED_POST_IDS = new Set(['sp-1', 'sp-2', 'sp-3', 'sp-4', 'sp-5', 'pub-1', 'pub-2', 'pub-3']);
const LEGACY_SEED_MENTION_IDS = new Set(['m-1', 'm-2', 'm-3', 'm-4', 'men-1', 'men-2', 'men-3']);
const LEGACY_SEED_CAMPAIGN_IDS = new Set(['camp_1', 'camp_2', 'camp_3']);
const LEGACY_SEED_WORKSPACE_IDS = new Set([
  'ws_content_1', 'ws_content_2',
  'ws_cro_1', 'ws_cro_2',
  'ws_crm_1', 'ws_crm_2',
  'ws_seg_1', 'ws_seg_2',
  'ws_proj_1', 'ws_proj_2', 'ws_proj_3', 'ws_proj_4',
  'ws_inbox_1', 'ws_inbox_2', 'ws_inbox_3', 'ws_inbox_4',
]);

const STORE_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(STORE_DIR, 'visionai-store.json');

declare global {
  // eslint-disable-next-line no-var
  var __visionAiStore: VisionAiStoreData | undefined;
}

function loadStoreFromDisk(): VisionAiStoreData {
  if (global.__visionAiStore) {
    return global.__visionAiStore;
  }
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<VisionAiStoreData>;
      global.__visionAiStore = {
        users: parsed.users?.length ? parsed.users : INITIAL_STORE_DATA.users,
        posts: Array.isArray(parsed.posts)
          ? parsed.posts.filter((p) => !LEGACY_SEED_POST_IDS.has(p.id))
          : [],
        mentions: Array.isArray(parsed.mentions)
          ? parsed.mentions.filter((m) => !LEGACY_SEED_MENTION_IDS.has(m.id))
          : [],
        socialAccounts: Array.isArray(parsed.socialAccounts)
          ? parsed.socialAccounts
          : [],
        campaigns: Array.isArray(parsed.campaigns)
          ? parsed.campaigns.filter((c) => !LEGACY_SEED_CAMPAIGN_IDS.has(c.id))
          : [],
        streamColumns: parsed.streamColumns?.length
          ? parsed.streamColumns
          : INITIAL_STORE_DATA.streamColumns,
        brandVoice: parsed.brandVoice?.brandName
          ? parsed.brandVoice
          : INITIAL_STORE_DATA.brandVoice,
        workspaceItems: Array.isArray(parsed.workspaceItems)
          ? parsed.workspaceItems.filter((w) => !LEGACY_SEED_WORKSPACE_IDS.has(w.id))
          : [],
        dispatchQueue:
          Array.isArray(parsed.dispatchQueue) && parsed.dispatchQueue.length > 0
            ? parsed.dispatchQueue
            : INITIAL_DISPATCH_QUEUE,
        webhookLedger:
          Array.isArray(parsed.webhookLedger) && parsed.webhookLedger.length > 0
            ? parsed.webhookLedger
            : INITIAL_WEBHOOK_LEDGER,
      };
      saveStoreToDisk(global.__visionAiStore);
      return global.__visionAiStore;
    }
  } catch (err) {
    console.warn('[VisionAI Store] Failed to read .data/visionai-store.json, using defaults:', err);
  }

  global.__visionAiStore = JSON.parse(JSON.stringify(INITIAL_STORE_DATA));
  saveStoreToDisk(global.__visionAiStore!);
  return global.__visionAiStore!;
}

function saveStoreToDisk(data: VisionAiStoreData) {
  global.__visionAiStore = data;
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[VisionAI Store] Could not persist store to disk:', err);
  }
}

export function getVisionAiStore() {
  const state = loadStoreFromDisk();

  const addItem = (
    item: Omit<StoredWorkspaceItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
      id?: string;
      userId?: string;
    }
  ) => {
    const now = new Date().toISOString();
    const record: StoredWorkspaceItem = {
      id: item.id || `ws_${item.suite}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: item.userId || DEFAULT_USER_ID,
      suite: item.suite,
      title: item.title,
      status: item.status,
      summary: item.summary,
      primaryMetric: Number(item.primaryMetric) || 0,
      secondaryMetric: Number(item.secondaryMetric) || 0,
      meta: item.meta,
      createdAt: now,
      updatedAt: now,
    };
    state.workspaceItems.unshift(record);
    saveStoreToDisk(state);
    return record;
  };

  const enqueueDispatchJob = (params: {
    postId: string;
    network: StoredDispatchJob['network'];
    handle: string;
    content: string;
    scheduledTime?: string;
    scheduledAt?: string;
    status?: StoredDispatchJob['status'];
    attempts?: number;
    externalUrl?: string;
    latencyMs?: number;
    lastError?: string;
  }) => {
    const now = new Date().toISOString();
    const idemKey = computeIdempotencyKey(
      DEFAULT_USER_ID,
      params.network,
      params.content,
      params.scheduledTime || now
    );

    const existing = state.dispatchQueue.find((j) => j.idempotencyKey === idemKey);
    if (existing) {
      existing.status = params.status || existing.status;
      existing.attempts = params.attempts ?? existing.attempts;
      existing.scheduledAt = params.scheduledAt ?? existing.scheduledAt;
      existing.externalUrl = params.externalUrl ?? existing.externalUrl;
      existing.latencyMs = params.latencyMs ?? existing.latencyMs;
      existing.lastError = params.lastError ?? existing.lastError;
      existing.updatedAt = now;
      saveStoreToDisk(state);
      return existing;
    }

    const job: StoredDispatchJob = {
      id: `job_${params.network}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      postId: params.postId,
      network: params.network,
      handle: params.handle,
      contentPreview: params.content.slice(0, 180),
      status: params.status || 'queued',
      attempts: params.attempts ?? 0,
      maxAttempts: 3,
      scheduledAt: params.scheduledAt,
      idempotencyKey: idemKey,
      externalUrl: params.externalUrl,
      latencyMs: params.latencyMs,
      lastError: params.lastError,
      createdAt: now,
      updatedAt: now,
    };

    state.dispatchQueue.unshift(job);
    saveStoreToDisk(state);
    return job;
  };

  const recordWebhookEvent = (
    evt: Omit<StoredWebhookEvent, 'id' | 'processedAt'> & { id?: string }
  ) => {
    const entry: StoredWebhookEvent = {
      id: evt.id || `wh_${evt.provider}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      provider: evt.provider,
      eventType: evt.eventType,
      signatureVerified: evt.signatureVerified,
      signatureMode: evt.signatureMode,
      payloadSummary: evt.payloadSummary,
      status: evt.status,
      latencyMs: evt.latencyMs,
      processedAt: new Date().toISOString(),
    };
    state.webhookLedger.unshift(entry);
    if (state.webhookLedger.length > 50) {
      state.webhookLedger.length = 50;
    }
    saveStoreToDisk(state);
    return entry;
  };

  return {
    state,
    save: () => saveStoreToDisk(state),
    addItem,
    enqueueDispatchJob,
    recordWebhookEvent,
  };
}

export function getBrandVoicePromptContext(overrideVoice?: Partial<StoredBrandVoice>): string {
  const { state } = getVisionAiStore();
  const bv = { ...state.brandVoice, ...(overrideVoice || {}) };
  if (bv.enabled === false) return '';

  return [
    `=== ACTIVE WORKSPACE BRAND VOICE MEMORY ===`,
    `Brand Name: ${bv.brandName}`,
    `Signature Tone: ${bv.tone}`,
    `Target Audience / ICP: ${bv.targetAudience}`,
    `Core Messaging Pillars: ${bv.keyPillars}`,
    bv.bannedWords ? `Banned Words (NEVER USE): ${bv.bannedWords}` : '',
    `Preferred CTA Pattern: ${bv.ctaStyle}`,
    `===========================================`,
  ]
    .filter(Boolean)
    .join('\n');
}

let rawPrisma: PrismaClient | null = null;
if (process.env.DATABASE_URL) {
  try {
    rawPrisma = new PrismaClient();
  } catch {
    rawPrisma = null;
  }
}

function createCollectionAdapter<T extends { id: string }>(
  key: keyof VisionAiStoreData
) {
  return {
    findMany: async (args?: any): Promise<T[]> => {
      const { state } = getVisionAiStore();
      let list = [...(state[key] as unknown as T[])];
      if (args?.where) {
        list = list.filter((item: any) => {
          return Object.entries(args.where).every(([k, v]) => {
            if (v === undefined) return true;
            return item[k] === v;
          });
        });
      }
      return list;
    },
    findFirst: async (args?: any): Promise<T | null> => {
      const { state } = getVisionAiStore();
      const list = state[key] as unknown as T[];
      if (!args?.where) return list[0] || null;
      return (
        list.find((item: any) =>
          Object.entries(args.where).every(([k, v]) =>
            v === undefined ? true : item[k] === v
          )
        ) || null
      );
    },
    findUnique: async (args?: any): Promise<T | null> => {
      const { state } = getVisionAiStore();
      const list = state[key] as unknown as T[];
      if (!args?.where) return list[0] || null;
      return (
        list.find((item: any) =>
          Object.entries(args.where).every(([k, v]) => item[k] === v)
        ) || list[0] || null
      );
    },
    create: async (args: { data: Partial<T> }): Promise<T> => {
      const { state, save } = getVisionAiStore();
      const list = state[key] as unknown as T[];
      const now = new Date().toISOString();
      const newItem = {
        id: (args.data as any)?.id || `${String(key).slice(0, 3)}_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        ...args.data,
      } as unknown as T;
      list.unshift(newItem);
      save();
      return newItem;
    },
    update: async (args: { where: { id: string }; data: Partial<T> }): Promise<T> => {
      const { state, save } = getVisionAiStore();
      const list = state[key] as unknown as T[];
      const idx = list.findIndex((item) => item.id === args.where?.id);
      const now = new Date().toISOString();
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...args.data,
          updatedAt: now,
        };
        save();
        return list[idx];
      }
      if (key === 'users' && list.length > 0) {
        list[0] = {
          ...list[0],
          ...args.data,
          updatedAt: now,
        };
        save();
        return list[0];
      }
      const created = {
        id: args.where?.id || `${String(key).slice(0, 3)}_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        ...args.data,
      } as unknown as T;
      list.push(created);
      save();
      return created;
    },
    delete: async (args: { where: { id: string } }): Promise<T | null> => {
      const { state, save } = getVisionAiStore();
      const list = state[key] as unknown as T[];
      const idx = list.findIndex((item) => item.id === args.where?.id);
      if (idx !== -1) {
        const [removed] = list.splice(idx, 1);
        save();
        return removed;
      }
      return null;
    },
    count: async (): Promise<number> => {
      const { state } = getVisionAiStore();
      return (state[key] as unknown as T[]).length;
    },
  };
}

const modelMap: Record<string, keyof VisionAiStoreData> = {
  user: 'users',
  post: 'posts',
  mention: 'mentions',
  socialAccount: 'socialAccounts',
  campaign: 'campaigns',
  streamColumn: 'streamColumns',
  workspaceItem: 'workspaceItems',
  dispatchJob: 'dispatchQueue',
  webhookEvent: 'webhookLedger',
};

const prismaProxy = new Proxy({} as any, {
  get(_target, prop: string) {
    if (prop.startsWith('$')) {
      return async () => [];
    }
    const mappedKey = modelMap[prop];
    if (mappedKey) {
      return createCollectionAdapter(mappedKey);
    }
    if (rawPrisma && prop in rawPrisma) {
      return (rawPrisma as any)[prop];
    }
    return createCollectionAdapter('posts');
  },
});

export { prismaProxy as prisma };
export default prismaProxy;
