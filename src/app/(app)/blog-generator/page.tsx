"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import {
  savePostToFirestore,
  saveWorkspaceItemToFirestore,
} from "@/lib/firebase";
import {
  SocialPostLivePreview,
  SocialNetwork,
  renderPlatformIcon,
} from "@/components/social/social-post-live-preview";
import {
  PencilLine,
  Sparkles,
  Copy,
  Send,
  RefreshCw,
  CheckCircle2,
  BookOpen,
  Layers,
  Cloud,
  CalendarPlus,
} from "lucide-react";

interface BlogResult {
  title: string;
  outline: string[];
  content: string;
  metaDescription: string;
  estimatedReadTime: string;
}

interface RepurposedVariant {
  network: SocialNetwork;
  label: string;
  handle: string;
  content: string;
  scheduledTime: string;
  foldStrategy: string;
  charLimit: number;
  foldCutoff: number;
}

export default function BlogGeneratorPage() {
  const { toast } = useToast();
  const { user: firebaseUser } = useFirebase();

  const [topic, setTopic] = useState(
    "Why Multi-Platform Social Truncation Previews Increase CTR by 3.4x"
  );
  const [keywords, setKeywords] = useState(
    "social media preview, mobile fold truncation, B2B marketing automation"
  );
  const [targetUrl, setTargetUrl] = useState("https://visionai.studio/launch");
  const [tone, setTone] = useState("Authoritative & Data-Driven");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [isSchedulingAll, setIsSchedulingAll] = useState(false);

  const [blogResult, setBlogResult] = useState<BlogResult>({
    title:
      "Why Multi-Platform Social Truncation Previews Increase CTR by 3.4x",
    outline: [
      "1. The Hidden Cost of Mobile Fold Cutoffs Across 5 Networks",
      "2. Character Truncation Thresholds: X (280), LinkedIn (210), Instagram (125), Facebook (250) & YouTube (150)",
      "3. Structuring High-Converting Hooks & Link Cards Above the Fold",
      "4. Measuring Attribution & Pipeline Velocity in a Unified Command Center",
    ],
    content: `## 1. The Hidden Cost of Mobile Fold Cutoffs Across 5 Networks\n\nEvery day, marketing teams publish thousands of social updates whose primary call-to-action disappears behind a **"...more"** truncation link. When your hook or URL lands below the mobile fold, click-through rates drop by up to 64%.\n\n## 2. 2026 Platform Truncation Benchmarks\n\n- **X / Twitter**: 280 characters hard ceiling; links automatically render 1.91:1 OG summary cards.\n- **LinkedIn**: Truncates around ~210 characters on mobile feed cards.\n- **Instagram**: Truncates captions after ~125 characters.\n- **Facebook & YouTube**: Require crisp opening lines paired with high-contrast 16:9 or 4:5 media.\n\n## 3. Actionable Takeaway\n\nAlways validate your copy in a side-by-side multi-platform preview before hitting schedule.`,
    metaDescription:
      "Discover how previewing character truncation and link cards across X, LinkedIn, Instagram, Facebook, and YouTube boosts social CTR by 3.4x.",
    estimatedReadTime: "5 min read",
  });

  const [repurposedKit, setRepurposedKit] = useState<RepurposedVariant[]>([
    {
      network: "twitter",
      label: "X / Twitter Hook + Thread Starter",
      handle: "@VisionAI_HQ",
      content:
        "Why do 68% of social posts lose clicks at the fold? 🚨\n\nOur new benchmark breaks down how validating native cutoffs across 5 networks boosts CTR by 3.4x.\n\nFull playbook: https://visionai.studio/launch #SocialMedia #MarketingAI #Growth",
      scheduledTime: "Mon, Oct 19 at 9:30 AM",
      foldStrategy:
        "Under 280 chars with link card trigger and above-the-fold ROI hook.",
      charLimit: 280,
      foldCutoff: 280,
    },
    {
      network: "linkedin",
      label: "LinkedIn Executive Thought Leadership",
      handle: "VisionAI Technologies",
      content:
        "Why Multi-Platform Social Truncation Previews Increase CTR by 3.4x — Read the Q4 benchmark before the fold (https://visionai.studio/launch):\n\nMost B2B teams bury their primary CTA in paragraph three, losing 64% of mobile readers behind the '...see more' link.\n\n• Validate mobile fold cutoffs (~210 chars on LinkedIn)\n• Pair executive benchmarks with native OG link cards\n• Unify attribution across all 5 social channels\n\n#B2BMarketing #ContentStrategy #MarketingOps",
      scheduledTime: "Tue, Oct 20 at 8:45 AM",
      foldStrategy:
        "Primary hook + benchmark URL placed inside the first 195 characters before LinkedIn’s 210-char fold.",
      charLimit: 3000,
      foldCutoff: 210,
    },
    {
      network: "instagram",
      label: "Instagram 4:5 Carousel Caption",
      handle: "@visionai.studio",
      content:
        "Stop losing clicks to the '...more' cutoff ✨ Swipe through our 3.4x CTR Fold Playbook →\n\nSlide 1: The 125-char Instagram hook rule\nSlide 2: Side-by-side 5-network previewing\nSlide 3: 3.4x CTR benchmark results\n\nFull guide at https://visionai.studio/launch #CreatorEconomy #SocialMediaMarketing #DesignSystems",
      scheduledTime: "Wed, Oct 21 at 12:15 PM",
      foldStrategy:
        "Opening 110 characters deliver the core value proposition before Instagram’s 125-char caption fold.",
      charLimit: 2200,
      foldCutoff: 125,
    },
    {
      network: "facebook",
      label: "Facebook Community & Link Card Post",
      handle: "VisionAI Official Page",
      content:
        "New Playbook Live: Why Multi-Platform Social Truncation Previews Increase CTR by 3.4x 📊\n\nSee how marketing teams are eliminating premature caption truncation across 5 channels simultaneously: https://visionai.studio/launch\n\nWhat network drives the highest engagement for your team right now? #DigitalMarketing #SocialStrategy",
      scheduledTime: "Thu, Oct 22 at 2:00 PM",
      foldStrategy:
        "Direct headline + URL placed above Facebook’s 250-character fold to trigger native OpenGraph link card.",
      charLimit: 63206,
      foldCutoff: 250,
    },
    {
      network: "youtube",
      label: "YouTube 16:9 Community & Shorts Description",
      handle: "VisionAI Official",
      content:
        "3.4x CTR Fold Benchmark — Full 60s Walkthrough (https://visionai.studio/launch)\n\n00:00 Why mobile fold truncation kills CTR\n00:18 Live side-by-side preview across X, LinkedIn, Instagram, Facebook & YouTube\n00:42 How to schedule all 5 channels in 1 click\n\n#YouTubeShorts #MarketingAutomation #SaaSGrowth",
      scheduledTime: "Fri, Oct 23 at 11:00 AM",
      foldStrategy:
        "Title and link appear in the first 120 characters before YouTube’s 150-char 'Read more' cutoff.",
      charLimit: 5000,
      foldCutoff: 150,
    },
  ]);

  const [selectedVariantNetwork, setSelectedVariantNetwork] =
    useState<SocialNetwork>("linkedin");

  const activeVariant =
    repurposedKit.find((v) => v.network === selectedVariantNetwork) ||
    repurposedKit[0];

  const handleGenerateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        variant: "destructive",
        title: "Topic Required",
        description: "Please enter a blog topic or brief.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: topic,
          tone,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate blog article");
      const data = await res.json();
      setBlogResult(data);
      toast({
        title: "Gemini Blog Article Generated",
        description: `Created "${data.title}" with Brand Voice Memory applied.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error?.message || "Could not generate blog article.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToContentSuite = async () => {
    setIsSavingArticle(true);
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "content",
          title: blogResult.title,
          status: "published",
          summary: blogResult.metaDescription || blogResult.content.slice(0, 280),
          primaryMetric: 12400,
          secondaryMetric: 6.4,
          meta: {
            type: "blog",
            author: "Alex Morgan",
            channel: "Blog & Omnichannel",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save to Content Suite");
      const { item } = await res.json();

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "content",
          title: item.title,
          status: item.status,
          summary: item.summary,
          primaryMetric: Number(item.primaryMetric) || 12400,
          secondaryMetric: Number(item.secondaryMetric) || 6.4,
        });
      }

      toast({
        title: "Saved to Content Management Suite",
        description: firebaseUser
          ? "Article archived locally and synced to Firestore /workspaceItems."
          : "Article saved to Content Management Library.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: err?.message || "Could not save article.",
      });
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleRepurposeOmnichannel = async () => {
    setIsRepurposing(true);
    try {
      const res = await fetch("/api/ai/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogResult.title,
          content: blogResult.content,
          targetUrl,
          useBrandVoice: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to repurpose article");
      const data = await res.json();
      if (Array.isArray(data.variants) && data.variants.length > 0) {
        setRepurposedKit(data.variants);
        setSelectedVariantNetwork(data.variants[0].network);
      }
      toast({
        title: "5-Channel Omnichannel Kit Generated",
        description:
          "Tailored for X, LinkedIn, Instagram, Facebook & YouTube with fold-cutoff optimization.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Repurpose Error",
        description: err?.message || "Could not generate omnichannel kit.",
      });
    } finally {
      setIsRepurposing(false);
    }
  };

  const handleScheduleAllKit = async () => {
    setIsSchedulingAll(true);
    try {
      let scheduledCount = 0;
      for (const variant of repurposedKit) {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: variant.content,
            network: variant.network,
            platforms: [variant.network],
            handle: variant.handle,
            status: "scheduled",
            scheduledTime: variant.scheduledTime,
            presetId: "preset-playbook",
          }),
        });
        if (res.ok) {
          const { post } = await res.json();
          scheduledCount++;
          if (firebaseUser && firebaseUser.emailVerified && post) {
            await savePostToFirestore({
              id: `${firebaseUser.uid}_${post.id}`,
              userId: firebaseUser.uid,
              network: variant.network,
              handle: variant.handle,
              content: variant.content,
              status: "scheduled",
              scheduledTime: variant.scheduledTime,
            });
          }
        }
      }

      toast({
        title: `Scheduled ${scheduledCount} Omnichannel Posts`,
        description: firebaseUser
          ? "All 5 channel-native variations queued in Planner & synced to Firestore /posts."
          : "All 5 channel-native variations queued in your Social Command Center Planner.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Batch Schedule Error",
        description: error?.message || "Could not schedule omnichannel kit.",
      });
    } finally {
      setIsSchedulingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Blog & Omnichannel Repurposing Studio"
        description="Generate SEO-optimized long-form articles with Brand Voice Memory and 1-click repurpose them into fold-validated posts across X, LinkedIn, Instagram, Facebook, and YouTube."
        icon={PencilLine}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSavingArticle}
              onClick={handleSaveToContentSuite}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              {isSavingArticle ? "Saving..." : "Save to Content Suite"}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isRepurposing}
              onClick={handleRepurposeOmnichannel}
              className="gap-1.5 text-xs cursor-pointer"
            >
              {isRepurposing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Layers className="h-3.5 w-3.5" />
              )}
              1-Click Repurpose to 5 Channels
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 h-fit">
          <form onSubmit={handleGenerateBlog}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Article Brief &amp; SEO Parameters
              </CardTitle>
              <CardDescription>
                Powered by server-side Gemini 3.8 Flash + Brand Voice Memory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blog-topic">Topic / Headline Prompt</Label>
                <Textarea
                  id="blog-topic"
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., How B2B SaaS teams scale organic pipeline with multi-network social previews..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-keywords">
                  Target SEO Keywords (comma-separated)
                </Label>
                <Input
                  id="blog-keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="social media scheduler, fold preview, marketing ROI"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-url">
                  Target CTA Link for Social Cutdowns
                </Label>
                <Input
                  id="blog-url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://visionai.studio/launch"
                />
              </div>

              <div className="space-y-2">
                <Label>Editorial Voice &amp; Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Authoritative & Data-Driven">
                      Authoritative &amp; Data-Driven
                    </SelectItem>
                    <SelectItem value="Executive Thought Leadership">
                      Executive Thought Leadership
                    </SelectItem>
                    <SelectItem value="Tactical Step-by-Step Playbook">
                      Tactical Step-by-Step Playbook
                    </SelectItem>
                    <SelectItem value="Conversational & Creator-Friendly">
                      Conversational &amp; Creator-Friendly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating Article with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Full SEO Article
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="outline" className="gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                {blogResult.estimatedReadTime}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `# ${blogResult.title}\n\n${blogResult.content}`
                    );
                    toast({
                      title: "Copied to Clipboard",
                      description: "Full Markdown article copied.",
                    });
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Markdown
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isRepurposing}
                  onClick={handleRepurposeOmnichannel}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5" />
                  {isRepurposing
                    ? "Repurposing..."
                    : "Generate 5-Channel Cutdowns"}
                </Button>
              </div>
            </div>
            <CardTitle className="text-xl pt-2">{blogResult.title}</CardTitle>
            <CardDescription>{blogResult.metaDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {blogResult.outline?.length > 0 && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Structured Article Outline
                </p>
                <ul className="space-y-1 text-sm">
                  {blogResult.outline.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg border bg-card p-5 whitespace-pre-wrap text-sm leading-relaxed">
              {blogResult.content}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Omnichannel Repurposing Studio + Live Native Fold Previews */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                One-Click Omnichannel Repurposing Kit (5 Networks)
              </CardTitle>
              <CardDescription>
                Each variation is automatically engineered to place your hook and link card above that platform&apos;s mobile fold cutoff.
              </CardDescription>
            </div>
            <Button
              type="button"
              disabled={isSchedulingAll}
              onClick={handleScheduleAllKit}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shrink-0"
            >
              {isSchedulingAll ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Dispatching 5 Channels...
                </>
              ) : (
                <>
                  <CalendarPlus className="h-4 w-4" />
                  Schedule All 5 Channels to Planner
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: 5 Channel Cutdowns List & Editor */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {repurposedKit.map((item) => {
                  const isSelected = item.network === selectedVariantNetwork;
                  return (
                    <button
                      key={item.network}
                      type="button"
                      onClick={() => setSelectedVariantNetwork(item.network)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {renderPlatformIcon(item.network, "h-3.5 w-3.5")}
                      <span className="capitalize">{item.network}</span>
                      <span className="font-mono text-[10px] opacity-75">
                        ({item.content.length}/{item.charLimit})
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeVariant && (
                <div className="rounded-lg border p-4 space-y-3 bg-muted/10">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-2">
                        {renderPlatformIcon(activeVariant.network, "h-4 w-4")}
                        {activeVariant.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Slot: <span className="font-mono">{activeVariant.scheduledTime}</span> · Fold Cutoff:{" "}
                        <span className="font-mono">{activeVariant.foldCutoff} chars</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1.5 cursor-pointer"
                      onClick={async () => {
                        const res = await fetch("/api/posts", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            content: activeVariant.content,
                            network: activeVariant.network,
                            platforms: [activeVariant.network],
                            handle: activeVariant.handle,
                            status: "scheduled",
                            scheduledTime: activeVariant.scheduledTime,
                            presetId: "preset-playbook",
                          }),
                        });
                        if (res.ok) {
                          const { post } = await res.json();
                          if (firebaseUser && firebaseUser.emailVerified && post) {
                            await savePostToFirestore({
                              id: `${firebaseUser.uid}_${post.id}`,
                              userId: firebaseUser.uid,
                              network: activeVariant.network,
                              handle: activeVariant.handle,
                              content: activeVariant.content,
                              status: "scheduled",
                              scheduledTime: activeVariant.scheduledTime,
                            });
                          }
                          toast({
                            title: `Queued ${activeVariant.network.toUpperCase()} Cutdown`,
                            description: `Scheduled for ${activeVariant.scheduledTime}.`,
                          });
                        }
                      }}
                    >
                      <Send className="h-3 w-3" />
                      Queue {activeVariant.network}
                    </Button>
                  </div>

                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <strong>Fold Optimization Strategy:</strong> {activeVariant.foldStrategy}
                  </div>

                  <Textarea
                    rows={6}
                    value={activeVariant.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRepurposedKit((prev) =>
                        prev.map((v) =>
                          v.network === activeVariant.network
                            ? { ...v, content: val }
                            : v
                        )
                      );
                    }}
                    className="text-xs leading-relaxed font-sans"
                  />
                </div>
              )}
            </div>

            {/* Right: Live Native Card Simulation */}
            <div className="lg:col-span-6">
              {activeVariant && (
                <SocialPostLivePreview
                  content={activeVariant.content}
                  selectedPlatforms={repurposedKit.map((v) => v.network)}
                  activePlatform={selectedVariantNetwork}
                  onActivePlatformChange={setSelectedVariantNetwork}
                  selectedPresetId="preset-playbook"
                  scheduledTime={activeVariant.scheduledTime}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
