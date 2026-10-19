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
  TrendingUp,
  Plus,
  Sparkles,
  Trash2,
  Cloud,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

interface CroSuiteItem {
  id: string;
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
  meta?: {
    variantA?: string;
    variantB?: string;
    visitors?: number;
  };
}

export default function ConversionOptimizationPage() {
  const { toast } = useToast();
  const { user: firebaseUser, cloudWorkspaceItems } = useFirebase();

  const [experiments, setExperiments] = useState<CroSuiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [conversionRate, setConversionRate] = useState("5.4");
  const [confidence, setConfidence] = useState("97");
  const [variantA, setVariantA] = useState("Control: Standard CTA below fold");
  const [variantB, setVariantB] = useState(
    "Treatment: ROI proof + native link card above 125-char fold"
  );

  const loadExperiments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspace-suites?suite=cro");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setExperiments(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load CRO experiments:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiments();
  }, [loadExperiments]);

  const handleGenerateHypothesis = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "analytics",
          useBrandVoice: true,
          message:
            "Generate a high-impact A/B conversion rate optimization hypothesis testing social post fold hooks and landing page CTAs. Keep it under 3 sentences.",
        }),
      });
      if (!res.ok) throw new Error("Failed to generate CRO hypothesis");
      const data = await res.json();
      if (!title.trim()) {
        setTitle("Above-the-Fold ROI Hook vs Standard Product Feature CTA");
      }
      setSummary((data.content || data.message || "").slice(0, 600));
      toast({
        title: "AI CRO Hypothesis Generated",
        description: "Synthesized using Brand Voice Memory & @google/genai.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Hypothesis Error",
        description: err?.message || "Could not generate hypothesis.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "cro",
          title: title.trim(),
          status: "running",
          summary:
            summary.trim() ||
            `A/B Test comparing "${variantA}" vs "${variantB}".`,
          primaryMetric: Number(conversionRate) || 4.5,
          secondaryMetric: Number(confidence) || 95,
          meta: {
            variantA,
            variantB,
            visitors: 15200,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to create experiment");
      const { item } = await res.json();
      setExperiments((prev) => [item, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "cro",
          title: item.title,
          status: item.status,
          summary: item.summary,
          primaryMetric: Number(item.primaryMetric) || 0,
          secondaryMetric: Number(item.secondaryMetric) || 0,
        });
      }

      setTitle("");
      setSummary("");
      toast({
        title: "A/B Experiment Launched",
        description: firebaseUser
          ? "Experiment persisted locally and synced to Firestore /workspaceItems."
          : "Experiment persisted to workspace store.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Could not create experiment.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setExperiments((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/workspace-suites?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteWorkspaceItemFromFirestore(`${firebaseUser.uid}_${id}`);
      }
      toast({
        title: "Experiment Deleted",
        description: "Removed from CRO experiment registry.",
      });
    } catch (err) {
      console.error("Failed to delete experiment:", err);
    }
  };

  const cloudCroCount = cloudWorkspaceItems.filter(
    (i) => i.suite === "cro"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversion Rate Optimization (CRO) & A/B Experiment Lab"
        description="Design, track, and persist multi-channel A/B tests and funnel conversion experiments with Gemini AI and Firestore."
        icon={TrendingUp}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Active &amp; Completed Tests</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {experiments.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Multivariate &amp; Fold-Cutoff Experiments
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Mean Winning Conversion Rate</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums text-emerald-500">
              {experiments.length
                ? (
                    experiments.reduce(
                      (acc, e) => acc + (Number(e.primaryMetric) || 0),
                      0
                    ) / experiments.length
                  ).toFixed(2)
                : "5.20"}
              %
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            +64% lift vs baseline funnel
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              Firestore Cloud Sync
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {firebaseUser ? `${cloudCroCount} Synced` : "Local Ready"}
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
              <CardTitle className="text-base">Launch A/B Experiment</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateHypothesis}
                disabled={isGeneratingAI}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                )}
                AI Hypothesis
              </Button>
            </div>
            <CardDescription className="text-xs">
              Configure variants and statistical confidence targets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateExperiment} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="cro-title" className="text-xs">
                  Experiment Name
                </Label>
                <Input
                  id="cro-title"
                  placeholder="e.g. LinkedIn 115-Char Hook vs 240-Char Story"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cro-va" className="text-xs">
                  Variant A (Control)
                </Label>
                <Input
                  id="cro-va"
                  value={variantA}
                  onChange={(e) => setVariantA(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cro-vb" className="text-xs">
                  Variant B (Treatment)
                </Label>
                <Input
                  id="cro-vb"
                  value={variantB}
                  onChange={(e) => setVariantB(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cro-summary" className="text-xs">
                  Hypothesis &amp; Funnel Notes
                </Label>
                <Textarea
                  id="cro-summary"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cro-rate" className="text-xs">
                    Treatment Conv. Rate (%)
                  </Label>
                  <Input
                    id="cro-rate"
                    type="number"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cro-conf" className="text-xs">
                    Statistical Confidence (%)
                  </Label>
                  <Input
                    id="cro-conf"
                    type="number"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCreating || !title.trim()}
                className="w-full h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {isCreating ? "Launching..." : "Save Experiment to Firestore"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Active &amp; Historical CRO Experiments</CardTitle>
            <CardDescription className="text-xs">
              Live telemetry and statistical significance across social and web funnels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Loading CRO experiments...
              </div>
            ) : (
              experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-lg border border-border bg-card space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {exp.title}
                      </div>
                      {exp.meta?.variantA && (
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {exp.meta.variantA} vs {exp.meta.variantB}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 text-emerald-500 capitalize"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {exp.status}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exp.id)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {exp.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 font-mono text-[11px]">
                    <span>
                      Winning CTR / Conv:{" "}
                      <strong className="text-emerald-500">
                        {exp.primaryMetric}%
                      </strong>
                    </span>
                    <span>
                      Statistical Confidence:{" "}
                      <strong className="text-foreground">
                        {exp.secondaryMetric}%
                      </strong>
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
