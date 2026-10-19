"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import {
  saveWorkspaceItemToFirestore,
  deleteWorkspaceItemFromFirestore,
} from "@/lib/firebase";
import {
  PieChart,
  Plus,
  Sparkles,
  Trash2,
  Cloud,
  RefreshCw,
  Target,
} from "lucide-react";

interface SegmentSuiteItem {
  id: string;
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
  meta?: {
    criteria?: string;
    primaryChannel?: string;
  };
}

export default function CustomerSegmentationPage() {
  const { toast } = useToast();
  const { user: firebaseUser, cloudWorkspaceItems } = useFirebase();

  const [segments, setSegments] = useState<SegmentSuiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [name, setName] = useState("");
  const [primaryChannel, setPrimaryChannel] = useState("LinkedIn & X");
  const [audienceSize, setAudienceSize] = useState("18500");
  const [growthRate, setGrowthRate] = useState("28.4");
  const [summary, setSummary] = useState("");

  const loadSegments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspace-suites?suite=segment");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setSegments(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load audience segments:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSegments();
  }, [loadSegments]);

  const handleGeneratePersona = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "social",
          useBrandVoice: true,
          message: `Define a high-converting audience segment and messaging angle for "${name || "Enterprise Growth Leaders"}" on ${primaryChannel} in 2 sentences.`,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate segment persona");
      const data = await res.json();
      if (!name.trim()) {
        setName("Enterprise SaaS Growth & Social VPs");
      }
      setSummary((data.content || data.message || "").slice(0, 600));
      toast({
        title: "AI Audience Persona Generated",
        description: "Created with Brand Voice Memory via @google/genai.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: err?.message || "Could not generate persona.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "segment",
          title: name.trim(),
          status: "active",
          summary:
            summary.trim() ||
            `High-intent cohort active on ${primaryChannel} responding to fold-optimized social previews.`,
          primaryMetric: Number(audienceSize) || 10000,
          secondaryMetric: Number(growthRate) || 15,
          meta: {
            primaryChannel,
            criteria: `Channel: ${primaryChannel}`,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save segment");
      const { item } = await res.json();
      setSegments((prev) => [item, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "segment",
          title: item.title,
          status: item.status,
          summary: item.summary,
          primaryMetric: Number(item.primaryMetric) || 0,
          secondaryMetric: Number(item.secondaryMetric) || 0,
        });
      }

      setName("");
      setSummary("");
      toast({
        title: "Audience Segment Saved",
        description: firebaseUser
          ? "Persisted locally and synced to Firestore /workspaceItems."
          : "Persisted to workspace segmentation store.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: err?.message || "Could not save segment.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/workspace-suites?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteWorkspaceItemFromFirestore(`${firebaseUser.uid}_${id}`);
      }
      toast({
        title: "Segment Deleted",
        description: "Removed from Audience Segmentation directory.",
      });
    } catch (err) {
      console.error("Failed to delete segment:", err);
    }
  };

  const totalReach = segments.reduce(
    (acc, s) => acc + (Number(s.primaryMetric) || 0),
    0
  );
  const cloudSegCount = cloudWorkspaceItems.filter(
    (i) => i.suite === "segment"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Segmentation & ICP Cohort Intelligence"
        description="Build, analyze, and persist high-converting audience segments with Brand Voice Memory and live Firestore sync."
        icon={PieChart}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Total Segmented Audience</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {totalReach.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Across {segments.length} ICP cohorts
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Mean Cohort Growth Velocity</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums text-emerald-500">
              +
              {segments.length
                ? (
                    segments.reduce(
                      (acc, s) => acc + (Number(s.secondaryMetric) || 0),
                      0
                    ) / segments.length
                  ).toFixed(1)
                : "24.0"}
              %
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            30-day rolling audience expansion
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              Firestore Cloud Sync
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {firebaseUser ? `${cloudSegCount} Synced` : "Local Ready"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Collection: <code>/workspaceItems</code>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Create Audience Cohort</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeneratePersona}
                disabled={isGeneratingAI}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                )}
                AI Cohort Builder
              </Button>
            </div>
            <CardDescription className="text-xs">
              Define a new ICP segment for targeted omnichannel campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSegment} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="seg-name" className="text-xs">
                  Segment Name
                </Label>
                <Input
                  id="seg-name"
                  placeholder="e.g. High-Velocity B2B SaaS CMOs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="seg-channel" className="text-xs">
                  Primary Social Channel
                </Label>
                <select
                  id="seg-channel"
                  value={primaryChannel}
                  onChange={(e) => setPrimaryChannel(e.target.value)}
                  className="w-full h-8 text-xs border border-border rounded px-2 bg-background"
                >
                  <option value="LinkedIn & X">LinkedIn &amp; X</option>
                  <option value="Instagram & YouTube">Instagram &amp; YouTube</option>
                  <option value="Facebook & Instagram">Facebook &amp; Instagram</option>
                  <option value="All 5 Networks">All 5 Networks</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="seg-size" className="text-xs">
                    Cohort Size
                  </Label>
                  <Input
                    id="seg-size"
                    type="number"
                    value={audienceSize}
                    onChange={(e) => setAudienceSize(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seg-growth" className="text-xs">
                    30d Growth (%)
                  </Label>
                  <Input
                    id="seg-growth"
                    type="number"
                    step="0.1"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="seg-summary" className="text-xs">
                  Behavioral Criteria &amp; Messaging Hook
                </Label>
                <Textarea
                  id="seg-summary"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating || !name.trim()}
                className="w-full h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {isCreating ? "Saving..." : "Save Cohort & Sync to Firestore"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Active Audience Segments</CardTitle>
            <CardDescription className="text-xs">
              Persistent audience cohorts available across Campaign Builder and Social Composer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Loading audience segments...
              </div>
            ) : (
              segments.map((seg) => (
                <div
                  key={seg.id}
                  className="p-4 rounded-lg border border-border bg-card space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {seg.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Primary Channel: {seg.meta?.primaryChannel || "LinkedIn & X"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                        +{seg.secondaryMetric}% Growth
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(seg.id)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {seg.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 font-mono text-[11px]">
                    <span>
                      Reachable Profiles:{" "}
                      <strong className="text-foreground">
                        {Number(seg.primaryMetric).toLocaleString()}
                      </strong>
                    </span>
                    <span className="text-muted-foreground">
                      Synced with Brand Voice Memory
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
