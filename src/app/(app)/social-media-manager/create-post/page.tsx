"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SquarePen, Clock, Send, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  SocialPostLivePreview,
  SocialNetwork,
  PLATFORM_SPECS,
  MEDIA_PRESETS,
  renderPlatformIcon,
} from "@/components/social/social-post-live-preview";

export default function CreateSocialPostPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialNetwork[]>([
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "youtube",
  ]);
  const [activePlatform, setActivePlatform] = useState<SocialNetwork>("linkedin");
  const [content, setContent] = useState(
    "Announcing our Q4 Product Keynote! Join @VisionAI_HQ as we unveil autonomous multi-channel campaign orchestration.\n\nReserve your spot: https://visionai.io/keynote #ProductLaunch #MarketingTech #B2BGrowth"
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    "preset-launch"
  );
  const [scheduledTime, setScheduledTime] = useState("Tomorrow at 9:00 AM");

  const togglePlatform = (net: SocialNetwork) => {
    setSelectedPlatforms((prev) =>
      prev.includes(net)
        ? prev.length > 1
          ? prev.filter((n) => n !== net)
          : prev
        : [...prev, net]
    );
    setActivePlatform(net);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Social Media Post"
        description="Draft your post and preview how it looks on X, LinkedIn, Instagram, Facebook, and YouTube before scheduling."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-5 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <SquarePen className="h-4 w-4 text-emerald-600" />
              Post Composer
            </CardTitle>
            <CardDescription className="text-xs">
              Select channels, craft your message, and attach media.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Platforms</Label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  ["twitter", "linkedin", "instagram", "facebook", "youtube"] as SocialNetwork[]
                ).map((net) => {
                  const isSelected = selectedPlatforms.includes(net);
                  return (
                    <button
                      key={net}
                      type="button"
                      onClick={() => togglePlatform(net)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground"
                          : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {renderPlatformIcon(
                        net,
                        `h-3.5 w-3.5 ${isSelected ? "text-background" : ""}`
                      )}
                      <span>{PLATFORM_SPECS[net].name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-post-caption" className="text-xs font-semibold">
                Caption
              </Label>
              <Textarea
                id="create-post-caption"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Visual Attachment</Label>
              <div className="grid grid-cols-3 gap-2">
                {MEDIA_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setSelectedPresetId(
                        selectedPresetId === preset.id ? null : preset.id
                      )
                    }
                    className={`p-2 rounded-lg border text-left text-xs cursor-pointer ${
                      selectedPresetId === preset.id
                        ? "border-foreground bg-muted/60"
                        : "border-border bg-background hover:bg-muted/30"
                    }`}
                  >
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {preset.aspect}
                    </div>
                    <div className="font-semibold truncate">{preset.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-schedule-time" className="text-xs font-semibold">
                Schedule Time
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="create-schedule-time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => setScheduledTime("Thu at 9:00 AM")}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" /> Optimal
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-3 flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={() => {
                toast({
                  title: "Post Scheduled",
                  description: `Queued across ${selectedPlatforms.length} platforms for ${scheduledTime}.`,
                });
                router.push("/dashboard");
              }}
            >
              <Send className="h-3.5 w-3.5" /> Schedule Post
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-7 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-emerald-600" />
              Live Multi-Platform Preview
            </CardTitle>
            <CardDescription className="text-xs">
              Preview how your post appears on each selected network prior to scheduling.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SocialPostLivePreview
              content={content}
              selectedPlatforms={selectedPlatforms}
              activePlatform={activePlatform}
              onActivePlatformChange={setActivePlatform}
              selectedPresetId={selectedPresetId}
              scheduledTime={scheduledTime}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
