"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { savePostToFirestore, deletePostFromFirestore } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Calendar,
  Clock,
  Send,
  Share2,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Repeat,
  Layers,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Check,
  Zap,
  CalendarDays,
  Flame,
  MessageSquare,
  Eye,
  PenSquare,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Wand2,
  Palette,
  Workflow,
  Radar,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  SocialPostLivePreview,
  SocialNetwork,
  PLATFORM_SPECS,
  MEDIA_PRESETS,
  renderPlatformIcon,
} from "@/components/social/social-post-live-preview";

export interface ScheduledPost {
  id: string;
  network: SocialNetwork;
  handle: string;
  scheduledTime: string;
  dateKey: string;
  content: string;
  presetId?: string | null;
  mediaUrl?: string | null;
  status: "scheduled" | "draft" | "in_review";
  characterCount: number;
}

export interface PublishedPost {
  id: string;
  network: SocialNetwork;
  handle: string;
  publishedTime: string;
  content: string;
  presetId?: string | null;
  mediaUrl?: string | null;
  metrics: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
  };
}

export interface SocialMention {
  id: string;
  network: SocialNetwork;
  authorName: string;
  authorHandle: string;
  avatarText: string;
  timeAgo: string;
  content: string;
  sentiment: "positive" | "curious" | "support" | "negative" | "neutral";
  replied: boolean;
  replyText?: string;
}

export interface TrendTopic {
  id: string;
  hashtag: string;
  volume: string;
  category: string;
  samplePrompt: string;
}

export const CALENDAR_DAYS = [
  { day: "Mon", date: "Oct 19", dateKey: "2026-10-19" },
  { day: "Tue", date: "Oct 20", dateKey: "2026-10-20" },
  { day: "Wed", date: "Oct 21", dateKey: "2026-10-21" },
  { day: "Thu", date: "Oct 22", dateKey: "2026-10-22" },
  { day: "Fri", date: "Oct 23", dateKey: "2026-10-23" },
  { day: "Sat", date: "Oct 24", dateKey: "2026-10-24" },
  { day: "Sun", date: "Oct 25", dateKey: "2026-10-25" },
];

const initialScheduledPosts: ScheduledPost[] = [];
const initialPublishedPosts: PublishedPost[] = [];
const initialMentions: SocialMention[] = [];

const trendTopics: TrendTopic[] = [
  {
    id: "tr-1",
    hashtag: "#GenerativeMarketing",
    volume: "128.4K posts",
    category: "AI & Tech",
    samplePrompt:
      "How high-velocity marketing teams are using predictive creative workflows to outpace enterprise budgets in 2026.",
  },
  {
    id: "tr-2",
    hashtag: "#Omnichannel2026",
    volume: "84.2K posts",
    category: "Strategy",
    samplePrompt:
      "3 critical omnichannel formatting mistakes marketing directors make when cross-posting across LinkedIn, X, and Instagram.",
  },
  {
    id: "tr-3",
    hashtag: "#B2BGrowth",
    volume: "241.0K posts",
    category: "Business",
    samplePrompt:
      "The measurable pipeline ROI of consistent executive thought leadership on LinkedIn and X in 2026.",
  },
  {
    id: "tr-4",
    hashtag: "#SocialAttribution",
    volume: "42.8K posts",
    category: "Metrics",
    samplePrompt:
      "Why vanity impression count is obsolete: Focus on high-intent link conversion velocity.",
  },
];

const analyticsData = [
  { day: "Mon", reach: 24000, engagement: 1800, clicks: 620 },
  { day: "Tue", reach: 38000, engagement: 2900, clicks: 940 },
  { day: "Wed", reach: 45000, engagement: 3600, clicks: 1250 },
  { day: "Thu", reach: 52000, engagement: 4100, clicks: 1480 },
  { day: "Fri", reach: 41000, engagement: 3200, clicks: 1100 },
  { day: "Sat", reach: 29000, engagement: 2100, clicks: 780 },
  { day: "Sun", reach: 35000, engagement: 2600, clicks: 910 },
];

type WorkspaceTab = "streams" | "composer" | "calendar" | "analytics" | "accounts";

