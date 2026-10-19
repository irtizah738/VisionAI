"use client";

import React, { useState, useMemo } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ThumbsUp,
  MessageCircle,
  Repeat,
  Share2,
  Bookmark,
  Globe,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Play,
  Heart,
  Send,
  BarChart2,
  Columns,
  Layout,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

export type SocialNetwork = "twitter" | "linkedin" | "instagram" | "facebook" | "youtube";

export interface PlatformSpec {
  id: SocialNetwork;
  name: string;
  shortName: string;
  maxChars: number;
  foldChars: number;
  foldLabel: string;
  aspectRatioLabel: string;
  accentTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
}

export const PLATFORM_SPECS: Record<SocialNetwork, PlatformSpec> = {
  twitter: {
    id: "twitter",
    name: "X / Twitter",
    shortName: "X",
    maxChars: 280,
    foldChars: 280,
    foldLabel: "Show more",
    aspectRatioLabel: "16:9 Landscape",
    accentTextClass: "text-sky-500",
    accentBgClass: "bg-sky-500",
    accentBorderClass: "border-sky-500/30",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    shortName: "LinkedIn",
    maxChars: 3000,
    foldChars: 210,
    foldLabel: "…see more",
    aspectRatioLabel: "1.91:1 Editorial",
    accentTextClass: "text-blue-600 dark:text-blue-400",
    accentBgClass: "bg-blue-600",
    accentBorderClass: "border-blue-600/30",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    shortName: "Instagram",
    maxChars: 2200,
    foldChars: 125,
    foldLabel: "…more",
    aspectRatioLabel: "1:1 Square",
    accentTextClass: "text-pink-600 dark:text-pink-400",
    accentBgClass: "bg-pink-600",
    accentBorderClass: "border-pink-500/30",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    shortName: "Facebook",
    maxChars: 63206,
    foldChars: 250,
    foldLabel: "See more",
    aspectRatioLabel: "16:9 / 4:5 Feed",
    accentTextClass: "text-blue-500",
    accentBgClass: "bg-blue-500",
    accentBorderClass: "border-blue-500/30",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    shortName: "YouTube",
    maxChars: 5000,
    foldChars: 150,
    foldLabel: "Read more",
    aspectRatioLabel: "16:9 HD Video",
    accentTextClass: "text-red-600 dark:text-red-400",
    accentBgClass: "bg-red-600",
    accentBorderClass: "border-red-500/30",
  },
};

export interface MediaPreset {
  id: string;
  label: string;
  category: string;
  aspect: string;
  gradient: string;
  headline: string;
  subline: string;
  metric: string;
}

export const MEDIA_PRESETS: MediaPreset[] = [
  {
    id: "preset-analytics",
    label: "Q4 Pipeline Velocity Report",
    category: "Data Visualization",
    aspect: "16:9",
    gradient: "from-slate-900 via-blue-950 to-slate-900",
    headline: "+142% Qualified Pipeline Growth",
    subline: "Cross-Channel Attribution Benchmark · 2026",
    metric: "4.2x ROI",
  },
  {
    id: "preset-launch",
    label: "Product Feature Keynote",
    category: "Product Launch",
    aspect: "1:1",
    gradient: "from-emerald-950 via-slate-900 to-teal-950",
    headline: "Autonomous Campaign Orchestration",
    subline: "Zero-latency scheduling across 5 social networks",
    metric: "99.9% Sync",
  },
  {
    id: "preset-playbook",
    label: "Executive Strategy Guide",
    category: "Editorial Carousel",
    aspect: "4:5",
    gradient: "from-indigo-950 via-slate-900 to-slate-950",
    headline: "The 2026 Omnichannel Playbook",
    subline: "How high-velocity marketing teams scale organic reach",
    metric: "50K+ Readers",
  },
];

export interface SocialPostLivePreviewProps {
  content: string;
  selectedPlatforms: SocialNetwork[];
  activePlatform?: SocialNetwork;
  onActivePlatformChange?: (platform: SocialNetwork) => void;
  selectedPresetId?: string | null;
  customMediaUrl?: string | null;
  customMediaLabel?: string | null;
  mediaType?: "text" | "image" | "video" | "carousel";
  scheduledTime?: string;
  authorName?: string;
  authorHandle?: string;
  compact?: boolean;
}

interface ParsedContent {
  urls: string[];
  hashtags: string[];
  mentions: string[];
}

