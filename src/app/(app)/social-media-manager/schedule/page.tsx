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
import { CalendarPlus, Clock, Send, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  SocialPostLivePreview,
  SocialNetwork,
  PLATFORM_SPECS,
  MEDIA_PRESETS,
  renderPlatformIcon,
} from "@/components/social/social-post-live-preview";

export default function ScheduleSocialPostPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialNetwork[]>([
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "youtube",
  ]);
  const [activePlatform, setActivePlatform] = useState<SocialNetwork>("twitter");
  const [content, setContent] = useState(
    "Ready for next week's campaign sprint? Here is how @VisionAI_HQ automates multi-network scheduling while keeping every platform's native look and feel intact.\n\nLearn more at https://visionai.io/schedule #SocialMedia #ContentPlanning #MarketingAutomation"
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    "preset-playbook"
  );
  const [scheduledTime, setScheduledTime] = useState("Oct 22, 2026 at 09:30 AM");

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
        title="Schedule Social Media Post"
        description="Verify your post across X, LinkedIn, Instagram, Facebook, and YouTube before confirming your publication slot."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-5 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarPlus className="h-4 w-4 text-emerald-600" />
              Schedule Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Choose target networks, finalize copy, and lock in your dispatch window.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Networks</Label>
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
              <Label htmlFor="sched-caption" className="text-xs font-semibold">
                Post Content
              </Label>
              <Textarea
                id="sched-caption"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Creative Preset</Label>
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
              <Label htmlFor="sched-time" className="text-xs font-semibold">
                Publication Date &amp; Time
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sched-time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => setScheduledTime("Tomorrow at 8:45 AM (Peak)")}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" /> Peak Window
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
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={() => {
                toast({
                  title: "Schedule Confirmed",
                  description: `Post queued for ${scheduledTime} across ${selectedPlatforms.length} networks.`,
                });
                router.push("/dashboard");
              }}
            >
              <Send className="h-3.5 w-3.5" /> Confirm Schedule
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-7 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-emerald-600" />
              Pre-Schedule Platform Preview
            </CardTitle>
            <CardDescription className="text-xs">
              Compare how your scheduled post will appear on each social platform.
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