export default function VisionAIDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  // Workspace Navigation State
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("streams");
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<"all" | SocialNetwork>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduledPosts);
  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>(initialPublishedPosts);
  const [mentions, setMentions] = useState<SocialMention[]>(initialMentions);
  const [connectedAccounts, setConnectedAccounts] = useState<
    Array<{
      network: SocialNetwork;
      name: string;
      handle: string;
      followers: string;
      status: string;
      connected: boolean;
    }>
  >([
    {
      network: "twitter",
      name: "VisionAI Official",
      handle: "@VisionAI_HQ",
      followers: "48.2K",
      status: "Authorized",
      connected: true,
    },
    {
      network: "linkedin",
      name: "VisionAI Technologies Inc.",
      handle: "visionai-corp",
      followers: "86.4K",
      status: "Authorized",
      connected: true,
    },
    {
      network: "instagram",
      name: "VisionAI Creative Lab",
      handle: "@visionai_growth",
      followers: "64.9K",
      status: "Authorized",
      connected: true,
    },
    {
      network: "facebook",
      name: "VisionAI Global",
      handle: "fb.com/visionai",
      followers: "32.1K",
      status: "Authorized",
      connected: true,
    },
    {
      network: "youtube",
      name: "VisionAI Media",
      handle: "youtube.com/@visionai",
      followers: "18.4K",
      status: "Authorized",
      connected: true,
    },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Brand Voice Memory State
  const [brandVoiceInfo, setBrandVoiceInfo] = useState<{
    brandName: string;
    tone: string;
    enabled: boolean;
  }>({
    brandName: "VisionAI Technologies",
    tone: "Authoritative, Data-Driven & Executive",
    enabled: true,
  });

  // Composer & Live Preview State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerNetworks, setComposerNetworks] = useState<SocialNetwork[]>([
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "youtube",
  ]);
  const [composerText, setComposerText] = useState(
    "We just published our 2026 Omnichannel Growth Benchmark! Teams unifying their social publishing workflow see a 4.2x lift in qualified pipeline.\n\nExplore the full interactive report with @VisionAI_HQ at https://visionai.io/benchmark #Omnichannel #B2BGrowth #MarketingStrategy #VisionAI"
  );
  const [composerPresetId, setComposerPresetId] = useState<string | null>("preset-analytics");
  const [composerCustomMediaUrl, setComposerCustomMediaUrl] = useState<string | null>(null);
  const [composerCustomMediaLabel, setComposerCustomMediaLabel] = useState<string | null>(null);
  const [visualPrompt, setVisualPrompt] = useState(
    "Omnichannel Attribution Engine with +142% Pipeline Lift"
  );
  const [visualAspectRatio, setVisualAspectRatio] = useState<"16:9" | "1:1" | "4:5">("16:9");
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [composerScheduleTime, setComposerScheduleTime] = useState("Tue, Oct 20 at 9:00 AM");
  const [composerDateKey, setComposerDateKey] = useState("2026-10-20");
  const [composerTone, setComposerTone] = useState("engaging");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<SocialNetwork>("twitter");

  // Interactive Calendar Drag-and-Drop State
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [dragOverDateKey, setDragOverDateKey] = useState<string | null>(null);

  // Inline Reply State
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState("");
  const { user: firebaseUser } = useFirebase();

  const syncStreamsFromBackend = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const [streamsRes, bvRes] = await Promise.all([
        fetch("/api/streams"),
        fetch("/api/user/brand-voice"),
      ]);

      if (bvRes.ok) {
        const { brandVoice } = await bvRes.json();
        if (brandVoice) {
          setBrandVoiceInfo({
            brandName: brandVoice.brandName || "VisionAI Technologies",
            tone: brandVoice.tone || "Authoritative, Data-Driven & Executive",
            enabled: brandVoice.enabled !== false,
          });
        }
      }

      if (streamsRes.ok) {
        const data = await streamsRes.json();
        if (Array.isArray(data.scheduledPosts) && data.scheduledPosts.length > 0) {
          setScheduledPosts(
            data.scheduledPosts.map((p: any, idx: number) => ({
              id: p.id || `sp-${idx}`,
              network: (p.network || "twitter") as SocialNetwork,
              handle: p.handle || "@VisionAI_HQ",
              scheduledTime: p.scheduledTime || "Mon, Oct 19 at 4:00 PM",
              dateKey: p.dateKey || CALENDAR_DAYS[idx % CALENDAR_DAYS.length].dateKey,
              content: p.content || "",
              presetId: p.presetId !== undefined ? p.presetId : "preset-launch",
              mediaUrl: p.mediaUrl || null,
              status: p.status === "draft" ? "draft" : "scheduled",
              characterCount: (p.content || "").length,
            }))
          );
        }
        if (Array.isArray(data.publishedPosts) && data.publishedPosts.length > 0) {
          setPublishedPosts(
            data.publishedPosts.map((p: any, idx: number) => ({
              id: p.id || `pub-${idx}`,
              network: (p.network || "linkedin") as SocialNetwork,
              handle: p.handle || "VisionAI Technologies",
              publishedTime: p.scheduledTime || "Published recently",
              content: p.content || "",
              presetId: p.presetId || "preset-analytics",
              mediaUrl: p.mediaUrl || null,
              metrics: {
                impressions: 12400 + idx * 3100,
                likes: p.likes ?? 240,
                comments: p.comments ?? 38,
                shares: p.shares ?? 64,
                clicks: 490 + idx * 80,
              },
            }))
          );
        }
        if (Array.isArray(data.mentions) && data.mentions.length > 0) {
          setMentions(
            data.mentions.map((m: any) => ({
              id: m.id,
              network: (m.network || "twitter") as SocialNetwork,
              authorName: m.author || m.authorName || "Community Member",
              authorHandle: m.handle || m.authorHandle || "@member",
              avatarText: m.avatar || m.avatarText || "CM",
              timeAgo: m.time || m.timeAgo || "Just now",
              content: m.content || "",
              sentiment:
                m.sentiment === "Urgent" || m.sentiment === "Negative"
                  ? "negative"
                  : m.sentiment === "Question" || m.sentiment === "Neutral"
                  ? "neutral"
                  : "positive",
              replied: Boolean(m.replied),
              replyText: m.replyText,
            }))
          );
        }
        if (Array.isArray(data.socialAccounts) && data.socialAccounts.length > 0) {
          setConnectedAccounts((prev) =>
            prev.map((item) => {
              const match = data.socialAccounts.find(
                (acc: any) => acc.provider === item.network
              );
              if (!match) return item;
              const isConn = match.status === "connected";
              return {
                ...item,
                name: match.accountName || item.name,
                handle: match.handle || item.handle,
                followers: match.followers || item.followers,
                connected: isConn,
                status: isConn ? "Authorized" : "Not Connected",
              };
            })
          );
        }
      }
      if (showToast) {
        toast({
          title: "Streams Synchronized",
          description: "Latest social feeds, mentions, Brand Voice Memory, and queued posts loaded.",
        });
      }
    } catch (err) {
      console.error("Failed to sync streams:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    syncStreamsFromBackend(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    syncStreamsFromBackend(true);
  };

  const filteredScheduled = useMemo(() => {
    return scheduledPosts.filter((p) => {
      const matchesNet = selectedNetworkFilter === "all" || p.network === selectedNetworkFilter;
      const matchesSearch =
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesNet && matchesSearch;
    });
  }, [scheduledPosts, selectedNetworkFilter, searchQuery]);

  const filteredPublished = useMemo(() => {
    return publishedPosts.filter((p) => {
      const matchesNet = selectedNetworkFilter === "all" || p.network === selectedNetworkFilter;
      const matchesSearch =
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesNet && matchesSearch;
    });
  }, [publishedPosts, selectedNetworkFilter, searchQuery]);

  const filteredMentions = useMemo(() => {
    return mentions.filter((m) => {
      const matchesNet = selectedNetworkFilter === "all" || m.network === selectedNetworkFilter;
      const matchesSearch =
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesNet && matchesSearch;
    });
  }, [mentions, selectedNetworkFilter, searchQuery]);

  const handlePublishNow = async (id: string) => {
    const post = scheduledPosts.find((p) => p.id === id);
    if (!post) return;
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    setPublishedPosts((prev) => [
      {
        id: `pub-${Date.now()}`,
        network: post.network,
        handle: post.handle,
        publishedTime: "Just now",
        content: post.content,
        presetId: post.presetId,
        mediaUrl: post.mediaUrl,
        metrics: { impressions: 120, likes: 12, comments: 2, shares: 4, clicks: 18 },
      },
      ...prev,
    ]);
    try {
      await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "publish_now" }),
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await savePostToFirestore({
          id: `${firebaseUser.uid}_${id}`,
          userId: firebaseUser.uid,
          network: post.network,
          handle: post.handle,
          content: post.content,
          status: "published",
          scheduledTime: "Published Just Now",
        });
      }
    } catch (err) {
      console.error("Failed to persist publish_now:", err);
    }
    toast({
      title: "Broadcast Published",
      description: `Dispatched to ${PLATFORM_SPECS[post.network].name} (${post.handle}).`,
    });
  };

  const handleDeleteScheduled = async (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/posts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deletePostFromFirestore(`${firebaseUser.uid}_${id}`);
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
    toast({
      title: "Post Removed",
      description: "Scheduled post was removed from the dispatch queue.",
    });
  };

  // Interactive Calendar Reschedule Handler (Drag & Drop + Quick Day Shift + Time Picker)
  const handleReschedulePost = async (
    postId: string,
    targetDateKey: string,
    customTimeSlot?: string
  ) => {
    const post = scheduledPosts.find((p) => p.id === postId);
    if (!post) return;

    const targetDayMeta =
      CALENDAR_DAYS.find((d) => d.dateKey === targetDateKey) || CALENDAR_DAYS[0];
    const existingTimePart =
      customTimeSlot ||
      (post.scheduledTime.includes("at ")
        ? post.scheduledTime.split("at ")[1]
        : "10:00 AM");
    const newScheduledTime = `${targetDayMeta.day}, ${targetDayMeta.date} at ${existingTimePart}`;

    setScheduledPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              dateKey: targetDateKey,
              scheduledTime: newScheduledTime,
            }
          : p
      )
    );

    try {
      await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          action: "reschedule",
          dateKey: targetDateKey,
          scheduledTime: newScheduledTime,
        }),
      });

      if (firebaseUser && firebaseUser.emailVerified) {
        await savePostToFirestore({
          id: `${firebaseUser.uid}_${postId}`,
          userId: firebaseUser.uid,
          network: post.network,
          handle: post.handle,
          content: post.content,
          status: "scheduled",
          scheduledTime: newScheduledTime,
        });
      }
    } catch (err) {
      console.error("Failed to persist rescheduled post:", err);
    }

    toast({
      title: "Calendar Slot Rescheduled",
      description: `Moved ${PLATFORM_SPECS[post.network].shortName} post to ${newScheduledTime}.`,
    });
  };

  const toggleTargetNetwork = (netId: SocialNetwork) => {
    setComposerNetworks((prev) => {
      if (prev.includes(netId)) {
        return prev.length > 1 ? prev.filter((n) => n !== netId) : prev;
      }
      return [...prev, netId];
    });
    setPreviewPlatform(netId);
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: composerText || "Omnichannel product launch and audience velocity",
          tone: composerTone,
          platforms: composerNetworks,
          useBrandVoice: brandVoiceInfo.enabled,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate AI copy");
      const data = await res.json();
      if (data.postContent) {
        setComposerText(data.postContent);
      }
      toast({
        title: "Gemini AI Caption Generated",
        description: brandVoiceInfo.enabled
          ? `Tailored with ${brandVoiceInfo.brandName} Brand Voice Memory & fold-safe hook.`
          : "Updated post copy with fold-optimized hooks, hashtags, and link card.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "AI Generation Error",
        description: err?.message || "Could not generate social copy.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateAIVisual = async () => {
    const promptText =
      visualPrompt.trim() ||
      composerText.slice(0, 90).trim() ||
      "Omnichannel Marketing Benchmark";
    setIsGeneratingVisual(true);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          prompt: promptText,
          aspectRatio: visualAspectRatio,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate AI visual");
      const data = await res.json();
      if (data.imageUrl) {
        setComposerCustomMediaUrl(data.imageUrl);
        setComposerCustomMediaLabel(data.visual?.headline || promptText);
        setComposerPresetId(null);
        toast({
          title: "AI Marketing Visual Generated",
          description: `Created ${visualAspectRatio} graphic ("${data.visual?.headline || promptText}") and attached to live preview.`,
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Visual Generation Error",
        description: err?.message || "Could not generate marketing visual.",
      });
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleSavePost = async (publishNow = false) => {
    if (!composerText.trim()) {
      toast({
        variant: "destructive",
        title: "Caption Required",
        description: "Please enter text for your post before publishing or scheduling.",
      });
      return;
    }

    if (composerNetworks.length === 0) {
      toast({
        variant: "destructive",
        title: "Channel Required",
        description: "Please select at least one social network to broadcast to.",
      });
      return;
    }

    if (publishNow) {
      const newPublished: PublishedPost[] = composerNetworks.map((net, idx) => ({
        id: `pub-${Date.now()}-${idx}`,
        network: net,
        handle:
          net === "twitter"
            ? "@VisionAI_HQ"
            : net === "linkedin"
            ? "VisionAI Technologies"
            : net === "youtube"
            ? "VisionAI Media"
            : `@visionai_${net}`,
        publishedTime: "Just now",
        content: composerText,
        presetId: composerPresetId,
        mediaUrl: composerCustomMediaUrl,
        metrics: { impressions: 120, likes: 1, comments: 0, shares: 0, clicks: 4 },
      }));
      setPublishedPosts((prev) => [...newPublished, ...prev]);

      try {
        for (const net of composerNetworks) {
          const postRes = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: composerText,
              network: net,
              platforms: composerNetworks,
              status: "published",
              scheduledTime: "Published Just Now",
              presetId: composerPresetId,
              mediaUrl: composerCustomMediaUrl,
            }),
          });
          if (firebaseUser && firebaseUser.emailVerified && postRes.ok) {
            const { post } = await postRes.json();
            if (post) {
              await savePostToFirestore({
                id: `${firebaseUser.uid}_${post.id}`,
                userId: firebaseUser.uid,
                network: net,
                handle: post.handle || "@VisionAI_HQ",
                content: composerText,
                status: "published",
                scheduledTime: "Published Just Now",
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to save published post:", err);
      }

      toast({
        title: "Published Across Channels",
        description: `Live on ${composerNetworks.map((n) => PLATFORM_SPECS[n].shortName).join(", ")}.`,
      });
      setIsComposerOpen(false);
      setActiveTab("streams");
    } else {
      const matchedDay = CALENDAR_DAYS.find((d) =>
        composerScheduleTime.toLowerCase().includes(d.day.toLowerCase()) ||
        composerScheduleTime.toLowerCase().includes(d.date.toLowerCase())
      );
      const effectiveDateKey = matchedDay?.dateKey || composerDateKey || "2026-10-20";

      const newScheduled: ScheduledPost[] = composerNetworks.map((net, idx) => ({
        id: `sp-${Date.now()}-${idx}`,
        network: net,
        handle:
          net === "twitter"
            ? "@VisionAI_HQ"
            : net === "linkedin"
            ? "VisionAI Technologies"
            : net === "youtube"
            ? "VisionAI Media"
            : `@visionai_${net}`,
        scheduledTime: composerScheduleTime || "Tue, Oct 20 at 10:00 AM",
        dateKey: effectiveDateKey,
        content: composerText,
        presetId: composerPresetId,
        mediaUrl: composerCustomMediaUrl,
        status: "scheduled",
        characterCount: composerText.length,
      }));
      setScheduledPosts((prev) => [...newScheduled, ...prev]);

      try {
        for (const net of composerNetworks) {
          const postRes = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: composerText,
              network: net,
              platforms: composerNetworks,
              status: "scheduled",
              scheduledTime: composerScheduleTime || "Tue, Oct 20 at 10:00 AM",
              dateKey: effectiveDateKey,
              presetId: composerPresetId,
              mediaUrl: composerCustomMediaUrl,
            }),
          });
          if (firebaseUser && firebaseUser.emailVerified && postRes.ok) {
            const { post } = await postRes.json();
            if (post) {
              await savePostToFirestore({
                id: `${firebaseUser.uid}_${post.id}`,
                userId: firebaseUser.uid,
                network: net,
                handle: post.handle || "@VisionAI_HQ",
                content: composerText,
                status: "scheduled",
                scheduledTime: composerScheduleTime || "Tue, Oct 20 at 10:00 AM",
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to save scheduled post:", err);
      }

      toast({
        title: "Scheduled in Queue & Calendar",
        description: `Queued across ${composerNetworks.length} networks for ${
          composerScheduleTime || "Tue, Oct 20 at 10:00 AM"
        }.`,
      });
      setIsComposerOpen(false);
      setActiveTab("calendar");
    }
  };

  const handleSendReply = async (mentionId: string) => {
    if (!replyInputText.trim()) return;
    const replyCopy = replyInputText;
    setMentions((prev) =>
      prev.map((m) =>
        m.id === mentionId ? { ...m, replied: true, replyText: replyCopy } : m
      )
    );
    setActiveReplyId(null);
    setReplyInputText("");
    try {
      await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: mentionId,
          action: "reply_mention",
          replyText: replyCopy,
        }),
      });
    } catch (err) {
      console.error("Failed to persist mention reply:", err);
    }
    toast({
      title: "Reply Dispatched",
      description: "Your response has been published and saved to the conversation.",
    });
  };

  const currentSpec = PLATFORM_SPECS[previewPlatform];

  // Reusable 2-Column Composer + Live Multi-Platform Preview Workspace
  const renderComposerAndPreviewStudio = (inModal = false) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Post Editor, Target Channels, AI Visual Generator, Media Presets & Schedule Controls */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          {/* Active Brand Voice Memory Banner */}
          <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-foreground">Brand Voice Memory:</span>{" "}
                <span className="text-muted-foreground">{brandVoiceInfo.brandName} ({brandVoiceInfo.tone})</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="text-[11px] font-medium text-emerald-500 hover:underline shrink-0 cursor-pointer"
            >
              Configure
            </button>
          </div>

          {/* 1. Target Network Toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">1. Select Target Platforms</Label>
              <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                {composerNetworks.length} of 5 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["twitter", "linkedin", "instagram", "facebook", "youtube"] as SocialNetwork[]).map(
                (netId) => {
                  const spec = PLATFORM_SPECS[netId];
                  const isSelected = composerNetworks.includes(netId);
                  return (
                    <button
                      key={netId}
                      type="button"
                      onClick={() => toggleTargetNetwork(netId)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground"
                          : "bg-muted/40 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {renderPlatformIcon(
                        netId,
                        `h-3.5 w-3.5 ${isSelected ? "text-background" : ""}`
                      )}
                      <span>{spec.name}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* 2. Post Caption & AI Tone Adapter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label htmlFor={inModal ? "modal-caption" : "studio-caption"} className="text-xs font-semibold">
                2. Draft Caption, Hashtags &amp; Links
              </Label>
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Select post tone"
                  className="text-xs h-7 border border-border rounded-md px-2 bg-background text-foreground"
                  value={composerTone}
                  onChange={(e) => setComposerTone(e.target.value)}
                >
                  <option value="engaging">Tone: Engaging</option>
                  <option value="viral">Tone: High-Velocity Hook</option>
                  <option value="thought_leader">Tone: Executive Insight</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 cursor-pointer"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                >
                  <Sparkles className={`h-3 w-3 ${isGeneratingAI ? "animate-spin" : ""}`} />
                  {isGeneratingAI ? "Adapting…" : "Smart Rewrite"}
                </Button>
              </div>
            </div>

            <Textarea
              id={inModal ? "modal-caption" : "studio-caption"}
              rows={5}
              placeholder="Write your post caption, include #hashtags, @mentions, or paste a URL (https://...) to render a live link card..."
              className="text-xs leading-relaxed font-sans resize-y"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
            />

            {/* Quick Insert Helpers */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-muted-foreground">Insert:</span>
                <button
                  type="button"
                  onClick={() =>
                    setComposerText((prev) => `${prev.trim()} #ProductLaunch #Marketing2026`)
                  }
                  className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-mono text-[11px] cursor-pointer"
                >
                  + #Hashtags
                </button>
                <button
                  type="button"
                  onClick={() => setComposerText((prev) => `${prev.trim()} @VisionAI_Team`)}
                  className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-mono text-[11px] cursor-pointer"
                >
                  + @Mention
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComposerPresetId(null);
                    setComposerCustomMediaUrl(null);
                    if (!composerText.includes("https://")) {
                      setComposerText(
                        (prev) => `${prev.trim()} https://visionai.io/q4-benchmark`
                      );
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-mono text-[11px] cursor-pointer"
                >
                  + Link Card URL
                </button>
              </div>

              <div className="font-mono tabular-nums text-muted-foreground">
                <span>{currentSpec.shortName}: </span>
                <span
                  className={
                    composerText.length > currentSpec.maxChars
                      ? "text-red-600 dark:text-red-400 font-bold"
                      : "text-foreground font-semibold"
                  }
                >
                  {composerText.length} / {currentSpec.maxChars}
                </span>
              </div>
            </div>
          </div>

          {/* 3. AI Creative Visual Studio + Preset Selector */}
          <div className="space-y-2.5 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-emerald-500" />
                3. AI Visual Generator &amp; Creative Assets
              </Label>
              {(composerPresetId || composerCustomMediaUrl) && (
                <button
                  type="button"
                  onClick={() => {
                    setComposerPresetId(null);
                    setComposerCustomMediaUrl(null);
                    setComposerCustomMediaLabel(null);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Clear Visual (Use URL Card)
                </button>
              )}
            </div>

            {/* AI Image Prompt Box */}
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2">
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="Describe marketing visual to generate with Gemini..."
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  className="h-8 text-xs flex-1 bg-background"
                />
                <select
                  aria-label="Visual Aspect Ratio"
                  value={visualAspectRatio}
                  onChange={(e) =>
                    setVisualAspectRatio(e.target.value as "16:9" | "1:1" | "4:5")
                  }
                  className="h-8 text-xs border border-border rounded-md px-2 bg-background text-foreground font-mono"
                >
                  <option value="16:9">16:9</option>
                  <option value="1:1">1:1</option>
                  <option value="4:5">4:5</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setVisualPrompt(
                      composerText.split("\n")[0]?.slice(0, 70) ||
                        "2026 Omnichannel Attribution Benchmark"
                    )
                  }
                  className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Sync prompt from caption hook
                </button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={isGeneratingVisual}
                  onClick={handleGenerateAIVisual}
                  className="h-7 text-xs gap-1.5 cursor-pointer"
                >
                  <ImageIcon className={`h-3.5 w-3.5 ${isGeneratingVisual ? "animate-pulse" : ""}`} />
                  {isGeneratingVisual ? "Generating Visual..." : "Generate AI Visual"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MEDIA_PRESETS.map((preset) => {
                const isSelected = composerPresetId === preset.id && !composerCustomMediaUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setComposerCustomMediaUrl(null);
                      setComposerCustomMediaLabel(null);
                      setComposerPresetId(isSelected ? null : preset.id);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-foreground bg-muted/60 shadow-xs"
                        : "border-border bg-background hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-1">
                      <span>{preset.aspect}</span>
                      <span>{preset.metric}</span>
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {preset.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Schedule Slot & Dispatch Actions */}
          <div className="space-y-3 border-t border-border pt-3">
            <div className="space-y-1.5">
              <Label htmlFor={inModal ? "modal-schedule" : "studio-schedule"} className="text-xs font-semibold">
                4. Schedule Time Slot &amp; Calendar Day
              </Label>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Calendar Day"
                  value={composerDateKey}
                  onChange={(e) => {
                    const dk = e.target.value;
                    setComposerDateKey(dk);
                    const dayObj = CALENDAR_DAYS.find((d) => d.dateKey === dk);
                    if (dayObj) {
                      setComposerScheduleTime(`${dayObj.day}, ${dayObj.date} at 9:00 AM`);
                    }
                  }}
                  className="h-9 text-xs border border-border rounded-md px-2 bg-background text-foreground font-mono"
                >
                  {CALENDAR_DAYS.map((d) => (
                    <option key={d.dateKey} value={d.dateKey}>
                      {d.day}, {d.date}
                    </option>
                  ))}
                </select>
                <Input
                  id={inModal ? "modal-schedule" : "studio-schedule"}
                  placeholder="e.g. Tue, Oct 20 at 9:00 AM"
                  className="text-xs h-9 font-mono flex-1"
                  value={composerScheduleTime}
                  onChange={(e) => setComposerScheduleTime(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs shrink-0 cursor-pointer"
                  onClick={() => {
                    setComposerDateKey("2026-10-22");
                    setComposerScheduleTime("Thu, Oct 22 at 8:45 AM (Peak)");
                  }}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" /> Peak
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs cursor-pointer"
                onClick={() => handleSavePost(false)}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Schedule Post
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                onClick={() => handleSavePost(true)}
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Publish Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Multi-Platform Live Social Post Preview */}
      <div className="lg:col-span-7 rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-emerald-600" />
              Live Multi-Platform Post Preview
            </h3>
            <p className="text-xs text-muted-foreground">
              Inspect native typography, character limits, fold cutoffs (&ldquo;…see more&rdquo;), AI visuals, and link cards before scheduling.
            </p>
          </div>
        </div>

        <SocialPostLivePreview
          content={composerText}
          selectedPlatforms={composerNetworks}
          activePlatform={previewPlatform}
          onActivePlatformChange={setPreviewPlatform}
          selectedPresetId={composerPresetId}
          customMediaUrl={composerCustomMediaUrl}
          customMediaLabel={composerCustomMediaLabel}
          scheduledTime={composerScheduleTime}
          authorName="VisionAI"
          authorHandle="@VisionAI_HQ"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Executive Command Center Header & 4-Minute Autonomous Pipeline Launchpad */}
      <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Command Center
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Execute the 4-minute autonomous workflow: synthesize fold-safe social ads, ambush rival campaigns, and dispatch across 5 networks with live revenue attribution.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/creative-canvas")}
              className="h-9 px-3.5 text-xs font-semibold whitespace-nowrap cursor-pointer gap-1.5"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Fold-Aware Canvas
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/competitor-intel")}
              className="h-9 px-3.5 text-xs font-semibold whitespace-nowrap cursor-pointer gap-1.5"
            >
              <Radar className="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
              Competitor Radar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setActiveTab("composer")}
              className="h-9 px-4 text-xs font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white whitespace-nowrap cursor-pointer border-0"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Compose &amp; Dispatch
            </Button>
          </div>
        </div>

        {/* 4-Minute Autonomous Pipeline Quick-Launch Strip (Matches Landing Page Promise) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={() => router.push("/settings?tab=brand-voice")}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              <span>Minute 01 · Brand DNA</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {brandVoiceInfo.brandName} Guardrails
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Anti-cliché tone &amp; banned buzzwords locked
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/creative-canvas")}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              <span>Minute 02 · 3 Hook Angles</span>
              <span className="text-emerald-600 dark:text-emerald-400">96/100 Score</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Contrarian · Receipt · Wedge
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Synthesize thumb-stopping hooks in 1 click
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/creative-canvas")}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              <span>Minute 03 · Safe-Zone Studio</span>
              <span className="text-emerald-600 dark:text-emerald-400">0% Cutoffs</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              9:16 · 1:1 · 16:9 Multi-Ratio
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              TikTok, Reels &amp; Shorts UI obstruction masks
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/competitor-intel")}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-fuchsia-600 dark:text-fuchsia-400 font-bold">
              <span>Minute 04 · Ambush &amp; Dispatch</span>
              <span className="text-emerald-600 dark:text-emerald-400">+44% Win Rate</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              3 Live Rival Signals Detected
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Deploy counter-battlecards across 5 networks
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-200/80 dark:border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Scheduled Queue
              </p>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
                {scheduledPosts.length}
              </p>
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold tabular-nums">
              Queued
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Published Posts
              </p>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
                {publishedPosts.length}
              </p>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold tabular-nums">
              Live
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Inbox Threads
              </p>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
                {mentions.length}
              </p>
            </div>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono font-semibold tabular-nums">
              Active
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Connected Channels
              </p>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
                {connectedAccounts.filter((a) => a.connected).length} / {connectedAccounts.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("accounts")}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Performance Card with 7-Day Recharts Mini-Trend Line Chart */}
      <Card className="border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
        <CardHeader className="p-4 pb-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Campaign Performance
            </CardTitle>
            <CardDescription className="text-xs">
              Last 7 days omnichannel engagement &amp; link click velocity (Mon – Sun)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <div>
              <span className="text-muted-foreground">7d Clicks: </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">7,080</span>
            </div>
            <div>
              <span className="text-muted-foreground">7d Engagement: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">20,300</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/campaigns")}
              className="font-sans font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[110px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData}
                margin={{ top: 6, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: "11px" }}
                />
                <YAxis hide />
                <RechartsTooltip
                  contentStyle={{
                    fontSize: "11px",
                    borderRadius: "8px",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  name="Engagement"
                  stroke="#10b981"
                  strokeWidth={2.25}
                  dot={{ r: 3 }}
                  activeDot={{ r: 4.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="Link Clicks"
                  stroke="#4f46e5"
                  strokeWidth={2.25}
                  dot={{ r: 3 }}
                  activeDot={{ r: 4.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Deterministic Direct-Click Navigation Bar & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Workspace Views"
          className="inline-flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl self-start flex-wrap shadow-2xs"
        >
          {(
            [
              { id: "streams", label: "Streams & Live Inbox", icon: Layers, iconColor: "text-indigo-600 dark:text-indigo-400" },
              { id: "composer", label: "Live Preview & Composer", icon: Eye, iconColor: "text-emerald-600 dark:text-emerald-400" },
              { id: "calendar", label: "Interactive Planner", icon: CalendarDays, iconColor: "text-sky-600 dark:text-sky-400" },
              { id: "analytics", label: "Analytics", icon: Zap, iconColor: "text-amber-600 dark:text-amber-400" },
              { id: "accounts", label: "Channels (5)", icon: Share2, iconColor: "text-violet-600 dark:text-violet-400" },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : tab.iconColor}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {(activeTab === "streams" || activeTab === "calendar") && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/90 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedNetworkFilter("all")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedNetworkFilter === "all"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                All
              </button>
              {(["twitter", "linkedin", "instagram", "facebook", "youtube"] as SocialNetwork[]).map(
                (net) => {
                  const active = selectedNetworkFilter === net;
                  return (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setSelectedNetworkFilter(net)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                      title={PLATFORM_SPECS[net].name}
                    >
                      {renderPlatformIcon(
                        net,
                        `h-3.5 w-3.5 ${active ? "text-indigo-600 dark:text-indigo-400" : ""}`
                      )}
                      <span className="hidden sm:inline">{PLATFORM_SPECS[net].shortName}</span>
                    </button>
                  );
                }
              )}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Filter posts or @handles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= VIEW 1: STREAMS WORKSPACE ================= */}
      {activeTab === "streams" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {/* COLUMN 1: SCHEDULED QUEUE */}
            <Card className="flex flex-col min-h-[460px] max-h-[640px] border-slate-200/90 dark:border-slate-800 overflow-hidden">
              <CardHeader className="p-4 pb-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scheduled Queue</CardTitle>
                  </div>
                  <span className="text-xs font-mono font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                    {filteredScheduled.length} queued
                  </span>
                </div>
                <CardDescription className="text-xs">
                  Upcoming cross-network dispatches
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 space-y-3 overflow-y-auto flex-1">
                {filteredScheduled.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-5 text-muted-foreground">
                    <Clock className="h-6 w-6 mb-2.5 text-slate-400 dark:text-slate-500" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      No scheduled dispatches queued
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                      Draft once and schedule across X, LinkedIn, Instagram, Facebook, and YouTube.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("composer")}
                      className="text-xs mt-3 h-8 cursor-pointer"
                    >
                      Schedule First Post
                    </Button>
                  </div>
                ) : (
                  filteredScheduled.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg border border-border bg-card text-card-foreground hover:border-foreground/30 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {renderPlatformIcon(post.network)}
                          <span className="font-semibold text-xs truncate">{post.handle}</span>
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-muted-foreground shrink-0">
                          {post.scheduledTime}
                        </span>
                      </div>

                      {post.mediaUrl && (
                        <div className="relative h-24 w-full rounded overflow-hidden border border-border bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.mediaUrl}
                            alt="Attached AI Visual"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="line-clamp-3 text-muted-foreground leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setComposerText(post.content);
                            setComposerNetworks([post.network]);
                            setPreviewPlatform(post.network);
                            setComposerPresetId(post.presetId || null);
                            setComposerCustomMediaUrl(post.mediaUrl || null);
                            setComposerScheduleTime(post.scheduledTime);
                            setComposerDateKey(post.dateKey || "2026-10-20");
                            setActiveTab("composer");
                          }}
                          className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3 w-3" /> Preview Card
                        </button>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => handleDeleteScheduled(post.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="h-7 px-2.5 text-[11px] gap-1 cursor-pointer"
                            onClick={() => handlePublishNow(post.id)}
                          >
                            <Send className="h-3 w-3" />
                            Post Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* COLUMN 2: PUBLISHED POSTS & LIVE METRICS */}
            <Card className="flex flex-col min-h-[460px] max-h-[640px] border-slate-200/90 dark:border-slate-800 overflow-hidden">
              <CardHeader className="p-4 pb-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Published Feed</CardTitle>
                  </div>
                  <span className="text-xs font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {filteredPublished.length} live
                  </span>
                </div>
                <CardDescription className="text-xs">
                  Dispatched posts &amp; real-time telemetry
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 space-y-3 overflow-y-auto flex-1">
                {filteredPublished.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-5 text-muted-foreground">
                    <CheckCircle2 className="h-6 w-6 mb-2.5 text-slate-400 dark:text-slate-500" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      No published posts yet
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                      Published posts and engagement metrics will appear here once dispatched.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("composer")}
                      className="text-xs mt-3 h-8 cursor-pointer"
                    >
                      Compose &amp; Publish
                    </Button>
                  </div>
                ) : (
                  filteredPublished.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg border border-border bg-card text-card-foreground hover:border-foreground/30 transition-colors space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {renderPlatformIcon(post.network)}
                          <span className="font-semibold text-xs truncate max-w-[120px]">
                            {post.handle}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                          {post.publishedTime}
                        </span>
                      </div>

                      {post.mediaUrl && (
                        <div className="relative h-24 w-full rounded overflow-hidden border border-border bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.mediaUrl}
                            alt="Published AI Visual"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="line-clamp-3 text-muted-foreground leading-relaxed">
                        {post.content}
                      </p>

                      <div className="grid grid-cols-4 gap-1 p-2 rounded bg-muted/40 text-center text-[10px] border border-border font-mono tabular-nums">
                        <div>
                          <div className="font-bold text-foreground">
                            {post.metrics.impressions.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground text-[9px] font-sans">Views</div>
                        </div>
                        <div>
                          <div className="font-bold text-emerald-600">{post.metrics.likes}</div>
                          <div className="text-muted-foreground text-[9px] font-sans">Likes</div>
                        </div>
                        <div>
                          <div className="font-bold text-sky-600">{post.metrics.comments}</div>
                          <div className="text-muted-foreground text-[9px] font-sans">Replies</div>
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{post.metrics.clicks}</div>
                          <div className="text-muted-foreground text-[9px] font-sans">Clicks</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-primary gap-1 px-1.5 cursor-pointer"
                          onClick={() => {
                            toast({
                              title: "Loaded into Campaign Builder",
                              description: "Post metrics attached for paid amplification.",
                            });
                            router.push("/campaign-builder");
                          }}
                        >
                          <Flame className="h-3 w-3 text-amber-500" />
                          Boost Post
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-muted-foreground gap-1 px-1.5 cursor-pointer"
                          onClick={() => {
                            setComposerText(post.content);
                            setPreviewPlatform(post.network);
                            setComposerCustomMediaUrl(post.mediaUrl || null);
                            setActiveTab("composer");
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Inspect Preview
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* COLUMN 3: MENTIONS & SOCIAL INBOX */}
            <Card className="flex flex-col min-h-[460px] max-h-[640px] border-slate-200/90 dark:border-slate-800 overflow-hidden">
              <CardHeader className="p-4 pb-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mentions &amp; Inbox</CardTitle>
                  </div>
                  <span className="text-xs font-mono font-semibold tabular-nums text-sky-600 dark:text-sky-400">
                    {filteredMentions.length} threads
                  </span>
                </div>
                <CardDescription className="text-xs">
                  Community conversations &amp; direct replies
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 space-y-3 overflow-y-auto flex-1">
                {filteredMentions.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-5 text-muted-foreground">
                    <MessageSquare className="h-6 w-6 mb-2.5 text-slate-400 dark:text-slate-500" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Inbox is clear
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                      Incoming @mentions, comments, and direct thread replies will stream here.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("accounts")}
                      className="text-xs mt-3 h-8 cursor-pointer"
                    >
                      Verify Channel Webhooks
                    </Button>
                  </div>
                ) : (
                  filteredMentions.map((mention) => (
                    <div
                      key={mention.id}
                      className="p-3 rounded-lg border border-border bg-card text-card-foreground space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted text-foreground font-bold flex items-center justify-center text-[10px]">
                            {mention.avatarText}
                          </div>
                          <div>
                            <div className="font-semibold text-xs leading-none">
                              {mention.authorName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {mention.authorHandle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {renderPlatformIcon(mention.network)}
                          <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
                            {mention.timeAgo}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed text-xs">
                        {mention.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-muted-foreground capitalize">
                          {mention.sentiment} sentiment
                        </span>

                        {mention.replied ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <Check className="h-3 w-3" /> Replied
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 text-[11px] px-2 cursor-pointer"
                            onClick={() => {
                              setActiveReplyId(activeReplyId === mention.id ? null : mention.id);
                              setReplyInputText("");
                            }}
                          >
                            <Repeat className="h-3 w-3 mr-1" /> Reply
                          </Button>
                        )}
                      </div>

                      {activeReplyId === mention.id && (
                        <div className="pt-2 border-t border-border space-y-2 bg-muted/30 p-2 rounded">
                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              className="text-[10px] px-2 py-0.5 rounded bg-background border border-border hover:border-foreground text-foreground cursor-pointer"
                              onClick={() =>
                                setReplyInputText(
                                  "Thanks so much for the feedback! Glad the multi-platform preview is streamlining your workflow."
                                )
                              }
                            >
                              Say Thanks
                            </button>
                            <button
                              type="button"
                              className="text-[10px] px-2 py-0.5 rounded bg-background border border-border hover:border-foreground text-foreground cursor-pointer"
                              onClick={() =>
                                setReplyInputText(
                                  "Yes! You can preview X, LinkedIn, Instagram, Facebook, and YouTube side-by-side in the Composer."
                                )
                              }
                            >
                              Confirm Feature
                            </button>
                          </div>
                          <Textarea
                            className="h-16 text-xs bg-background"
                            placeholder="Type your response..."
                            value={replyInputText}
                            onChange={(e) => setReplyInputText(e.target.value)}
                          />
                          <div className="flex justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[10px]"
                              onClick={() => setActiveReplyId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="h-6 text-[10px] px-2.5"
                              onClick={() => handleSendReply(mention.id)}
                            >
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      )}

                      {mention.replied && mention.replyText && (
                        <div className="p-2 rounded bg-muted/50 border border-border text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">You replied:</span>{" "}
                          {mention.replyText}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* COLUMN 4: TREND RADAR & HOOK TEMPLATES */}
            <Card className="flex flex-col min-h-[460px] max-h-[640px] border-slate-200/90 dark:border-slate-800 overflow-hidden">
              <CardHeader className="p-4 pb-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Content Radar</CardTitle>
                  </div>
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Live Hooks</span>
                </div>
                <CardDescription className="text-xs">
                  High-performing themes &amp; instant drafts
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 space-y-3 overflow-y-auto flex-1">
                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Zap className="h-3.5 w-3.5 text-emerald-600" />
                    Optimal Cadence Window
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Peak B2B audience activity on LinkedIn &amp; X begins in{" "}
                    <span className="font-mono font-semibold text-foreground">42m</span>.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    onClick={() => {
                      setComposerText(
                        "The fastest growing marketing teams aren't creating more noise—they're adapting high-intent insights natively across X, LinkedIn, Instagram, Facebook & YouTube. Full breakdown at https://visionai.io/framework #Omnichannel #B2BGrowth"
                      );
                      setActiveTab("composer");
                    }}
                  >
                    Preview &amp; Schedule for Peak Window
                  </Button>
                </div>

                <div className="text-xs font-semibold text-muted-foreground pt-1">
                  Trending Topics in Your Sector
                </div>

                {trendTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3 rounded-lg border border-border bg-card text-card-foreground space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{topic.hashtag}</span>
                      <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
                        {topic.volume}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      &ldquo;{topic.samplePrompt}&rdquo;
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-[11px] gap-1 cursor-pointer"
                      onClick={() => {
                        setComposerText(
                          `${topic.samplePrompt}\n\nKey takeaways for Q4:\n• Native aspect ratios per channel\n• Strong hooks above the fold\n\nExplore https://visionai.io/insights ${topic.hashtag} #VisionAI`
                        );
                        setActiveTab("composer");
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      Load into Live Preview
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: LIVE PREVIEW & COMPOSER STUDIO ================= */}
      {activeTab === "composer" && renderComposerAndPreviewStudio(false)}

      {/* ================= VIEW 3: INTERACTIVE PLANNER & CALENDAR ================= */}
      {activeTab === "calendar" && (
        <Card className="border-border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <CardTitle className="text-lg">
                Interactive Content Calendar &amp; Drag-and-Drop Schedule Planner
              </CardTitle>
              <CardDescription>
                Drag and drop scheduled cards across days, use quick-shift arrows, or click any card to inspect its live multi-platform preview.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground px-2.5 py-1 rounded border border-border bg-muted/30">
                Oct 19 – Oct 25, 2026 ({filteredScheduled.length} Scheduled)
              </span>
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer"
                onClick={() => setActiveTab("composer")}
              >
                <Plus className="h-3.5 w-3.5" /> Compose with Live Preview
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {CALENDAR_DAYS.map((col, colIdx) => {
                const dayItems = filteredScheduled.filter(
                  (p) => (p.dateKey || CALENDAR_DAYS[0].dateKey) === col.dateKey
                );
                const isDropTarget = dragOverDateKey === col.dateKey;

                return (
                  <div
                    key={col.dateKey}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverDateKey !== col.dateKey) {
                        setDragOverDateKey(col.dateKey);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverDateKey === col.dateKey) {
                        setDragOverDateKey(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverDateKey(null);
                      const postId =
                        e.dataTransfer.getData("text/plain") || draggedPostId;
                      if (postId) {
                        handleReschedulePost(postId, col.dateKey);
                      }
                      setDraggedPostId(null);
                    }}
                    className={`border rounded-lg p-2.5 min-h-[380px] flex flex-col transition-colors ${
                      isDropTarget
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-border bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                      <span className="font-bold text-xs">{col.day}</span>
                      <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                        {col.date} ({dayItems.length})
                      </span>
                    </div>

                    <div className="flex-1 space-y-2.5">
                      {dayItems.map((item) => {
                        const prevDay =
                          colIdx > 0 ? CALENDAR_DAYS[colIdx - 1] : null;
                        const nextDay =
                          colIdx < CALENDAR_DAYS.length - 1
                            ? CALENDAR_DAYS[colIdx + 1]
                            : null;

                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => {
                              setDraggedPostId(item.id);
                              e.dataTransfer.setData("text/plain", item.id);
                            }}
                            onDragEnd={() => {
                              setDraggedPostId(null);
                              setDragOverDateKey(null);
                            }}
                            className="p-2.5 rounded-md border border-border bg-card text-xs space-y-2 hover:border-foreground/50 transition-all shadow-2xs cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center justify-between text-[10px] gap-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
                                {renderPlatformIcon(item.network, "h-3.5 w-3.5")}
                              </div>
                              <select
                                aria-label="Change time slot"
                                value={
                                  item.scheduledTime.includes("9:00 AM")
                                    ? "9:00 AM"
                                    : item.scheduledTime.includes("11:30 AM")
                                    ? "11:30 AM"
                                    : item.scheduledTime.includes("1:15 PM")
                                    ? "1:15 PM"
                                    : item.scheduledTime.includes("2:30 PM")
                                    ? "2:30 PM"
                                    : item.scheduledTime.includes("4:00 PM")
                                    ? "4:00 PM"
                                    : "9:00 AM"
                                }
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleReschedulePost(
                                    item.id,
                                    col.dateKey,
                                    e.target.value
                                  )
                                }
                                className="bg-muted/50 border border-border rounded px-1 py-0.5 text-[10px] font-mono text-foreground cursor-pointer"
                              >
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="11:30 AM">11:30 AM</option>
                                <option value="1:15 PM">1:15 PM</option>
                                <option value="2:30 PM">2:30 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                              </select>
                            </div>

                            {item.mediaUrl && (
                              <div className="relative h-16 w-full rounded overflow-hidden border border-border bg-slate-950">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.mediaUrl}
                                  alt="Scheduled visual"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <p
                              onClick={() => {
                                setComposerText(item.content);
                                setPreviewPlatform(item.network);
                                setComposerCustomMediaUrl(item.mediaUrl || null);
                                setComposerScheduleTime(item.scheduledTime);
                                setComposerDateKey(col.dateKey);
                                setActiveTab("composer");
                              }}
                              className="line-clamp-3 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              {item.content}
                            </p>

                            {/* Quick Reschedule Day Controls & Post Now */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-border/60">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={!prevDay}
                                  onClick={() =>
                                    prevDay &&
                                    handleReschedulePost(item.id, prevDay.dateKey)
                                  }
                                  title={
                                    prevDay
                                      ? `Move to ${prevDay.day}`
                                      : "Earliest day"
                                  }
                                  className="p-1 rounded border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={!nextDay}
                                  onClick={() =>
                                    nextDay &&
                                    handleReschedulePost(item.id, nextDay.dateKey)
                                  }
                                  title={
                                    nextDay ? `Move to ${nextDay.day}` : "Latest day"
                                  }
                                  className="p-1 rounded border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handlePublishNow(item.id)}
                                className="text-[10px] font-semibold text-emerald-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <Send className="h-2.5 w-2.5" /> Publish
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {dayItems.length === 0 && (
                        <div className="h-28 flex flex-col items-center justify-center text-[11px] text-muted-foreground/60 border border-dashed border-border rounded p-2 text-center">
                          <span>Drop post here</span>
                          <span className="text-[10px]">or schedule below</span>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-[11px] mt-2 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => {
                        setComposerDateKey(col.dateKey);
                        setComposerScheduleTime(`${col.day}, ${col.date} at 10:00 AM`);
                        setActiveTab("composer");
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Schedule Slot
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= VIEW 4: ANALYTICS ================= */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Audience Reach",
                value: "1,482,900",
                delta: "+14.8% vs last 30d",
                sub: "Impressions across 5 networks",
              },
              {
                label: "Net Follower Growth",
                value: "+18,450",
                delta: "+22.1% vs last 30d",
                sub: "Cross-platform audience additions",
              },
              {
                label: "Average Engagement Rate",
                value: "5.72%",
                delta: "+1.2% vs benchmark",
                sub: "Industry baseline: 3.4%",
              },
              {
                label: "Social Link Clicks",
                value: "64,820",
                delta: "+8.9% conversion lift",
                sub: "Direct referral traffic from link cards",
              },
            ].map((stat, idx) => (
              <Card key={idx} className="border-border">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-xs">{stat.label}</CardDescription>
                  <CardTitle className="text-2xl font-bold font-mono tabular-nums">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                    {stat.delta}
                  </span>
                  <span>·</span>
                  <span className="truncate">{stat.sub}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border">
              <CardHeader>
                <CardTitle className="text-base">Weekly Engagement Velocity</CardTitle>
                <CardDescription>
                  Daily impressions vs interactions across active social channels
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="reach"
                      name="Impressions"
                      stroke="#0284c7"
                      fillOpacity={1}
                      fill="url(#reachGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      name="Interactions"
                      stroke="#059669"
                      fillOpacity={1}
                      fill="url(#engGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Best Times to Publish</CardTitle>
                <CardDescription>Algorithmic peak audience windows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {[
                  {
                    net: "linkedin" as SocialNetwork,
                    name: "LinkedIn",
                    days: "Tuesday & Thursday",
                    time: "08:45 AM",
                  },
                  {
                    net: "twitter" as SocialNetwork,
                    name: "X / Twitter",
                    days: "Mon, Wed & Fri",
                    time: "12:30 PM",
                  },
                  {
                    net: "instagram" as SocialNetwork,
                    name: "Instagram",
                    days: "Wednesday & Sunday",
                    time: "07:00 PM",
                  },
                  {
                    net: "youtube" as SocialNetwork,
                    name: "YouTube",
                    days: "Thursday & Saturday",
                    time: "03:00 PM",
                  },
                ].map((slot) => (
                  <div
                    key={slot.net}
                    className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      {renderPlatformIcon(slot.net, "h-4 w-4")}
                      <div>
                        <div className="font-semibold">{slot.name}</div>
                        <div className="text-[11px] text-muted-foreground">{slot.days}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewPlatform(slot.net);
                        setComposerScheduleTime(`${slot.days.split(" ")[0]} at ${slot.time}`);
                        setActiveTab("composer");
                      }}
                      className="font-mono tabular-nums text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      {slot.time} →
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ================= VIEW 5: CONNECTED ACCOUNTS ================= */}
      {activeTab === "accounts" && (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base">Connected Social Channels</CardTitle>
              <CardDescription>
                Manage authorized publishing profiles and preview defaults
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              className="gap-1 text-xs cursor-pointer"
              onClick={() => router.push("/settings/social")}
            >
              <Plus className="h-3.5 w-3.5" /> Connect Account
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {connectedAccounts.map((acc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card text-xs"
              >
                <div className="flex items-center gap-3">
                  {renderPlatformIcon(acc.network, "h-5 w-5")}
                  <div>
                    <div className="font-bold text-sm">{acc.name}</div>
                    <div className="text-muted-foreground text-xs font-mono tabular-nums">
                      {acc.handle} · {acc.followers} followers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    {acc.status}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 cursor-pointer"
                    onClick={() => {
                      setPreviewPlatform(acc.network);
                      setActiveTab("composer");
                    }}
                  >
                    Preview Feed
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ================= MODAL COMPOSER (IF OPENED VIA DIALOG) ================= */}
      <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
        <DialogContent className="sm:max-w-[1100px] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-emerald-600" />
              Omnichannel Post Composer &amp; Live Platform Preview
            </DialogTitle>
            <DialogDescription>
              Draft your post, generate AI visuals, inspect character cutoffs across X, LinkedIn, Instagram, Facebook &amp; YouTube, and schedule.
            </DialogDescription>
          </DialogHeader>
          {renderComposerAndPreviewStudio(true)}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsComposerOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