export function renderPlatformIcon(platform: SocialNetwork, className = "h-4 w-4") {
  switch (platform) {
    case "twitter":
      return <Twitter className={`${className} text-sky-500`} />;
    case "linkedin":
      return <Linkedin className={`${className} text-blue-600 dark:text-blue-400`} />;
    case "instagram":
      return <Instagram className={`${className} text-pink-500`} />;
    case "facebook":
      return <Facebook className={`${className} text-blue-500`} />;
    case "youtube":
      return <Youtube className={`${className} text-red-500`} />;
  }
}

function extractEntities(text: string): ParsedContent {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:io|com|ai|org|dev|net)\/[^\s]*)/gi;
  const hashtagRegex = /(#[a-zA-Z0-9_]+)/g;
  const mentionRegex = /(@[a-zA-Z0-9_.-]+)/g;

  return {
    urls: Array.from(new Set(text.match(urlRegex) || [])),
    hashtags: Array.from(new Set(text.match(hashtagRegex) || [])),
    mentions: Array.from(new Set(text.match(mentionRegex) || [])),
  };
}

function RichFormattedText({
  text,
  platform,
  maxChars,
  foldChars,
  foldLabel,
  isExpanded,
  onToggleExpand,
}: {
  text: string;
  platform: SocialNetwork;
  maxChars: number;
  foldChars: number;
  foldLabel: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const spec = PLATFORM_SPECS[platform];
  const displayText = text.trim()
    ? text
    : "Start typing your post caption, add #hashtags, @mentions, or paste a link (e.g. https://visionai.io/report) to preview native formatting across networks…";

  const isPlaceholder = !text.trim();
  const needsFold = !isPlaceholder && displayText.length > foldChars && platform !== "twitter";
  const visiblePortion =
    needsFold && !isExpanded ? displayText.slice(0, foldChars).trimEnd() : displayText;

  // For X/Twitter, highlight characters exceeding 280
  const withinLimitText =
    platform === "twitter" && displayText.length > maxChars
      ? visiblePortion.slice(0, maxChars)
      : visiblePortion;
  const overLimitText =
    platform === "twitter" && displayText.length > maxChars
      ? visiblePortion.slice(maxChars)
      : "";

  const tokenize = (input: string) => {
    const tokenRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:io|com|ai|org|dev|net)\/[^\s]*|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_.-]+)/gi;
    const parts = input.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;
      if (
        part.startsWith("#") ||
        part.startsWith("@") ||
        /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(?:io|com|ai|org|dev|net)\/)/i.test(part)
      ) {
        return (
          <span
            key={idx}
            className={`font-medium ${spec.accentTextClass} hover:underline cursor-pointer`}
          >
            {part}
          </span>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className={`text-xs leading-relaxed whitespace-pre-wrap break-words ${isPlaceholder ? "text-muted-foreground italic" : "text-foreground"}`}>
      {tokenize(withinLimitText)}
      {overLimitText && (
        <span className="bg-red-500/20 text-red-600 dark:text-red-400 underline decoration-red-500">
          {overLimitText}
        </span>
      )}
      {needsFold && !isExpanded && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="ml-1 font-medium text-muted-foreground hover:text-foreground transition-colors inline-block"
        >
          {foldLabel}
        </button>
      )}
      {needsFold && isExpanded && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="ml-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors inline-block"
        >
          Show less
        </button>
      )}
    </div>
  );
}

