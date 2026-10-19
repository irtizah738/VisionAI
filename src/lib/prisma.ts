import { PrismaClient } from '@prisma/client';
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

interface VisionAiStoreData {
  users: StoredUser[];
  posts: StoredPost[];
  mentions: StoredMention[];
  socialAccounts: StoredSocialAccount[];
  campaigns: StoredCampaign[];
  streamColumns: StoredStreamColumn[];
  brandVoice: StoredBrandVoice;
  workspaceItems: StoredWorkspaceItem[];
}

const DEFAULT_USER_ID = 'usr_visionai_admin';

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
  workspaceItems: [
    // Content Management Suite items
    {
      id: 'ws_content_1',
      userId: DEFAULT_USER_ID,
      suite: 'content',
      title: '2026 Omnichannel Attribution Benchmark Playbook',
      status: 'published',
      summary: 'Long-form executive guide + 5 social cutdowns analyzing fold truncation across LinkedIn, X, and Instagram.',
      primaryMetric: 28450,
      secondaryMetric: 6.8,
      meta: { type: 'blog', author: 'Alex Morgan', channel: 'LinkedIn & Blog' },
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_content_2',
      userId: DEFAULT_USER_ID,
      suite: 'content',
      title: 'Q4 Product Keynote: Autonomous Social Dispatcher',
      status: 'scheduled',
      summary: 'Video walkthrough and carousel asset pack for YouTube, Instagram Reels, and X native video.',
      primaryMetric: 14200,
      secondaryMetric: 5.4,
      meta: { type: 'video', author: 'Elena Rostova', channel: 'YouTube & Instagram' },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // CRO Experiments Suite items
    {
      id: 'ws_cro_1',
      userId: DEFAULT_USER_ID,
      suite: 'cro',
      title: 'Above-the-Fold Hook Length (115 chars vs 240 chars)',
      status: 'running',
      summary: 'Testing compact ROI-first hook above mobile cutoff against storytelling paragraph on LinkedIn & X.',
      primaryMetric: 4.8,
      secondaryMetric: 96,
      meta: { variantA: '2.9% CTR (240 chars)', variantB: '4.8% CTR (115 chars)', visitors: 18400 },
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_cro_2',
      userId: DEFAULT_USER_ID,
      suite: 'cro',
      title: 'Interactive ROI Calculator vs Static Case Study Card',
      status: 'completed',
      summary: 'Comparing interactive benchmark link cards against static PDF downloads on enterprise landing pages.',
      primaryMetric: 6.2,
      secondaryMetric: 99,
      meta: { variantA: '3.1% Conv', variantB: '6.2% Conv', visitors: 31200 },
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // CRM Integration Contacts & Pipeline items
    {
      id: 'ws_crm_1',
      userId: DEFAULT_USER_ID,
      suite: 'crm',
      title: 'FinScale Enterprise (Marcus Vance - VP Marketing)',
      status: 'qualified',
      summary: 'Engaged with LinkedIn fold preview benchmark; requested multi-workspace OAuth demo for 18 regional pages.',
      primaryMetric: 48000,
      secondaryMetric: 92,
      meta: { email: 'm.vance@finscale.io', segment: 'enterprise', source: 'LinkedIn Organic' },
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_crm_2',
      userId: DEFAULT_USER_ID,
      suite: 'crm',
      title: 'OmniRetail Group (David Chen - Growth Lead)',
      status: 'customer',
      summary: 'Expanded annual seat license after Q3 Instagram + YouTube Shorts automation sprint delivered 3.4x ROAS.',
      primaryMetric: 84000,
      secondaryMetric: 98,
      meta: { email: 'dchen@omniretail.com', segment: 'vip', source: 'Multi-Channel Attribution' },
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Customer Segmentation items
    {
      id: 'ws_seg_1',
      userId: DEFAULT_USER_ID,
      suite: 'segment',
      title: 'High-Velocity B2B SaaS Marketing Leaders',
      status: 'active',
      summary: 'CMOs and VPs of Growth at 50–500 person SaaS companies posting 4+ times/week across LinkedIn & X.',
      primaryMetric: 14800,
      secondaryMetric: 24.5,
      meta: { criteria: 'Role: CMO/VP Growth · Channels: LinkedIn + X · LTV > $25k', primaryChannel: 'LinkedIn' },
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_seg_2',
      userId: DEFAULT_USER_ID,
      suite: 'segment',
      title: 'Omnichannel D2C Creative Studio Teams',
      status: 'active',
      summary: 'Consumer brand social directors managing daily visual drops across Instagram, YouTube Shorts, and Facebook.',
      primaryMetric: 29400,
      secondaryMetric: 31.2,
      meta: { criteria: 'Format: 1:1 & 9:16 Visuals · Frequency: Daily', primaryChannel: 'Instagram' },
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Project Management Kanban Deliverables
    {
      id: 'ws_proj_1',
      userId: DEFAULT_USER_ID,
      suite: 'project',
      title: 'Q4 Omnichannel Social Preview Launch',
      status: 'In Progress',
      summary: 'Coordinate multi-network launch thread and LinkedIn carousel showcasing live fold truncation previews.',
      primaryMetric: 85,
      secondaryMetric: 1,
      meta: { owner: 'Alex Morgan', deadline: '2026-10-24', channel: 'LinkedIn & X', priority: 'High' },
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_proj_2',
      userId: DEFAULT_USER_ID,
      suite: 'project',
      title: 'Technical SEO & Schema.org JSON-LD Rollout',
      status: 'Review',
      summary: 'Audit structured data markup and meta descriptions across all high-intent landing pages.',
      primaryMetric: 92,
      secondaryMetric: 2,
      meta: { owner: 'Elena Rostova', deadline: '2026-10-28', channel: 'SEO Suite', priority: 'Medium' },
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_proj_3',
      userId: DEFAULT_USER_ID,
      suite: 'project',
      title: 'YouTube 16:9 Product Walkthrough Video',
      status: 'To Do',
      summary: 'Record 4K walkthrough demonstrating 1-click omnichannel repurposing from blog to 5 social channels.',
      primaryMetric: 40,
      secondaryMetric: 3,
      meta: { owner: 'Marcus Vance', deadline: '2026-11-02', channel: 'YouTube', priority: 'High' },
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_proj_4',
      userId: DEFAULT_USER_ID,
      suite: 'project',
      title: 'Firebase Firestore Zero-Trust Security Audit',
      status: 'Done',
      summary: 'Verify all 12 Dirty-Dozen red-team payloads and enforce Brand Voice Memory persistence.',
      primaryMetric: 100,
      secondaryMetric: 4,
      meta: { owner: 'Alex Morgan', deadline: '2026-10-18', channel: 'Platform Core', priority: 'Critical' },
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // AI Social Inbox & CX Triage items
    {
      id: 'ws_inbox_1',
      userId: DEFAULT_USER_ID,
      suite: 'inbox',
      title: 'Marcus Vance (VP Marketing @ FinScale) — Enterprise Multi-Page UTM Inquiry',
      status: 'Question',
      summary: 'Does VisionAI Studio support bulk scheduling across 18 regional LinkedIn company pages with custom UTM tagging and role-based approval?',
      primaryMetric: 94,
      secondaryMetric: 48000,
      meta: {
        network: 'linkedin',
        author: 'Marcus Vance',
        handle: 'VP Marketing @ FinScale',
        sentiment: 'Question',
        replied: false,
        escalatedToCrm: true,
        time: '38m ago',
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_inbox_2',
      userId: DEFAULT_USER_ID,
      suite: 'inbox',
      title: 'Sarah Jenkins (@sarahj_growth) — Launch Thread Fold Cutoff Praise',
      status: 'Positive',
      summary: '@VisionAI_HQ The side-by-side LinkedIn + X truncation preview just saved our product launch thread from cutting off the signup link! Huge fan of the command center.',
      primaryMetric: 98,
      secondaryMetric: 18500,
      meta: {
        network: 'twitter',
        author: 'Sarah Jenkins',
        handle: '@sarahj_growth',
        sentiment: 'Positive',
        replied: false,
        escalatedToCrm: false,
        time: '12m ago',
      },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_inbox_3',
      userId: DEFAULT_USER_ID,
      suite: 'inbox',
      title: 'David Chen (Growth Lead @ OmniRetail) — Q4 Benchmark PDF Request',
      status: 'Urgent',
      summary: 'Our executive team is finalizing Q1 social budget allocation today—can you send the Q4 social engagement & fold benchmark PDF mentioned in your post?',
      primaryMetric: 91,
      secondaryMetric: 84000,
      meta: {
        network: 'facebook',
        author: 'David Chen',
        handle: 'Growth Lead @ OmniRetail',
        sentiment: 'Urgent',
        replied: false,
        escalatedToCrm: false,
        time: '2h ago',
      },
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ws_inbox_4',
      userId: DEFAULT_USER_ID,
      suite: 'inbox',
      title: 'Elena Rostova (@elena.creates) — 4:5 Instagram & YouTube 16:9 Workflow Feedback',
      status: 'Positive',
      summary: 'Tested the new 4:5 Instagram feed preview alongside YouTube 16:9 cards—super clean workflow for cross-posting!',
      primaryMetric: 96,
      secondaryMetric: 12000,
      meta: {
        network: 'instagram',
        author: 'Elena Rostova',
        handle: '@elena.creates',
        sentiment: 'Positive',
        replied: true,
        replyText: 'Thank you Elena! Thrilled to hear the 4:5 preview is speeding up your cross-channel workflow.',
        escalatedToCrm: false,
        time: '1h ago',
      },
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: 'sp-1',
      network: 'twitter',
      platforms: ['twitter', 'linkedin'],
      handle: '@VisionAI_HQ',
      content:
        'We just shipped native multi-platform fold & truncation previews inside VisionAI Studio! Preview X, LinkedIn, Instagram, Facebook & YouTube side-by-side before scheduling. https://visionai.studio/launch #SocialMedia #ProductLaunch #MarketingAI',
      scheduledTime: 'Mon, Oct 19 at 2:30 PM',
      dateKey: '2026-10-19',
      presetId: 'preset-analytics',
      scheduledAt: new Date(Date.now() + 3600000 * 3).toISOString(),
      status: 'scheduled',
      likes: 142,
      comments: 28,
      shares: 39,
      reach: '18.4K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sp-2',
      network: 'linkedin',
      platforms: ['linkedin'],
      handle: 'VisionAI Technologies',
      content:
        'Why do 68% of B2B social posts lose engagement at the fold? Because critical CTAs get buried below the "...more" cutoff.\n\nOur latest benchmark report breaks down optimal hook lengths across LinkedIn, X, and Instagram for Q4. https://visionai.studio/benchmarks #B2BMarketing #ContentStrategy #Growth',
      scheduledTime: 'Tue, Oct 20 at 9:00 AM',
      dateKey: '2026-10-20',
      presetId: 'preset-playbook',
      scheduledAt: new Date(Date.now() + 3600000 * 6).toISOString(),
      status: 'scheduled',
      likes: 318,
      comments: 64,
      shares: 82,
      reach: '42.1K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sp-3',
      network: 'instagram',
      platforms: ['instagram', 'facebook'],
      handle: '@visionai.studio',
      content:
        'Behind the scenes of our Q4 Creative Automation workflow ✨ From single brief to 5 channel-native assets in 30 seconds. Link in bio! #CreatorEconomy #DesignSystems #SocialSuite',
      scheduledTime: 'Wed, Oct 21 at 1:15 PM',
      dateKey: '2026-10-21',
      presetId: 'preset-launch',
      scheduledAt: new Date(Date.now() + 3600000 * 20).toISOString(),
      status: 'scheduled',
      likes: 894,
      comments: 91,
      shares: 120,
      reach: '64.8K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sp-4',
      network: 'youtube',
      platforms: ['youtube'],
      handle: 'VisionAI Official',
      content:
        'Full Walkthrough: Building a High-Velocity Social Command Center for 2026 | See how modern marketing teams cut scheduling time by 74% with real-time stream monitoring and native card validation.',
      scheduledTime: 'Thu, Oct 22 at 11:30 AM',
      dateKey: '2026-10-22',
      presetId: 'preset-launch',
      scheduledAt: new Date(Date.now() + 3600000 * 24).toISOString(),
      status: 'scheduled',
      likes: 512,
      comments: 73,
      shares: 95,
      reach: '51.2K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sp-5',
      network: 'facebook',
      platforms: ['facebook'],
      handle: 'VisionAI Official Page',
      content:
        'Join our live executive workshop this Friday: Mastering Multi-Channel Social Growth with Real-Time Telemetry & Brand Voice Memory. Reserve your seat at https://visionai.io/events #DigitalMarketing #VisionAI',
      scheduledTime: 'Fri, Oct 23 at 4:00 PM',
      dateKey: '2026-10-23',
      presetId: 'preset-analytics',
      scheduledAt: new Date(Date.now() + 3600000 * 36).toISOString(),
      status: 'scheduled',
      likes: 275,
      comments: 34,
      shares: 51,
      reach: '29.4K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pub-1',
      network: 'linkedin',
      platforms: ['linkedin', 'twitter'],
      handle: 'VisionAI Technologies',
      content:
        'Customer Story: How Acme Cloud scaled organic pipeline by 3.4x using unified social streams and AI-assisted hook optimization. Read the full breakdown: https://visionai.studio/cases/acme #SaaS #CustomerSuccess',
      scheduledTime: 'Published 3h ago',
      publishedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      status: 'published',
      likes: 642,
      comments: 87,
      shares: 134,
      reach: '78.9K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'pub-2',
      network: 'twitter',
      platforms: ['twitter'],
      handle: '@VisionAI_HQ',
      content:
        'Hot take: Scheduling posts without checking mobile fold truncation first is like shipping code without running tests. Always inspect the cutoff line! #MarketingOps #SocialMediaManager',
      scheduledTime: 'Published Yesterday',
      publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'published',
      likes: 489,
      comments: 53,
      shares: 112,
      reach: '54.3K',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  mentions: [
    {
      id: 'm-1',
      network: 'twitter',
      author: 'Sarah Jenkins',
      handle: '@sarahj_growth',
      avatar: 'SJ',
      content:
        '@VisionAI_HQ The side-by-side LinkedIn + X truncation preview just saved our product launch thread from cutting off the signup link! Huge fan of the new command center.',
      time: '12m ago',
      sentiment: 'Positive',
      replied: false,
    },
    {
      id: 'm-2',
      network: 'linkedin',
      author: 'Marcus Vance',
      handle: 'VP Marketing @ FinScale',
      avatar: 'MV',
      content:
        'Does VisionAI Studio support bulk scheduling across multiple regional LinkedIn company pages with custom UTM tagging?',
      time: '38m ago',
      sentiment: 'Question',
      replied: false,
    },
    {
      id: 'm-3',
      network: 'instagram',
      author: 'Elena Rostova',
      handle: '@elena.creates',
      avatar: 'ER',
      content:
        'Tested the new 4:5 Instagram feed preview alongside YouTube 16:9 cards—super clean workflow for cross-posting!',
      time: '1h ago',
      sentiment: 'Positive',
      replied: true,
      replyText: 'Thank you Elena! Thrilled to hear the 4:5 preview is speeding up your workflow.',
    },
    {
      id: 'm-4',
      network: 'facebook',
      author: 'David Chen',
      handle: 'Growth Lead @ OmniRetail',
      avatar: 'DC',
      content:
        'Can your team share the Q4 social engagement benchmark PDF mentioned in today’s post?',
      time: '2h ago',
      sentiment: 'Question',
      replied: false,
    },
  ],
  socialAccounts: [
    {
      id: 'acc_twitter',
      provider: 'twitter',
      accountName: 'VisionAI Official',
      handle: '@VisionAI_HQ',
      followers: '48.2K',
      status: 'connected',
      lastSynced: '2 mins ago',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'acc_linkedin',
      provider: 'linkedin',
      accountName: 'VisionAI Technologies',
      handle: 'linkedin.com/company/visionai',
      followers: '112.5K',
      status: 'connected',
      lastSynced: '4 mins ago',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'acc_instagram',
      provider: 'instagram',
      accountName: 'VisionAI Studio',
      handle: '@visionai.studio',
      followers: '84.9K',
      status: 'connected',
      lastSynced: '5 mins ago',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'acc_facebook',
      provider: 'facebook',
      accountName: 'VisionAI Official Page',
      handle: 'fb.com/VisionAIStudio',
      followers: '63.1K',
      status: 'connected',
      lastSynced: '10 mins ago',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'acc_youtube',
      provider: 'youtube',
      accountName: 'VisionAI Official Channel',
      handle: 'youtube.com/@VisionAI',
      followers: '95.4K',
      status: 'connected',
      lastSynced: '8 mins ago',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  campaigns: [
    {
      id: 'camp_1',
      name: 'Q4 Product Launch — Multi-Network Social Blitz',
      description: 'Coordinated launch campaign across X, LinkedIn, Instagram, and YouTube showcasing live native post previews.',
      type: 'multi-channel',
      status: 'active',
      budget: 18500,
      spent: 11240,
      impressions: 428900,
      clicks: 19450,
      conversions: 1420,
      roi: 340,
      channels: ['twitter', 'linkedin', 'instagram', 'youtube'],
      startDate: '2026-10-01',
      endDate: '2026-12-31',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'camp_2',
      name: 'Enterprise B2B Thought Leadership Series',
      description: 'Executive LinkedIn & Email sequence targeting Marketing VPs and Growth Directors.',
      type: 'social',
      status: 'active',
      budget: 12000,
      spent: 6850,
      impressions: 215400,
      clicks: 11280,
      conversions: 890,
      roi: 295,
      channels: ['linkedin', 'email'],
      startDate: '2026-10-10',
      endDate: '2026-11-30',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'camp_3',
      name: 'Creator Economy Instagram & YouTube Shorts Push',
      description: 'Visual storytelling and short-form video series highlighting 1-click AI content adaptation.',
      type: 'content',
      status: 'paused',
      budget: 8500,
      spent: 4100,
      impressions: 189000,
      clicks: 8400,
      conversions: 540,
      roi: 215,
      channels: ['instagram', 'youtube', 'facebook'],
      startDate: '2026-09-15',
      endDate: '2026-11-15',
      userId: DEFAULT_USER_ID,
      createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
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
};

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
        posts: parsed.posts?.length ? parsed.posts : INITIAL_STORE_DATA.posts,
        mentions: parsed.mentions?.length ? parsed.mentions : INITIAL_STORE_DATA.mentions,
        socialAccounts: parsed.socialAccounts?.length
          ? parsed.socialAccounts
          : INITIAL_STORE_DATA.socialAccounts,
        campaigns: parsed.campaigns?.length ? parsed.campaigns : INITIAL_STORE_DATA.campaigns,
        streamColumns: parsed.streamColumns?.length
          ? parsed.streamColumns
          : INITIAL_STORE_DATA.streamColumns,
        brandVoice: parsed.brandVoice?.brandName
          ? parsed.brandVoice
          : INITIAL_STORE_DATA.brandVoice,
        workspaceItems: (() => {
          const existing = parsed.workspaceItems?.length
            ? [...parsed.workspaceItems]
            : [...INITIAL_STORE_DATA.workspaceItems];
          const existingIds = new Set(existing.map((i) => i.id));
          for (const seedItem of INITIAL_STORE_DATA.workspaceItems) {
            if (!existingIds.has(seedItem.id)) {
              existing.push(seedItem);
            }
          }
          return existing;
        })(),
      };
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
  return {
    state,
    save: () => saveStoreToDisk(state),
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
