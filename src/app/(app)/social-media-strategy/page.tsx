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
import { useToast } from "@/hooks/use-toast";
import {
  Lightbulb,
  Sparkles,
  Calendar,
  Target,
  Send,
  RefreshCw,
  Layers,
} from "lucide-react";

export default function SocialMediaStrategyPage() {
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("VisionAI Studio");
  const [industry, setIndustry] = useState("B2B Marketing & Social Suite SaaS");
  const [goals, setGoals] = useState(
    "Grow qualified demo pipeline by 35% and increase multi-network engagement across X, LinkedIn, Instagram, Facebook & YouTube"
  );
  const [audience, setAudience] = useState(
    "VP of Marketing, Growth Directors, and Social Media Managers"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [queuingDay, setQueuingDay] = useState<string | null>(null);

  const [strategy, setStrategy] = useState({
    executiveSummary:
      "Focus on high-retention native formats that front-load value above platform truncation cutoffs across LinkedIn, X, Instagram, Facebook, and YouTube. Pair executive thought leadership on LinkedIn with rapid visual proof points on X and Instagram.",
    contentPillars: [
      {
        title: "Data-Backed Fold & Truncation Teardowns",
        description:
          "Show side-by-side comparisons of posts that lose CTAs below '...more' vs. fold-optimized hooks.",
        channels: ["LinkedIn", "X / Twitter"],
        cadence: "3x / week",
      },
      {
        title: "60-Second Command Center Walkthroughs",
        description:
          "Short visual reels and YouTube explainers demonstrating unified stream monitoring and instant scheduling.",
        channels: ["Instagram", "YouTube"],
        cadence: "2x / week",
      },
      {
        title: "Customer ROI & Pipeline Case Studies",
        description:
          "Quantified customer stories with direct OG link cards driving traffic to benchmark reports.",
        channels: ["LinkedIn", "Facebook", "X / Twitter"],
        cadence: "2x / week",
      },
    ],
    weeklySchedule: [
      {
        day: "Monday",
        network: "linkedin",
        format: "Executive Carousel",
        hookIdea:
          "We audited 500 B2B social posts. 68% buried their primary link below the 210-character LinkedIn cutoff. Here is the fix:",
        bestTime: "9:00 AM EST",
      },
      {
        day: "Tuesday",
        network: "twitter",
        format: "Insight Thread",
        hookIdea:
          "Why previewing X, LinkedIn, Instagram, Facebook & YouTube side-by-side before scheduling saves 6+ hours every week:",
        bestTime: "11:30 AM EST",
      },
      {
        day: "Wednesday",
        network: "instagram",
        format: "4:5 Visual Cheat Sheet",
        hookIdea:
          "The 2026 Character Truncation Cheat Sheet for Every Social Network ✨ Save this before your next launch!",
        bestTime: "1:00 PM EST",
      },
      {
        day: "Thursday",
        network: "youtube",
        format: "16:9 Product Deep-Dive",
        hookIdea:
          "Full Walkthrough: Building a High-Velocity Social Command Center in 2026",
        bestTime: "3:00 PM EST",
      },
      {
        day: "Friday",
        network: "facebook",
        format: "Link Card + Community Poll",
        hookIdea:
          "Which social channel drove your highest conversion rate this quarter? See our latest benchmark report:",
        bestTime: "10:30 AM EST",
      },
    ],
    kpis: [
      {
        metric: "Above-the-Fold Hook CTR",
        target: "+35% Lift",
        rationale: "Prevents key links from hiding behind '...more'.",
      },
      {
        metric: "Multi-Network Engagement Rate",
        target: "4.8% Avg.",
        rationale: "Native aspect ratios outperform generic cross-posting.",
      },
      {
        metric: "Social-Attributed Demos",
        target: "+28% QoQ",
        rationale: "Direct OG link cards on LinkedIn & X drive high-intent clicks.",
      },
      {
        metric: "Unified Inbox Response Time",
        target: "< 30 mins",
        rationale: "Fast mention replies amplify algorithmic distribution.",
      },
    ],
  });

  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          industry,
          goals,
          audience,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate strategy");
      const data = await res.json();
      setStrategy(data);
      toast({
        title: "Omnichannel Strategy Generated",
        description:
          "Updated content pillars, 5-day publishing cadence, and KPI targets with Gemini AI.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Strategy Error",
        description: error?.message || "Could not generate strategy.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQueueScheduleSlot = async (slot: {
    day: string;
    network: string;
    hookIdea: string;
    bestTime: string;
  }) => {
    setQueuingDay(slot.day);
    try {
      const netLower = slot.network.toLowerCase();
      const mappedNet = netLower.includes("linkedin")
        ? "linkedin"
        : netLower.includes("instagram")
        ? "instagram"
        : netLower.includes("facebook")
        ? "facebook"
        : netLower.includes("youtube")
        ? "youtube"
        : "twitter";

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `${slot.hookIdea} https://visionai.studio/strategy #SocialStrategy #MarketingAI`,
          network: mappedNet,
          platforms: [mappedNet],
          status: "scheduled",
          scheduledTime: `${slot.day}, ${slot.bestTime}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to queue post");
      toast({
        title: `Queued for ${slot.day} (${slot.bestTime})`,
        description: `Added "${slot.hookIdea.slice(0, 48)}..." to your Streams & Planner queue.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Queue Failed",
        description: error?.message || "Could not schedule slot.",
      });
    } finally {
      setQueuingDay(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Social Media Strategy & Cadence Architect"
        description="Generate data-backed content pillars, channel-specific hook ideas, and 1-click queue your weekly calendar."
        icon={Lightbulb}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4 h-fit">
          <form onSubmit={handleGenerateStrategy}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Strategy Brief
              </CardTitle>
              <CardDescription>
                Powered by server-side Gemini 3.8 Flash.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand / Product Name</Label>
                <Input
                  id="brand"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry / Category</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Primary Quarterly Goals</Label>
                <Textarea
                  id="goals"
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                />
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
                    Building Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Omnichannel Playbook
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Executive Strategy Summary</CardTitle>
              <CardDescription>{strategy.executiveSummary}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {strategy.contentPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/20 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[11px]">
                      Pillar {idx + 1}
                    </Badge>
                    <span className="text-xs font-medium text-primary">
                      {pillar.cadence}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">{pillar.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {pillar.channels.map((ch, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {ch}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Recommended Weekly Publishing Cadence
              </CardTitle>
              <CardDescription>
                Click &ldquo;Queue Slot&rdquo; on any day to send the hook directly into your Streams &amp; Planner Command Center.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {strategy.weeklySchedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge>{slot.day}</Badge>
                      <Badge variant="outline">{slot.network}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {slot.format} • {slot.bestTime}
                      </span>
                    </div>
                    <p className="text-sm font-medium pt-1">{slot.hookIdea}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={queuingDay === slot.day}
                    onClick={() => handleQueueScheduleSlot(slot)}
                    className="shrink-0 gap-1.5 text-xs cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {queuingDay === slot.day ? "Queuing..." : "Queue Slot"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Target KPIs &amp; Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {strategy.kpis.map((kpi, idx) => (
                <div key={idx} className="rounded-lg border p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {kpi.metric}
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                      {kpi.target}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{kpi.rationale}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