function MediaOrLinkCanvas({
  preset,
  customMediaUrl,
  customMediaLabel,
  detectedUrl,
  platform,
  mediaType = "image",
}: {
  preset?: MediaPreset | null;
  customMediaUrl?: string | null;
  customMediaLabel?: string | null;
  detectedUrl?: string;
  platform: SocialNetwork;
  mediaType?: "text" | "image" | "video" | "carousel";
}) {
  const aspectClass =
    platform === "instagram"
      ? "aspect-square"
      : platform === "youtube"
      ? "aspect-video"
      : "aspect-[16/9]";

  if (customMediaUrl) {
    return (
      <div
        className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-border bg-slate-950 select-none`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customMediaUrl}
          alt={customMediaLabel || "AI Generated Social Visual"}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>AI Generated Visual</span>
        </div>
        {(platform === "youtube" || mediaType === "video") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="h-11 w-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (preset) {
    return (
      <div
        className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-border bg-gradient-to-br ${preset.gradient} p-5 flex flex-col justify-between text-white select-none`}
      >
        <div className="flex items-center justify-between text-[11px] text-white/80">
          <span className="font-medium tracking-wide">{preset.category}</span>
          <span className="font-mono tabular-nums text-white/90 bg-white/10 px-2 py-0.5 rounded">
            {preset.metric}
          </span>
        </div>

        <div className="space-y-1.5 my-auto py-2">
          <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
            {preset.headline}
          </div>
          <div className="text-xs text-white/75">{preset.subline}</div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-white/70 pt-2 border-t border-white/10">
          <span>visionai.io</span>
          <span className="font-mono tabular-nums">
            {platform === "instagram" ? "1:1 Feed" : "HD 1080p"}
          </span>
        </div>

        {(platform === "youtube" || mediaType === "video") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <div className="h-11 w-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
            <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white font-mono tabular-nums text-[10px] px-1.5 py-0.5 rounded">
              02:45
            </span>
          </div>
        )}
      </div>
    );
  }

  if (detectedUrl) {
    const cleanDomain = detectedUrl
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0];

    return (
      <div className="rounded-lg border border-border overflow-hidden bg-muted/30 hover:bg-muted/50 transition-colors">
        <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 flex flex-col justify-end text-white">
          <div className="text-xs font-semibold truncate">
            VisionAI Intelligence Report & Benchmark
          </div>
          <div className="text-[11px] text-white/70 truncate">
            Interactive omnichannel telemetry and audience conversion analysis
          </div>
        </div>
        <div className="p-2.5 flex items-center justify-between text-xs bg-card">
          <div className="truncate">
            <div className="text-[11px] text-muted-foreground font-mono truncate">
              {cleanDomain}
            </div>
            <div className="font-medium text-foreground truncate text-xs">
              {detectedUrl}
            </div>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
        </div>
      </div>
    );
  }

  if (platform === "instagram" || platform === "youtube") {
    return (
      <div
        className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-4 text-center`}
      >
        {platform === "youtube" ? (
          <>
            <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-2">
              <Play className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium text-foreground">YouTube Video / Short Frame</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Select a visual preset or generate an AI visual above
            </p>
          </>
        ) : (
          <>
            <ImageIcon className="h-7 w-7 text-muted-foreground/60 mb-1.5" />
            <p className="text-xs font-medium text-foreground">Instagram 1:1 Visual Canvas</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Select a creative attachment or generate an AI visual
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
}

export function SocialPostLivePreview({
  content,
  selectedPlatforms,
  activePlatform,
  onActivePlatformChange,
  selectedPresetId,
  customMediaUrl,
  customMediaLabel,
  mediaType = "image",
  scheduledTime,
  authorName = "VisionAI",
  authorHandle = "@VisionAI_HQ",
  compact = false,
}: SocialPostLivePreviewProps) {
  const effectivePlatforms: SocialNetwork[] =
    selectedPlatforms.length > 0 ? selectedPlatforms : ["twitter", "linkedin"];

  const [internalPlatform, setInternalPlatform] = useState<SocialNetwork>(
    activePlatform || effectivePlatforms[0]
  );
  const [viewMode, setViewMode] = useState<"single" | "compare">("single");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const currentPlatform: SocialNetwork =
    activePlatform && effectivePlatforms.includes(activePlatform)
      ? activePlatform
      : effectivePlatforms.includes(internalPlatform)
      ? internalPlatform
      : effectivePlatforms[0];

  const handleSelectPlatform = (net: SocialNetwork) => {
    setInternalPlatform(net);
    if (onActivePlatformChange) {
      onActivePlatformChange(net);
    }
  };

  const toggleExpand = (net: SocialNetwork) => {
    setExpandedMap((prev) => ({ ...prev, [net]: !prev[net] }));
  };

  const entities = useMemo(() => extractEntities(content), [content]);
  const activePreset = useMemo(
    () => MEDIA_PRESETS.find((p) => p.id === selectedPresetId) || null,
    [selectedPresetId]
  );

  const renderSinglePlatformCard = (platform: SocialNetwork) => {
    const spec = PLATFORM_SPECS[platform];
    const charCount = content.length;
    const isOverLimit = charCount > spec.maxChars;
    const isNearLimit = !isOverLimit && charCount >= spec.maxChars * 0.85;
    const isExpanded = !!expandedMap[platform];
    const detectedUrl = entities.urls[0];
    const timestampLabel = scheduledTime ? `Scheduled · ${scheduledTime}` : "Just now";

    return (
      <div
        key={platform}
        className="rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden flex flex-col justify-between"
      >
        {/* Card Top Metadata Bar */}
        <div className="px-3.5 py-2 border-b border-border bg-muted/30 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 font-medium">
            {renderPlatformIcon(platform, "h-3.5 w-3.5")}
            <span>{spec.name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{spec.aspectRatioLabel}</span>
          </div>

          <div className="flex items-center gap-2 font-mono tabular-nums">
            {isOverLimit && (
              <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />+{charCount - spec.maxChars} over
              </span>
            )}
            <span
              className={
                isOverLimit
                  ? "text-red-600 dark:text-red-400 font-bold"
                  : isNearLimit
                  ? "text-amber-600 dark:text-amber-400 font-semibold"
                  : "text-muted-foreground"
              }
            >
              {charCount} / {spec.maxChars}
            </span>
          </div>
        </div>

        {/* Authentic Platform Body */}
        <div className="p-4 space-y-3 flex-1">
          {/* Author Header */}
          {platform === "twitter" && (
            <div className="flex items-start gap-2.5">
              <div className="h-9 w-9 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center text-xs shrink-0">
                VA
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-xs flex-wrap">
                  <span className="font-bold text-foreground truncate">{authorName}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span className="text-muted-foreground truncate">{authorHandle}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground font-mono tabular-nums text-[11px]">
                    {scheduledTime ? "Queued" : "1m"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {platform === "linkedin" && (
            <div className="flex items-start gap-2.5">
              <div className="h-10 w-10 rounded-md bg-blue-600/15 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                VA
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-foreground truncate">
                  {authorName} Technologies Inc.
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  86,420 followers · Official Company Update
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <span>{timestampLabel}</span>
                  <span>·</span>
                  <Globe className="h-3 w-3" />
                </div>
              </div>
            </div>
          )}

          {platform === "facebook" && (
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-blue-500/15 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0">
                VA
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-foreground flex items-center gap-1">
                  <span>{authorName} Official</span>
                  <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span>{timestampLabel}</span>
                  <span>·</span>
                  <Globe className="h-3 w-3" />
                </div>
              </div>
            </div>
          )}

          {platform === "instagram" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-[10px] font-bold">
                    VA
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold leading-none flex items-center gap-1">
                    <span>visionai_growth</span>
                    <CheckCircle2 className="h-3 w-3 text-sky-500" />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Original Audio · {scheduledTime ? "Scheduled" : "Live"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {platform === "youtube" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-500/15 text-red-600 font-bold flex items-center justify-center text-xs">
                  VA
                </div>
                <div>
                  <div className="text-xs font-bold">{authorName} Media</div>
                  <div className="text-[10px] text-muted-foreground font-mono tabular-nums">
                    18.4K subscribers · {timestampLabel}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* For Instagram & YouTube, Media appears BEFORE caption */}
          {(platform === "instagram" || platform === "youtube") && (
            <MediaOrLinkCanvas
              preset={activePreset}
              customMediaUrl={customMediaUrl}
              customMediaLabel={customMediaLabel}
              detectedUrl={detectedUrl}
              platform={platform}
              mediaType={mediaType}
            />
          )}

          {/* Instagram Action Icons row */}
          {platform === "instagram" && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3.5">
                  <Heart className="h-4 w-4 hover:text-pink-500 cursor-pointer transition-colors" />
                  <MessageCircle className="h-4 w-4 cursor-pointer" />
                  <Send className="h-4 w-4 cursor-pointer" />
                </div>
                <Bookmark className="h-4 w-4 cursor-pointer" />
              </div>
              <div className="text-[11px] font-semibold font-mono tabular-nums">
                1,284 likes
              </div>
            </div>
          )}

          {/* Formatted Caption with Platform Truncation & Entity Highlighting */}
          <div className="space-y-1">
            {platform === "instagram" && (
              <span className="text-xs font-bold mr-1.5">visionai_growth</span>
            )}
            <RichFormattedText
              text={content}
              platform={platform}
              maxChars={spec.maxChars}
              foldChars={spec.foldChars}
              foldLabel={spec.foldLabel}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(platform)}
            />
          </div>

          {/* For X, LinkedIn, Facebook, Media/Link Card appears AFTER caption */}
          {platform !== "instagram" && platform !== "youtube" && (
            <MediaOrLinkCanvas
              preset={activePreset}
              customMediaUrl={customMediaUrl}
              customMediaLabel={customMediaLabel}
              detectedUrl={detectedUrl}
              platform={platform}
              mediaType={mediaType}
            />
          )}

          {/* Detected Entities Summary Bar */}
          {(entities.hashtags.length > 0 || entities.mentions.length > 0 || entities.urls.length > 0 || customMediaUrl) && (
            <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground border-t border-border/60">
              <span>Detected:</span>
              {entities.hashtags.length > 0 && (
                <span className="font-mono tabular-nums">
                  {entities.hashtags.length} hashtag{entities.hashtags.length > 1 ? "s" : ""}
                </span>
              )}
              {entities.mentions.length > 0 && (
                <>
                  <span>·</span>
                  <span className="font-mono tabular-nums">
                    {entities.mentions.length} mention{entities.mentions.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
              {customMediaUrl ? (
                <>
                  <span>·</span>
                  <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    AI Visual Attached
                  </span>
                </>
              ) : (
                entities.urls.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      Link Card Active
                    </span>
                  </>
                )
              )}
            </div>
          )}
        </div>

        {/* Platform Native Engagement Footer */}
        {platform === "twitter" && (
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-muted-foreground text-[11px] font-mono tabular-nums">
            <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
              <MessageCircle className="h-3.5 w-3.5" /> 24
            </span>
            <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer">
              <Repeat className="h-3.5 w-3.5" /> 68
            </span>
            <span className="flex items-center gap-1 hover:text-pink-500 cursor-pointer">
              <Heart className="h-3.5 w-3.5" /> 342
            </span>
            <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
              <BarChart2 className="h-3.5 w-3.5" /> 12.4K
            </span>
            <Bookmark className="h-3.5 w-3.5 cursor-pointer" />
          </div>
        )}

        {platform === "linkedin" && (
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <ThumbsUp className="h-3.5 w-3.5" /> Like
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <MessageCircle className="h-3.5 w-3.5" /> Comment
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <Repeat className="h-3.5 w-3.5" /> Repost
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <Send className="h-3.5 w-3.5" /> Send
            </span>
          </div>
        )}

        {platform === "facebook" && (
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-around text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <ThumbsUp className="h-3.5 w-3.5" /> Like
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <MessageCircle className="h-3.5 w-3.5" /> Comment
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
              <Share2 className="h-3.5 w-3.5" /> Share
            </span>
          </div>
        )}

        {platform === "youtube" && (
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-muted-foreground text-xs font-mono tabular-nums">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
                <ThumbsUp className="h-3.5 w-3.5" /> 1.4K
              </span>
              <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
                <MessageCircle className="h-3.5 w-3.5" /> 92
              </span>
            </div>
            <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
              <Share2 className="h-3.5 w-3.5" /> Share
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Preview Control Header: Platform Switcher Tabs + Side-by-Side Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div className="flex items-center gap-1 flex-wrap">
          {(["twitter", "linkedin", "instagram", "facebook", "youtube"] as SocialNetwork[]).map(
            (net) => {
              const spec = PLATFORM_SPECS[net];
              const isSelectedTarget = effectivePlatforms.includes(net);
              const isActive = currentPlatform === net && viewMode === "single";
              const isOver = content.length > spec.maxChars;

              return (
                <button
                  key={net}
                  type="button"
                  onClick={() => {
                    setViewMode("single");
                    handleSelectPlatform(net);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-foreground text-background shadow-xs"
                      : isSelectedTarget
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {renderPlatformIcon(
                    net,
                    `h-3.5 w-3.5 ${isActive ? "text-background" : ""}`
                  )}
                  <span>{spec.shortName}</span>
                  {isOver && (
                    <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Single vs Side-by-Side Comparison Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("single")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === "single"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layout className="h-3.5 w-3.5" />
            <span>Single View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("compare")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === "compare"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Compare ({effectivePlatforms.length})</span>
          </button>
        </div>
      </div>

      {/* Render Active Mode */}
      {viewMode === "single" ? (
        <div className={compact ? "w-full" : "max-w-xl mx-auto w-full"}>
          {renderSinglePlatformCard(currentPlatform)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {effectivePlatforms.map((platform) => renderSinglePlatformCard(platform))}
        </div>
      )}
    </div>
  );
}

export default SocialPostLivePreview;
