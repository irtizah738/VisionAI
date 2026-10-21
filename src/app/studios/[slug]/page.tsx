"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Layers,
  Radar,
  Send,
  BarChart3,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock,
  TrendingUp,
  Sliders,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/home/landing-nav";
import { LandingFooter } from "@/components/home/landing-footer";
import { isWorkspaceAuthenticated } from "@/lib/workspace-auth";

export interface StudioKnowledgeDoc {
  slug: string;
  badge: string;
  name: string;
  headline: string;
  italicHighlight: string;
  summary: string;
  appRoute: string;
  icon: React.ComponentType<{ className?: string }>;
  benchmarks: { metric: string; label: string; context: string }[];
  explicitKnowledge: {
    sectionTitle: string;
    subtitle: string;
    blocks: {
      codeTag: string;
      title: string;
      explanation: string;
      technicalProof: string;
    }[];
  };
  architectureSpecs: { parameter: string; specification: string; impact: string }[];
}

export const STUDIO_KNOWLEDGE_DOCS: Record<string, StudioKnowledgeDoc> = {
  "command-center": {
    slug: "command-center",
    badge: "Studio 01 · Unified Executive Telemetry",
    name: "Executive Command Center",
    headline: "Orchestrate your entire growth pipeline from",
    italicHighlight: "one unified telemetry cockpit.",
    summary:
      "Traditional marketing stacks fragment data across 7 disconnected dashboards. The VisionAI Executive Command Center unifies paid social ROAS, organic velocity, competitor vulnerability alerts, and the 4-Minute Autonomous Campaign Pipeline into a single decision engine.",
    appRoute: "/dashboard",
    icon: LayoutDashboard,
    benchmarks: [
      { metric: "4.4x", label: "Blended Paid Social ROAS", context: "Verified across 1,420+ growth teams" },
      { metric: "14d → 4m", label: "Campaign Turnaround", context: "From brief to 5-network dispatch" },
      { metric: "-38.4%", label: "CAC Reduction", context: "Automated creative fatigue replacement" },
      { metric: "100%", label: "Attribution Clarity", context: "Creative-level revenue receipts" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Architecture: How the Command Center Eliminates Spend Bleed",
      subtitle:
        "Every metric inside the Command Center is tied directly to an executable studio workflow—never passive vanity charts.",
      blocks: [
        {
          codeTag: "PIPELINE_STAGE_01_TO_04",
          title: "The 4-Minute Autonomous Campaign Launchpad",
          explanation:
            "Instead of jumping between copywriters, Figma templates, and scheduling tools, the Command Center guides operators through a deterministic 4-minute sequence: Minute 01 locks Brand Voice DNA & Banned-Buzzword Guardrails; Minute 02 synthesizes 3 psychological hook angles; Minute 03 verifies 9:16/1:1/16:9 mobile safe-zones; Minute 04 dispatches simultaneously across 5 social networks.",
          technicalProof:
            "Reduces average campaign setup overhead from 11.4 hours per drop to 240 seconds.",
        },
        {
          codeTag: "TABULAR_ROAS_TELEMETRY",
          title: "Real-Time Creative Fatigue & Thumb-Stop Auditing",
          explanation:
            "Ad performance degrades the moment frequency crosses 2.8x on Reels or TikTok. The Command Center continuously correlates 3-second thumb-stop rates against CPA spikes and flags fatiguing creatives before they burn your daily budget.",
          technicalProof:
            "Automatically recommends counter-hooks with pre-calculated ROAS lift projections.",
        },
        {
          codeTag: "CROSS_CHANNEL_SYNTHESIS",
          title: "Executive Boardroom & Cohort Export Engine",
          explanation:
            "Generate audit-ready PDF, CSV, and JSON executive briefings that map every dollar of attributed pipeline back to the exact headline angle, visual safe-zone ratio, and social network.",
          technicalProof:
            "Zero manual spreadsheet stitching required for weekly CMO revenue reviews.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Telemetry Refresh Interval",
        specification: "Sub-60s Real-Time Stream + Manual Instant Sync",
        impact: "Catch CPA anomalies before daily ad budgets are exhausted",
      },
      {
        parameter: "Supported Attribution Windows",
        specification: "1-Day View / 7-Day Click / 14-Day Multi-Touch",
        impact: "Eliminates double-counted platform conversions",
      },
      {
        parameter: "Workspace Persistence",
        specification: "Zero-Trust Server Store + Cloud Firestore Sync",
        impact: "Seamless multi-device continuity for distributed growth teams",
      },
    ],
  },
  "fold-aware-canvas": {
    slug: "fold-aware-canvas",
    badge: "Studio 02 · Optical Safe-Zone Engineering",
    name: "Fold-Aware Creative Canvas",
    headline: "Never lose another conversion to",
    italicHighlight: "cropped mobile ad headlines.",
    summary:
      "Native UI overlays on TikTok, Instagram Reels, and YouTube Shorts cover 28% of the vertical 9:16 screen—obscuring the bottom 220px (captions, audio marquee, CTA pills) and right 72px (engagement rail). The Fold-Aware Creative Canvas mathematically locks your hook and CTA inside high-converting optical zones.",
    appRoute: "/creative-canvas",
    icon: Layers,
    benchmarks: [
      { metric: "28%", label: "Screen Obstructed by Native UI", context: "Protected via live TikTok/Reels/Shorts masks" },
      { metric: "4 Sec", label: "Multi-Ratio Synthesis", context: "Simultaneous 9:16, 1:1, and 16:9 adaptation" },
      { metric: "98/100", label: "Avg Optical Thumb-Stop Score", context: "Mathematically verified contrast & hierarchy" },
      { metric: "+41.2%", label: "Mobile CTR Lift", context: "Compared to unmasked static agency banners" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Geometry: The Physics of Mobile Feed Obstructions",
      subtitle:
        "Why standard design tools fail paid social buyers—and how optical safe-zone locking guarantees 100% readable hooks.",
      blocks: [
        {
          codeTag: "SAFE_ZONE_MASK_ENGINE",
          title: "Live Native App UI Obstruction Overlays (TikTok, IG Reels, YT Shorts)",
          explanation:
            "Toggle live pixel-accurate wireframe masks for TikTok, Instagram Reels, and YouTube Shorts directly over your canvas. Inspect exact collision boundaries for the right-side like/comment/share rail and bottom caption/CTA drawers before exporting a single pixel.",
          technicalProof:
            "Prevents 100% of bottom-third CTA overlap errors that kill mobile tap-through rates.",
        },
        {
          codeTag: "MULTI_RATIO_4S_SYNTHESIS",
          title: "Simultaneous 9:16, 1:1, and 16:9 Layout Adaptation",
          explanation:
            "Instead of manually resizing and re-centering typography for vertical stories (9:16), square feeds (1:1), and landscape video/LinkedIn cards (16:9), VisionAI recalculates typographic scale, line breaks, and badge placement across all three ratios in 4 seconds.",
          technicalProof:
            "Exports high-DPI, print-sharp PNG creatives with zero distortion or clipped margins.",
        },
        {
          codeTag: "BRAND_URL_AUTO_EXTRACTOR",
          title: "1-Click Brand URL DNA Extraction & AI Background Synthesis",
          explanation:
            "Paste any brand domain or product URL to automatically populate your brand name, social handle, color palette, and 3 psychological hook angles—then pair them with server-side Gemini visual synthesis.",
          technicalProof:
            "Enforces Brand Voice anti-cliché guardrails on every generated headline.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Vertical 9:16 Safe-Zone Lock",
        specification: "Top 14% Header Guard · Bottom 28% Caption Guard · Right 12% Rail Guard",
        impact: "100% unobstructed headline and CTA visibility on every mobile device",
      },
      {
        parameter: "Aspect Ratios Supported",
        specification: "9:16 (1080×1920), 1:1 (1080×1080), 16:9 (1920×1080)",
        impact: "Covers Reels, TikTok, Shorts, LinkedIn Feed, X, and Meta Feeds in one click",
      },
      {
        parameter: "Export Pipeline",
        specification: "HTML5 Canvas 2x Retina Rasterization + Direct 5-Network Dispatch",
        impact: "Zero compression artifacts when uploaded to ad managers",
      },
    ],
  },
  "competitor-radar": {
    slug: "competitor-radar",
    badge: "Studio 03 · 24/7 Competitive Intelligence",
    name: "Competitor Ambush Radar",
    headline: "Detect rival pricing & ad shifts and",
    italicHighlight: "deploy counter-campaigns in 60 seconds.",
    summary:
      "When a competitor hikes enterprise pricing, suffers shipping delays, or experiences creative fatigue on their top-spending ad angle, waiting two weeks to brief an agency means missing the buyer migration window. Competitor Ambush Radar monitors rivals 24/7 and synthesizes ready-to-launch counter-battlecards.",
    appRoute: "/competitor-intel",
    icon: Radar,
    benchmarks: [
      { metric: "< 60s", label: "Counter-Ad Synthesis", context: "From detected rival shift to fold-safe creative" },
      { metric: "24/7", label: "Automated Surveillance", context: "Tracks pricing pages, ad libraries & sentiment" },
      { metric: "5.2x", label: "Counter-Wedge ROAS", context: "Highest-converting acquisition campaign type" },
      { metric: "100%", label: "Deep-Link Canvas Hand-off", context: "Pre-loads counter-hooks directly into Studio" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Methodology: How Competitive Ambush Marketing Works",
      subtitle:
        "Turn competitor missteps into your lowest-CAC customer acquisition channel.",
      blocks: [
        {
          codeTag: "VULNERABILITY_DETECTION",
          title: "Real-Time Pricing & Ad Fatigue Surveillance",
          explanation:
            "The Radar tracks share-of-voice, engagement velocity, and offer changes across your top direct competitors. When a rival raises prices, gates features behind enterprise tiers, or runs fatigued creative for >21 days, VisionAI isolates the exact buyer pain point.",
          technicalProof:
            "Scores every competitor vulnerability by estimated revenue capture opportunity.",
        },
        {
          codeTag: "COUNTER_BATTLECARD_ENGINE",
          title: "Instant Psychological Counter-Wedge Synthesis",
          explanation:
            "For every detected competitor vulnerability, the Radar generates a complete Counter-Ad Battlecard containing a pattern-interrupt headline, quantified proof subcopy, and a direct risk-reversal CTA tailored to intercept switching buyers.",
          technicalProof:
            "Zero generic comparisons—uses concrete economic and workflow contrasts.",
        },
        {
          codeTag: "ONE_CLICK_AMBUSH_DISPATCH",
          title: "1-Click Deep-Link to Fold-Aware Canvas & Planner Queue",
          explanation:
            "Click 'Open Counter-Ad in Fold-Safe Canvas' on any battlecard to immediately load the pre-configured counter-campaign into the 9:16 Creative Studio, or queue it directly into the 5-Network Social Dispatcher.",
          technicalProof:
            "Compresses competitive response time from 14 days to under 4 minutes.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Tracked Signals",
        specification: "Public Ad Libraries, Pricing Tier Diffs, Engagement Drop-offs, Topic Gaps",
        impact: "Surfaces high-intent switching triggers before competitors can react",
      },
      {
        parameter: "Battlecard Output",
        specification: "Headline + Subcopy + CTA Badge + Channel Recommendation + SOV Chart",
        impact: "Ready for immediate paid & organic deployment",
      },
      {
        parameter: "Studio Integration",
        specification: "URL State Hand-Off to /creative-canvas & /social-media-manager",
        impact: "Zero copy-pasting between intelligence and production",
      },
    ],
  },
  "social-dispatcher": {
    slug: "social-dispatcher",
    badge: "Studio 04 · Multi-Network Publishing Engine",
    name: "5-Network Social Dispatcher",
    headline: "Publish fold-verified campaigns across",
    italicHighlight: "5 social networks in one click.",
    summary:
      "Every social algorithm enforces different character truncation cutoffs, aspect ratios, and API rate limits. The 5-Network Social Dispatcher validates platform-specific fold rules and dispatches across Instagram, TikTok, LinkedIn, X/Twitter, and YouTube with 99.99% SLA reliability.",
    appRoute: "/social-media-manager",
    icon: Send,
    benchmarks: [
      { metric: "5 Networks", label: "Simultaneous Dispatch", context: "IG, TikTok, LinkedIn, X/Twitter, YouTube" },
      { metric: "99.99%", label: "Contractual Dispatch SLA", context: "Backed by 3x exponential backoff auto-retry" },
      { metric: "0", label: "Truncated Hook Surprises", context: "Pre-flight character cutoff verification" },
      { metric: "6.4 hrs", label: "Weekly Ops Saved", context: "Eliminates manual native tab-switching" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Dispatch Engineering: Native Fold Rules & Idempotent Queues",
      subtitle:
        "How VisionAI guarantees your message lands intact and on schedule across every social graph.",
      blocks: [
        {
          codeTag: "TRUNCATION_FOLD_VALIDATOR",
          title: "Channel-by-Channel Fold Truncation Verification",
          explanation:
            "LinkedIn truncates posts with '...see more' around ~210 characters; Instagram truncates captions after ~125 characters; X/Twitter enforces 280 characters for standard posts. The Dispatcher validates that your primary hook and value proposition appear strictly above the truncation fold on every selected network.",
          technicalProof:
            "Increases organic and paid click-through velocity by up to 34%.",
        },
        {
          codeTag: "DEAD_LETTER_AUTO_RETRY",
          title: "Cryptographic Idempotency & Dead-Letter Auto-Retry Queue",
          explanation:
            "Social platform APIs frequently experience transient rate-limits or webhook timeouts during peak hours. VisionAI wraps every scheduled drop in an idempotent transaction with automatic 3x exponential backoff retries so your campaign never double-posts or silently fails.",
          technicalProof:
            "Real-time delivery receipts logged directly to your Command Center.",
        },
        {
          codeTag: "UNIFIED_CALENDAR_QUEUE",
          title: "Visual Multi-Channel Content Calendar & Optimal Timing",
          explanation:
            "Inspect all scheduled, published, and draft drops in a unified calendar view with automated best-time-to-post recommendations based on historical cohort engagement.",
          technicalProof:
            "Supports instant 1-click rescheduling and multi-channel cloning.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Supported Networks",
        specification: "Instagram (Reels/Feed), TikTok, LinkedIn, X/Twitter, YouTube Shorts",
        impact: "Complete coverage of B2B and B2C high-intent social feeds",
      },
      {
        parameter: "Failure Recovery",
        specification: "Automated Dead-Letter Queue + 1-Click Manual Re-Dispatch",
        impact: "Zero lost campaign launches during upstream platform hiccups",
      },
      {
        parameter: "OAuth Security",
        specification: "Least-Privilege Scopes + Encrypted Server-Side Token Vault",
        impact: "Revocable in one click from Workspace Settings",
      },
    ],
  },
  "campaign-builder": {
    slug: "campaign-builder",
    badge: "Studio 05 · Autonomous Campaign Architecture",
    name: "Autonomous Campaign Builder",
    headline: "Architect full-funnel multi-variant campaigns",
    italicHighlight: "from a single strategic brief.",
    summary:
      "Stop launching single-ad guesswork. The Autonomous Campaign Builder transforms one product objective or seasonal offer into a structured, multi-cohort campaign matrix complete with A/B hook variants, budget pacing rules, and channel-specific creative pairings.",
    appRoute: "/campaign-builder",
    icon: Cpu,
    benchmarks: [
      { metric: "3x–5x", label: "Creative Testing Velocity", context: "Structured A/B hook matrices per drop" },
      { metric: "4 Mins", label: "Brief-to-Matrix Build Time", context: "Replaces 2-week agency kickoff cycles" },
      { metric: "+52%", label: "Winner Identification Speed", context: "Isolates winning psychological angles fast" },
      { metric: "100%", label: "Brand Guardrail Compliance", context: "Pre-validated against banned buzzwords" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Campaign Design: Structured Multi-Variant Testing",
      subtitle:
        "Why testing psychological hook angles beats tweaking button colors every single time.",
      blocks: [
        {
          codeTag: "COHORT_MATRIX_ARCHITECT",
          title: "Automated Funnel & Audience Cohort Mapping",
          explanation:
            "Define your campaign objective (Acquisition, Competitor Ambush, Retargeting, or Product Launch) and target buyer persona. The Campaign Builder structures tailored messaging tracks for cold thumb-stopping, mid-funnel proof receipts, and high-urgency conversion.",
          technicalProof:
            "Ensures message-to-cohort alignment across every stage of the buyer journey.",
        },
        {
          codeTag: "BUDGET_PACING_GUARD",
          title: "Algorithmic Budget Allocation & ROAS Floor Protection",
          explanation:
            "Set target CPA ceilings and minimum ROAS floors before launch. The Campaign Builder models projected conversions, click volume, and spend distribution across your selected social channels.",
          technicalProof:
            "Prevents under-performing ad sets from cannibalizing winning creative variants.",
        },
        {
          codeTag: "STUDIO_SYNC_EXPORT",
          title: "Seamless Hand-Off to Attribution & Creative Canvas",
          explanation:
            "Every campaign architected in the Builder is immediately persisted to your workspace store and linked to the Fold-Aware Creative Canvas and Campaign Attribution ledger.",
          technicalProof:
            "End-to-end traceability from initial hypothesis to realized revenue.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Campaign Blueprints",
        specification: "Product Launch, Rival Ambush, High-ROAS Retargeting, Lead Capture",
        impact: "Proven structural templates engineered for paid & organic social",
      },
      {
        parameter: "Variant Generation",
        specification: "Multi-Angle Copy + Multi-Ratio Visual Pairing",
        impact: "Eliminates ad fatigue across high-frequency audiences",
      },
      {
        parameter: "Attribution Linkage",
        specification: "Automatic UTM & Campaign ID Tagging",
        impact: "Instant closed-loop tracking in the Attribution ledger",
      },
    ],
  },
  "campaign-attribution": {
    slug: "campaign-attribution",
    badge: "Studio 06 · Closed-Loop Revenue Ledger",
    name: "Multi-Touch ROAS Attribution",
    headline: "Prove the exact revenue lift of",
    italicHighlight: "every headline, ratio, and channel.",
    summary:
      "Ad managers inflate their own numbers while leaving CMOs in the dark about which creative angle actually drove pipeline. VisionAI's Multi-Touch Campaign Attribution studio reconciles impressions, clicks, conversions, and revenue down to the individual creative hook.",
    appRoute: "/campaigns",
    icon: TrendingUp,
    benchmarks: [
      { metric: "$48.2M+", label: "Verified Client Pipeline", context: "Tracked across 1,400+ active brand workspaces" },
      { metric: "-38.4%", label: "Avg Blended CAC Drop", context: "By reallocating spend to top-decile hooks" },
      { metric: "4.4x", label: "Median Attributed ROAS", context: "Across vertical video & feed placements" },
      { metric: "Real-Time", label: "Cohort ROI Ledger", context: "Instant filtering by status, channel & budget" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Attribution Science: Creative-Level Revenue Receipts",
      subtitle:
        "How VisionAI connects creative geometry and hook psychology directly to bottom-line revenue.",
      blocks: [
        {
          codeTag: "CREATIVE_LEVEL_ROAS",
          title: "Hook-Angle & Aspect-Ratio Performance Decomposition",
          explanation:
            "Instead of only reporting campaign-level totals, VisionAI breaks down ROAS, CTR, and CPA by psychological hook category (Contrarian Pattern-Interrupt vs. Quantified Proof Receipt vs. Competitor Counter-Wedge) and aspect ratio (9:16 vs. 1:1 vs. 16:9).",
          technicalProof:
            "Shows creative teams the exact monetary value of every design decision.",
        },
        {
          codeTag: "BLENDED_CAC_GOVERNANCE",
          title: "Live Budget Utilization & ROI Efficiency Auditing",
          explanation:
            "Monitor active, paused, and completed campaigns in a high-density tabular ledger. Compare allocated budget against actual spend, conversion volume, and realized revenue in real time.",
          technicalProof:
            "Identifies under-utilized high-ROAS campaigns ready for immediate scaling.",
        },
        {
          codeTag: "EXPORTABLE_RECEIPTS",
          title: "1-Click Executive Audit & CFO Receipt Exports",
          explanation:
            "Export clean, verifiable campaign attribution tables for board decks, client retainers, and quarterly financial reconciliation.",
          technicalProof:
            "Full transparency with zero black-box attribution guesswork.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Granularity",
        specification: "Campaign → Channel → Aspect Ratio → Hook Angle",
        impact: "Pinpoints the exact creative variables driving profitable growth",
      },
      {
        parameter: "Metrics Tracked",
        specification: "Spend, Impressions, Clicks, CTR, Conversions, CPA, Revenue, ROAS",
        impact: "Complete unit-economics visibility in a single tabular view",
      },
      {
        parameter: "Data Integrity",
        specification: "De-duplicated Cross-Network Conversion Reconciliation",
        impact: "Prevents over-reporting from overlapping social pixels",
      },
    ],
  },
  "ai-copilot": {
    slug: "ai-copilot",
    badge: "Studio 07 · Neuromarketing & Copy Engine",
    name: "AI Strategy & Copy Copilot",
    headline: "Synthesize high-converting hooks backed by",
    italicHighlight: "behavioral buyer psychology.",
    summary:
      "Generic AI chatbots write robotic, cliché-ridden paragraphs that buyers ignore in 0.4 seconds. The VisionAI Strategy & Copy Copilot is engineered specifically for paid social thumb-stop physics, generating pattern-interrupt hooks, quantified proof receipts, and competitive counter-wedges.",
    appRoute: "/ai-assistant",
    icon: Sparkles,
    benchmarks: [
      { metric: "3 Angles", label: "Psychological Hooks per Brief", context: "Pattern-Interrupt, Proof Receipt & Counter-Wedge" },
      { metric: "1.2 Sec", label: "Thumb-Stop Capture Target", context: "Engineered for high-velocity mobile feeds" },
      { metric: "0", label: "Robotic AI Clichés", context: "Filtered through your Brand Voice banned-word list" },
      { metric: "+64%", label: "Copy Iteration Speed", context: "Instant channel-native variations" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Copy Engineering: The 3 High-ROAS Psychological Angles",
      subtitle:
        "How our server-side Gemini copy engine structures hooks that force buyers to stop scrolling.",
      blocks: [
        {
          codeTag: "ANGLE_01_PATTERN_INTERRUPT",
          title: "Contrarian Pattern-Interrupt Hooks",
          explanation:
            "Challenges a costly status-quo assumption in the first 7 words (e.g., '73% of your ad budget dies in 1.2 seconds of a thumb-scroll'). Designed to break passive scrolling hypnosis on TikTok, Reels, and X.",
          technicalProof:
            "Delivers up to +48% higher 3-second thumb-stop rates on cold audiences.",
        },
        {
          codeTag: "ANGLE_02_QUANTIFIED_PROOF",
          title: "Quantified Proof & Metric Receipt Hooks",
          explanation:
            "Anchors credibility immediately with concrete numbers, timeframes, and verifiable outcomes (e.g., 'How 1,420+ growth teams cut blended CAC by 38.4% in 14 days') rather than vague superlatives.",
          technicalProof:
            "Outperforms generic benefit statements by 2.3x on LinkedIn and Meta feeds.",
        },
        {
          codeTag: "ANGLE_03_COUNTER_WEDGE",
          title: "Competitor Counter-Wedge & Risk-Reversal Hooks",
          explanation:
            "Directly contrasts your 4-minute autonomous workflow or transparent pricing against slow $9,500/mo agency retainers and bloated legacy tools, paired with a zero-risk 14-day trial CTA.",
          technicalProof:
            "Highest bottom-of-funnel conversion rate for switching high-intent buyers.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Inference Engine",
        specification: "Server-Side Gemini Proxy (/api/ai/*) with Structured JSON Schemas",
        impact: "Deterministic, high-speed output with zero client API key exposure",
      },
      {
        parameter: "Scoring Telemetry",
        specification: "Predicted ROAS, Estimated CTR, and Optical Thumb-Stop Score (0–100)",
        impact: "Rank-orders copy variations before spending a dollar on media",
      },
      {
        parameter: "Context Injection",
        specification: "Automatic Brand Voice DNA + Banned-Buzzword Guardrail Injection",
        impact: "Every output sounds authentically like your best in-house strategist",
      },
    ],
  },
  "brand-voice": {
    slug: "brand-voice",
    badge: "Studio 08 · Brand DNA & Compliance Guardrails",
    name: "Brand Voice & Guardrails",
    headline: "Lock in your exact brand tone and",
    italicHighlight: "ban generic AI buzzwords forever.",
    summary:
      "The #1 reason CMOs hesitate to adopt AI creative tools is fear of off-brand, robotic copy that erodes hard-won brand equity. VisionAI's Brand Voice DNA & Guardrails studio enforces your exact tone, target persona, value propositions, and banned-word blocklist across every studio.",
    appRoute: "/settings?tab=brand-voice",
    icon: Sliders,
    benchmarks: [
      { metric: "100%", label: "Banned-Word Enforcement", context: "Blocks prohibited clichés before export" },
      { metric: "Zero-Shot", label: "Cross-Studio DNA Sync", context: "Applies to Canvas, Radar, Copilot & Builder" },
      { metric: "< 30s", label: "Brand Profile Setup", context: "Instant configuration or URL auto-extraction" },
      { metric: "SOC-2", label: "Private Workspace Isolation", context: "Your Brand DNA never trains public models" },
    ],
    explicitKnowledge: {
      sectionTitle: "Explicit Governance: How Brand Voice DNA Locks Across Every Studio",
      subtitle:
        "Programmatic brand governance that scales across every campaign, channel, and team member.",
      blocks: [
        {
          codeTag: "BANNED_WORD_FIREWALL",
          title: "Automated Banned-Buzzword & Cliché Firewall",
          explanation:
            "Specify any words, phrases, or competitor terms your brand refuses to use (e.g., 'synergy', 'delve', 'game-changing', 'unleash', 'revolutionary'). VisionAI injects these negative constraints into every server-side prompt and strips any violating token prior to rendering.",
          technicalProof:
            "Guarantees 100% compliance with executive editorial standards.",
        },
        {
          codeTag: "TONE_AND_PERSONA_LOCK",
          title: "Persistent Tone, Persona & Value Proposition Memory",
          explanation:
            "Define your brand's core tone (e.g., 'Executive, sharp, quantified, contrarian'), target buyer persona, and key differentiators once. Every studio—from the Fold-Aware Canvas to the Competitor Ambush Radar—automatically inherits this context.",
          technicalProof:
            "Eliminates repetitive prompt engineering across your marketing team.",
        },
        {
          codeTag: "VISUAL_IDENTITY_GOVERNANCE",
          title: "Signature Color Palette & Typography Consistency",
          explanation:
            "Pair your verbal guardrails with locked brand hex palettes and high-contrast optical typography presets so every exported 9:16, 1:1, and 16:9 creative is unmistakably yours.",
          technicalProof:
            "Maintains agency-grade visual discipline at 100x the speed.",
        },
      ],
    },
    architectureSpecs: [
      {
        parameter: "Guardrail Scope",
        specification: "Global Workspace Injection (Creative Hooks, Radar, Blog, Social, Chat)",
        impact: "One source of truth governs every AI endpoint in your workspace",
      },
      {
        parameter: "Negative Constraints",
        specification: "Custom Comma-Separated Banned Vocabulary & Compliance Rules",
        impact: "Zero risk of embarrassing AI hallucinations or off-brand phrasing",
      },
      {
        parameter: "Storage Security",
        specification: "Encrypted Workspace Store + Optional Firestore Cloud Backup",
        impact: "Protected behind Zero-Trust Workspace Authentication",
      },
    ],
  },
};

export default function StudioKnowledgePage() {
  const params = useParams();
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "command-center";
  const doc = STUDIO_KNOWLEDGE_DOCS[rawSlug] || STUDIO_KNOWLEDGE_DOCS["command-center"];
  const Icon = doc.icon;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isWorkspaceAuthenticated());
  }, []);

  const targetHref = isLoggedIn
    ? doc.appRoute
    : `/login?callbackUrl=${encodeURIComponent(doc.appRoute)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-600 selection:text-white">
      <LandingNav />

      <main className="flex-1">
        {/* Hero Knowledge Header */}
        <section className="relative overflow-hidden pt-12 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[340px] bg-gradient-to-r from-[#1D39C4]/15 via-[#6D28D9]/15 to-[#A824B4]/15 blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Top Breadcrumb & Auth Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to VisionAI Home
            </Link>

            <div className="inline-flex items-center gap-2 text-xs font-mono">
              {isLoggedIn ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Workspace Authenticated · Direct Studio Access Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
                  <Lock className="h-3.5 w-3.5" />
                  Public Knowledge Specification · Sign In Required to Launch Studio
                </span>
              )}
            </div>
          </div>

          {/* Studio Switcher Pills */}
          <div className="pt-6 flex flex-wrap items-center gap-2">
            {Object.values(STUDIO_KNOWLEDGE_DOCS).map((item) => {
              const active = item.slug === doc.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/studios/${item.slug}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white font-bold shadow-sm"
                      : "bg-white dark:bg-[#0B0F1E] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Main Studio Headline & Explicit Overview */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold">
                <Icon className="h-4 w-4" />
                <span>{doc.badge}</span>
              </div>

              <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold tracking-[-0.033em] text-slate-900 dark:text-white leading-[1.06]">
                {doc.headline}{" "}
                <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
                  {doc.italicHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-[1.64] max-w-[65ch]">
                {doc.summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href={targetHref}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-semibold px-7 h-12 text-sm rounded-2xl shadow-xl shadow-indigo-500/25 gap-2 cursor-pointer border-0"
                  >
                    {isLoggedIn ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Open {doc.name} Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Sign In to Launch {doc.name}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-sm font-semibold rounded-2xl border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] cursor-pointer"
                  >
                    Start 14-Day Free Trial
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quantified Studio Benchmark Card */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              {doc.benchmarks.map((b, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm"
                >
                  <div className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight bg-gradient-to-r from-[#1D39C4] to-[#A824B4] dark:from-blue-400 dark:to-fuchsia-400 bg-clip-text text-transparent tabular-nums">
                    {b.metric}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                    {b.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {b.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explicit Domain Knowledge & Technical Breakdown */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="max-w-3xl mb-10">
            <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold mb-2">
              Explicit Technical &amp; Strategic Knowledge
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.03em]">
              {doc.explicitKnowledge.sectionTitle}
            </h2>
            <p className="mt-2.5 text-base text-slate-600 dark:text-slate-300 leading-[1.6]">
              {doc.explicitKnowledge.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doc.explicitKnowledge.blocks.map((block, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">
                    {block.codeTag}
                  </div>
                  <h3 className="text-xl font-display font-extrabold tracking-[-0.024em] text-slate-900 dark:text-white">
                    {block.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-[1.64]">
                    {block.explanation}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-start gap-2 text-xs sm:text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{block.technicalProof}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architectural Specification Table */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold">
                  Production Engineering Specification
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 tracking-[-0.025em]">
                  {doc.name} — System Parameters &amp; Operational Impact
                </h3>
              </div>
              <Link href={targetHref}>
                <Button className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white text-xs sm:text-sm font-semibold h-10 px-5 rounded-xl border-0 cursor-pointer">
                  {isLoggedIn ? `Enter ${doc.name} →` : `Log In to Access ${doc.name} →`}
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-white/10">
              {doc.architectureSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-sm"
                >
                  <div className="md:col-span-3 font-mono font-bold text-slate-900 dark:text-white">
                    {spec.parameter}
                  </div>
                  <div className="md:col-span-5 font-mono text-indigo-600 dark:text-indigo-400">
                    {spec.specification}
                  </div>
                  <div className="md:col-span-4 text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{spec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
