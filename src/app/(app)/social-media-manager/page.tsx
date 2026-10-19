"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Send,
  Eye,
  Sparkles,
  RefreshCw,
  Zap,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { savePostToFirestore } from "@/lib/firebase";
import {
  SocialPostLivePreview,
  SocialNetwork,
  PLATFORM_SPECS,
  MEDIA_PRESETS,
  renderPlatformIcon,
} from "@/components/social/social-post-live-preview";

export default function SocialMediaManagerPage() {
  const { toast } = useToast();
  const { user: firebaseUser } = useFirebase();

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialNetwork[]>([
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "youtube",
  ]);
  const [activePlatform, setActivePlatform] =
    useState<SocialNetwork>("twitter");
  const [caption, setCaption] = useState(
    "Unlocking 4.2x pipeline velocity in Q4 with unified cross-channel scheduling and real-time native post previews.\n\nSee how @VisionAI_HQ orchestrates high-performing campaigns at https://visionai.io/manager #SocialMediaManager #MarketingOps #B2BGrowth"
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    "preset-launch"
  );
  const [customMediaUrl, setCustomMediaUrl] = useState<string | null>(null);
  const [customMediaLabel, setCustomMediaLabel] = useState<string | null>(null);
  const [visualPrompt, setVisualPrompt] = useState(
    "Autonomous Campaign Orchestration with 99.9% Sync"
  );
  const [visualAspectRatio, setVisualAspectRatio] = useState<
    "16:9" | "1:1" | "4:5"
  >("16:9");
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  const [scheduleTime, setScheduleTime] = useState("Tomorrow at 10:00 AM");
  const [isDispatching, setIsDispatching] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const togglePlatform = (net: SocialNetwork) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(net)) {
        return prev.length > 1 ? prev.filter((item) => item !== net) : prev;
      }
      return [...prev, net];
    });
    setActivePlatform(net);
  };

  const handleAIOptimizeHook = async () => {
    if (!caption.trim()) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: caption,
          platforms: selectedPlatforms,
          tone: "High-Converting & Fold-Optimized",
          useBrandVoice: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to optimize post with Gemini");
      const data = await res.json();
      if (data.postContent) {
        setCaption(data.postContent);
        toast({
          title: "Optimized with Gemini & Brand Voice Memory",
          description: `Tailored hook above the ${PLATFORM_SPECS[activePlatform].foldChars}-char fold for ${PLATFORM_SPECS[activePlatform].name}.`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Optimization Error",
        description: error?.message || "Could not optimize caption.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateVisual = async () => {
    const promptText =
      visualPrompt.trim() ||
      caption.slice(0, 80).trim() ||
      "Omnichannel Marketing Launch";
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
        toast({
          title: "AI Marketing Visual Attached",
          description: `Generated ${visualAspectRatio} graphic ("${data.visual?.headline || promptText}") for live preview.`,
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

  const handlePublishOrSchedule = async (publishNow: boolean) => {
    if (!caption.trim()) return;
    setIsDispatching(true);
    try {
      const res = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: caption,
          platforms: selectedPlatforms,
          publishNow,
          scheduledTime: publishNow ? "Published Live" : scheduleTime,
          mediaUrl: customMediaUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch post");
      }

      if (firebaseUser && firebaseUser.emailVerified && Array.isArray(data.posts)) {
        for (const p of data.posts) {
          await savePostToFirestore({
            id: `${firebaseUser.uid}_${p.id}`,
            userId: firebaseUser.uid,
            network: p.network,
            handle: p.handle || "@VisionAI_HQ",
            content: p.content,
            status: p.status,
            scheduledTime: p.scheduledTime,
          });
        }
      }

      toast({
        title: publishNow
          ? `Dispatched Live to ${selectedPlatforms.length} Networks`
          : `Scheduled Across ${selectedPlatforms.length} Networks`,
        description: publishNow
          ? `Published immediately across ${selectedPlatforms.map((n) => PLATFORM_SPECS[n].name).join(", ")}.`
          : `Queued for ${scheduleTime} in Streams & Planner Command Center.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Dispatch Error",
        description: error?.message || "Could not publish or schedule post.",
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Media Preview Studio & Omnichannel Dispatcher"
        description="Compose posts with Brand Voice Memory, generate AI marketing visuals, inspect native platform previews across X, LinkedIn, Instagram, Facebook & YouTube, and schedule."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation & Composer Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Post Composer &amp; Dispatcher
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingAI}
                  onClick={handleAIOptimizeHook}
                  className="h-7 text-xs gap-1.5 cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  )}
                  AI Fold Optimizer
                </Button>
              </div>
              <CardDescription className="text-xs">
                Select target platforms, generate AI visuals, and test formatting in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Target Platform Buttons */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Networks</Label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      "twitter",
                      "linkedin",
                      "instagram",
                      "facebook",
                      "youtube",
                    ] as SocialNetwork[]
                  ).map((net) => {
                    const spec = PLATFORM_SPECS[net];
                    const isSelected = selectedPlatforms.includes(net);
                    return (
                      <button
                        key={net}
                        type="button"
                        onClick={() => togglePlatform(net)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isSelected
                            ? "bg-foreground text-background border-foreground"
                            : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        {renderPlatformIcon(
                          net,
                          `h-3.5 w-3.5 ${isSelected ? "text-background" : ""}`
                        )}
                        <span>{spec.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smm-caption" className="text-xs font-semibold">
                    Post Copy
                  </Label>
                  <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                    {caption.length} chars
                  </span>
                </div>
                <Textarea
                  id="smm-caption"
                  rows={5}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* AI Visual Generator */}
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Wand2 className="h-3.5 w-3.5 text-emerald-500" />
                    AI Marketing Visual Generator
                  </Label>
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
                      Use Link Card Only
                    </button>
                  )}
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Input
                      placeholder="Describe visual card to generate..."
                      value={visualPrompt}
                      onChange={(e) => setVisualPrompt(e.target.value)}
                      className="h-8 text-xs flex-1 bg-background"
                    />
                    <select
                      aria-label="Aspect Ratio"
                      value={visualAspectRatio}
                      onChange={(e) =>
                        setVisualAspectRatio(
                          e.target.value as "16:9" | "1:1" | "4:5"
                        )
                      }
                      className="h-8 text-xs border border-border rounded px-2 bg-background font-mono"
                    >
                      <option value="16:9">16:9</option>
                      <option value="1:1">1:1</option>
                      <option value="4:5">4:5</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isGeneratingVisual}
                    onClick={handleGenerateVisual}
                    className="w-full h-7 text-xs gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {isGeneratingVisual
                      ? "Generating AI Visual..."
                      : "Generate AI Visual"}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {MEDIA_PRESETS.map((preset) => {
                    const active =
                      selectedPresetId === preset.id && !customMediaUrl;
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
                        <div className="truncate font-semibold text-[11px]">
                          {preset.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Input */}
              <div className="space-y-1.5 border-t border-border pt-3">
                <Label htmlFor="smm-schedule" className="text-xs font-semibold">
                  Schedule Time
                </Label>
                <Input
                  id="smm-schedule"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDispatching}
                onClick={() => handlePublishOrSchedule(false)}
                className="text-xs h-8 gap-1.5 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                {isDispatching ? "Queueing..." : "Schedule Post"}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isDispatching}
                onClick={() => handlePublishOrSchedule(true)}
                className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5" />
                {isDispatching ? "Publishing..." : "Publish Live Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Live Multi-Platform Preview */}
        <div className="lg:col-span-7">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-600" />
                Interactive Multi-Platform Preview
              </CardTitle>
              <CardDescription className="text-xs">
                Switch between Single View and Side-by-Side Comparison to verify character limits, AI visuals, and truncation folds.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <SocialPostLivePreview
                content={caption}
                selectedPlatforms={selectedPlatforms}
                activePlatform={activePlatform}
                onActivePlatformChange={setActivePlatform}
                selectedPresetId={selectedPresetId}
                customMediaUrl={customMediaUrl}
                customMediaLabel={customMediaLabel}
                scheduledTime={scheduleTime}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
