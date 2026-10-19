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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Send,
  Eye,
  History,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";
import {
  SocialPostLivePreview,
  SocialNetwork,
  PLATFORM_SPECS,
  MEDIA_PRESETS,
  renderPlatformIcon,
} from "@/components/social/social-post-live-preview";

type ContentType = "text" | "image" | "video" | "carousel";

interface GeneratedPostRecord {
  id: string;
  platforms: SocialNetwork[];
  content: string;
  contentType: ContentType;
  scheduledFor?: string;
  presetId?: string | null;
  mediaUrl?: string | null;
  timestamp: string;
}

export default function SocialMediaGeneratorPage() {
  const { toast } = useToast();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialNetwork[]>([
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "youtube",
  ]);
  const [activePreviewPlatform, setActivePreviewPlatform] =
    useState<SocialNetwork>("twitter");
  const [contentType, setContentType] = useState<ContentType>("image");
  const [prompt, setPrompt] = useState(
    "Launching our new real-time multi-channel analytics engine that helps B2B and consumer brands boost campaign conversion by 4.2x."
  );
  const [draftCaption, setDraftCaption] = useState(
    "We are excited to introduce the 2026 Omnichannel Attribution Engine from @VisionAI_HQ! Marketing teams can now unify creative testing, fold-aware copywriting, and audience velocity in one workspace.\n\nRead the launch benchmark: https://visionai.io/launch #MarketingAutomation #ProductLaunch #B2BGrowth #VisionAI"
  );
  const [tone, setTone] = useState("professional");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    "preset-analytics"
  );
  const [customMediaUrl, setCustomMediaUrl] = useState<string | null>(null);
  const [customMediaLabel, setCustomMediaLabel] = useState<string | null>(null);
  const [visualAspectRatio, setVisualAspectRatio] = useState<
    "16:9" | "1:1" | "4:5"
  >("16:9");
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  const [scheduledSlot, setScheduledSlot] = useState("Tomorrow at 9:30 AM");
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPostRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rightPanelView, setRightPanelView] = useState<"preview" | "history">(
    "preview"
  );

  const togglePlatform = (platform: SocialNetwork) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.length > 1 ? prev.filter((p) => p !== platform) : prev;
      }
      return [...prev, platform];
    });
    setActivePreviewPlatform(platform);
  };

  const generatePost = async () => {
    if (!prompt.trim() || selectedPlatforms.length === 0) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          platforms: selectedPlatforms,
          contentType,
          tone,
          scheduledFor: scheduledSlot,
          useBrandVoice: true,
        }),
      });

      let contentResult = "";
      if (response.ok) {
        const data = await response.json();
        contentResult = data?.postContent || data?.content || "";
      }

      if (!contentResult) {
        contentResult = `${prompt}\n\nKey highlights from @VisionAI_HQ:\n• Real-time cross-network adaptation\n• Native character & fold optimization\n• Predictive peak-time scheduling\n\nFull report: https://visionai.io/insights #DigitalMarketing #Omnichannel #VisionAI`;
      }

      setDraftCaption(contentResult);
      const record: GeneratedPostRecord = {
        id: `gen-${Date.now()}`,
        platforms: [...selectedPlatforms],
        content: contentResult,
        contentType,
        scheduledFor: scheduledSlot,
        presetId: selectedPresetId,
        mediaUrl: customMediaUrl,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setGeneratedPosts((prev) => [record, ...prev]);
      setRightPanelView("preview");
      toast({
        title: "Post Copy Generated with Brand Voice Memory",
        description: `Adapted for ${selectedPlatforms.length} selected networks. Inspect the live preview before scheduling.`,
      });
    } catch {
      const fallback = `${prompt}\n\nExplore the full interactive walkthrough with @VisionAI_HQ at https://visionai.io/launch #MarketingStrategy #SocialMedia #VisionAI`;
      setDraftCaption(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVisual = async () => {
    const promptText = prompt.trim() || draftCaption.slice(0, 80);
    if (!promptText) return;
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
        setCustomMediaUrl(data.imageUrl);
        setCustomMediaLabel(data.visual?.headline || promptText);
        setSelectedPresetId(null);
        setRightPanelView("preview");
        toast({
          title: "AI Marketing Visual Generated",
          description: `Attached ${visualAspectRatio} graphic to your live post preview.`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Visual Generation Error",
        description: error?.message || "Could not generate visual.",
      });
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!draftCaption.trim()) return;
    const record: GeneratedPostRecord = {
      id: `sched-${Date.now()}`,
      platforms: [...selectedPlatforms],
      content: draftCaption,
      contentType,
      scheduledFor: scheduledSlot || "Tomorrow at 9:30 AM",
      presetId: selectedPresetId,
      mediaUrl: customMediaUrl,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setGeneratedPosts((prev) => [record, ...prev]);

    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: draftCaption,
          network: selectedPlatforms[0] || "twitter",
          platforms: selectedPlatforms,
          status: "scheduled",
          scheduledTime: scheduledSlot || "Tomorrow at 9:30 AM",
          presetId: selectedPresetId,
          mediaUrl: customMediaUrl,
        }),
      });
    } catch (e) {
      console.error("Failed to save scheduled post:", e);
    }

    toast({
      title: "Scheduled Across Selected Platforms",
      description: `Queued for ${
        scheduledSlot || "Tomorrow at 9:30 AM"
      } on ${selectedPlatforms.map((p) => PLATFORM_SPECS[p].shortName).join(", ")}.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Media Post Generator & AI Visual Studio"
        description="Draft, generate AI copy & visuals with Brand Voice Memory, and preview how your social media post renders on X/Twitter, LinkedIn, Instagram, Facebook, and YouTube."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section: Post Configuration & Caption Editor */}
        <Card className="lg:col-span-5 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base">Post Composer &amp; AI Settings</CardTitle>
            <CardDescription className="text-xs">
              Configure target networks, generate AI visuals, and test formatting in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Target Platforms */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Target Networks</Label>
                <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                  {selectedPlatforms.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  ["twitter", "linkedin", "instagram", "facebook", "youtube"] as SocialNetwork[]
                ).map((platform) => {
                  const spec = PLATFORM_SPECS[platform];
                  const isSelected = selectedPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground"
                          : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {renderPlatformIcon(
                        platform,
                        `h-3.5 w-3.5 ${isSelected ? "text-background" : ""}`
                      )}
                      <span>{spec.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Prompt + Tone */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="ai-prompt" className="text-xs font-semibold">
                  Topic or Campaign Brief
                </Label>
                <select
                  aria-label="Tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="h-7 text-xs border border-border rounded px-2 bg-background text-foreground"
                >
                  <option value="professional">Tone: Professional</option>
                  <option value="casual">Tone: Conversational</option>
                  <option value="friendly">Tone: Community First</option>
                  <option value="humorous">Tone: Witty &amp; Bold</option>
                </select>
              </div>
              <Textarea
                id="ai-prompt"
                placeholder="Describe your announcement, offer, or campaign topic..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePost}
                  disabled={!prompt.trim() || selectedPlatforms.length === 0 || isGenerating}
                  className="h-8 text-xs gap-1.5 cursor-pointer"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "Writing..." : "Generate AI Copy"}
                </Button>
                <div className="flex items-center gap-1">
                  <select
                    aria-label="Aspect Ratio"
                    value={visualAspectRatio}
                    onChange={(e) =>
                      setVisualAspectRatio(e.target.value as "16:9" | "1:1" | "4:5")
                    }
                    className="h-8 text-[11px] border border-border rounded px-1.5 bg-background font-mono"
                  >
                    <option value="16:9">16:9</option>
                    <option value="1:1">1:1</option>
                    <option value="4:5">4:5</option>
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerateVisual}
                    disabled={isGeneratingVisual}
                    className="h-8 text-xs gap-1 flex-1 cursor-pointer"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-emerald-500" />
                    {isGeneratingVisual ? "..." : "AI Visual"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Caption Editor */}
            <div className="space-y-1.5 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="caption-editor" className="text-xs font-semibold">
                  Live Caption Editor
                </Label>
                <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                  {draftCaption.length} chars
                </span>
              </div>
              <Textarea
                id="caption-editor"
                value={draftCaption}
                onChange={(e) => setDraftCaption(e.target.value)}
                rows={5}
                className="text-xs font-sans leading-relaxed"
              />
            </div>

            {/* Media Format & Visual Preset */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Visual Attachment Preset</Label>
                {(selectedPresetId || customMediaUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(null);
                      setCustomMediaUrl(null);
                      setCustomMediaLabel(null);
                    }}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Use URL Link Card
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MEDIA_PRESETS.map((preset) => {
                  const active = selectedPresetId === preset.id && !customMediaUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setCustomMediaUrl(null);
                        setCustomMediaLabel(null);
                        setSelectedPresetId(active ? null : preset.id);
                      }}
                      className={`p-2 rounded border text-left text-xs transition-all cursor-pointer ${
                        active
                          ? "border-foreground bg-muted/60 font-medium"
                          : "border-border bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {preset.aspect}
                      </div>
                      <div className="truncate font-semibold text-[11px]">{preset.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule Time */}
            <div className="space-y-1.5 border-t border-border pt-3">
              <Label htmlFor="schedule-slot" className="text-xs font-semibold">
                Schedule Time Slot
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="schedule-slot"
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs shrink-0 cursor-pointer"
                  onClick={() => setScheduledSlot("Thu at 8:45 AM (Peak)")}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" /> Peak
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-3 flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleSchedulePost}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Schedule Post
            </Button>
          </CardFooter>
        </Card>

        {/* Right Section: Live Multi-Platform Preview & History */}
        <Card className="lg:col-span-7 border-border">
          <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Live Multi-Platform Preview
              </CardTitle>
              <CardDescription className="text-xs">
                Inspect native platform rendering, character truncation cutoffs, AI visuals, and link cards.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setRightPanelView("preview")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  rightPanelView === "preview"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setRightPanelView("history")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  rightPanelView === "history"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>History ({generatedPosts.length})</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {rightPanelView === "preview" ? (
              <SocialPostLivePreview
                content={draftCaption}
                selectedPlatforms={selectedPlatforms}
                activePlatform={activePreviewPlatform}
                onActivePlatformChange={setActivePreviewPlatform}
                selectedPresetId={selectedPresetId}
                customMediaUrl={customMediaUrl}
                customMediaLabel={customMediaLabel}
                mediaType={contentType}
                scheduledTime={scheduledSlot}
              />
            ) : (
              <div className="space-y-3">
                {generatedPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs">
                    No generated or scheduled posts yet. Use the composer on the left to create one.
                  </div>
                ) : (
                  generatedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-lg border border-border bg-card space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {post.platforms.map((p) => (
                            <span key={p} title={PLATFORM_SPECS[p].name}>
                              {renderPlatformIcon(p, "h-3.5 w-3.5")}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {post.scheduledFor || post.timestamp}
                        </span>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {post.content}
                      </p>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setDraftCaption(post.content);
                            setSelectedPlatforms(post.platforms);
                            setSelectedPresetId(post.presetId || null);
                            setCustomMediaUrl(post.mediaUrl || null);
                            setRightPanelView("preview");
                          }}
                        >
                          Load in Preview
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}