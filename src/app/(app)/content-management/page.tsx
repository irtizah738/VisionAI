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
  FileText,
  Plus,
  Sparkles,
  Trash2,
  CheckCircle2,
  Clock,
  Cloud,
  Send,
  RefreshCw,
} from "lucide-react";

interface ContentSuiteItem {
  id: string;
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
  meta?: {
    type?: string;
    author?: string;
    channel?: string;
  };
}

export default function ContentManagementPage() {
  const { toast } = useToast();
  const { user: firebaseUser, cloudWorkspaceItems } = useFirebase();

  const [items, setItems] = useState<ContentSuiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [status, setStatus] = useState("published");
  const [summary, setSummary] = useState("");
  const [views, setViews] = useState("12400");
  const [engagementRate, setEngagementRate] = useState("6.2");

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspace-suites?suite=content");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load content suite items:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleGenerateBriefWithAI = async () => {
    const topicSeed =
      title.trim() || "2026 Omnichannel Social Attribution & Fold Optimization";
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "content",
          useBrandVoice: true,
          message: `Write a concise 2-sentence executive content brief and distribution summary for a ${contentType} asset titled "${topicSeed}".`,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate AI brief");
      const data = await res.json();
      if (!title.trim()) {
        setTitle(topicSeed);
      }
      setSummary((data.content || data.message || "").slice(0, 600));
      toast({
        title: "AI Content Brief Synthesized",
        description: "Generated with Brand Voice Memory via @google/genai.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Brief Error",
        description: error?.message || "Could not generate brief.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "content",
          title: title.trim(),
          status,
          summary:
            summary.trim() ||
            "Omnichannel editorial asset aligned with Brand Voice Memory.",
          primaryMetric: Number(views) || 0,
          secondaryMetric: Number(engagementRate) || 0,
          meta: {
            type: contentType,
            author: firebaseUser?.displayName || "Alex Morgan",
            channel:
              contentType === "video"
                ? "YouTube & Reels"
                : contentType === "social"
                ? "LinkedIn & X"
                : "Executive Blog",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save content asset");
      const { item } = await res.json();
      setItems((prev) => [item, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "content",
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
        title: "Content Asset Saved",
        description: firebaseUser
          ? "Persisted to workspace store and synced to Firestore /workspaceItems."
          : "Persisted to workspace store.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: error?.message || "Could not save content asset.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (item: ContentSuiteItem) => {
    const nextStatus =
      item.status === "published" ? "scheduled" : "published";
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
    );
    try {
      await fetch("/api/workspace-suites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "content",
          title: item.title,
          status: nextStatus,
          summary: item.summary,
          primaryMetric: item.primaryMetric,
          secondaryMetric: item.secondaryMetric,
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/workspace-suites?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteWorkspaceItemFromFirestore(`${firebaseUser.uid}_${id}`);
      }
      toast({
        title: "Asset Removed",
        description: "Deleted from Content Management repository.",
      });
    } catch (err) {
      console.error("Failed to delete content item:", err);
    }
  };

  const cloudContentCount = cloudWorkspaceItems.filter(
    (i) => i.suite === "content"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Omnichannel Content Repository & Lifecycle Hub"
        description="Manage editorial articles, video cutdowns, and social campaign assets with Brand Voice Memory and live Firestore persistence."
        icon={FileText}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Total Active Assets</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {items.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Blog, Video, and Multi-Network Packs
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Total Content Reach</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {items
                .reduce((acc, i) => acc + (Number(i.primaryMetric) || 0), 0)
                .toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-emerald-500 font-mono">
            Avg Engagement:{" "}
            {items.length
              ? (
                  items.reduce(
                    (acc, i) => acc + (Number(i.secondaryMetric) || 0),
                    0
                  ) / items.length
                ).toFixed(1)
              : "0.0"}
            %
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              Firestore Cloud Sync
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {firebaseUser ? `${cloudContentCount} Synced` : "Local Ready"}
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
              <CardTitle className="text-base">Create Content Asset</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateBriefWithAI}
                disabled={isGeneratingAI}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                )}
                AI Brief Generator
              </Button>
            </div>
            <CardDescription className="text-xs">
              Add a new editorial or social content pack to your persistent repository.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateItem} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="cm-title" className="text-xs">
                  Asset Title
                </Label>
                <Input
                  id="cm-title"
                  placeholder="e.g. 2026 B2B LinkedIn Fold Truncation Study"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cm-type" className="text-xs">
                    Format
                  </Label>
                  <select
                    id="cm-type"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full h-8 text-xs border border-border rounded px-2 bg-background"
                  >
                    <option value="blog">Executive Blog</option>
                    <option value="social">Social Thread Pack</option>
                    <option value="video">Video / Shorts</option>
                    <option value="email">Newsletter Sequence</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cm-status" className="text-xs">
                    Lifecycle Status
                  </Label>
                  <select
                    id="cm-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-8 text-xs border border-border rounded px-2 bg-background"
                  >
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cm-summary" className="text-xs">
                  Executive Summary &amp; Distribution Notes
                </Label>
                <Textarea
                  id="cm-summary"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe key hooks, target personas, and distribution channels..."
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cm-views" className="text-xs">
                    Projected / Live Views
                  </Label>
                  <Input
                    id="cm-views"
                    type="number"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cm-eng" className="text-xs">
                    Engagement Rate (%)
                  </Label>
                  <Input
                    id="cm-eng"
                    type="number"
                    step="0.1"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
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
                {isCreating ? "Saving Asset..." : "Save to Repository & Firestore"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Persistent Content Inventory</CardTitle>
            <CardDescription className="text-xs">
              Click status badges to toggle lifecycle state or dispatch directly to Social Streams.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Loading content inventory...
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No content assets yet. Create one using the form on the left.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {item.meta?.channel || "Omnichannel"} · Author:{" "}
                        {item.meta?.author || "Alex Morgan"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        onClick={() => handleToggleStatus(item)}
                        className={`cursor-pointer capitalize ${
                          item.status === "published"
                            ? "border-emerald-500/40 text-emerald-500"
                            : "border-amber-500/40 text-amber-500"
                        }`}
                      >
                        {item.status === "published" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {item.status}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 font-mono text-[11px]">
                    <div className="flex items-center gap-4">
                      <span>
                        Reach:{" "}
                        <strong className="text-foreground">
                          {Number(item.primaryMetric).toLocaleString()}
                        </strong>
                      </span>
                      <span>
                        Engagement:{" "}
                        <strong className="text-emerald-500">
                          {item.secondaryMetric}%
                        </strong>
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px] gap-1 cursor-pointer"
                      onClick={async () => {
                        await fetch("/api/posts", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            content: `${item.title}\n\n${item.summary}\n\nRead more: https://visionai.studio/launch #ContentMarketing #VisionAI`,
                            network: "linkedin",
                            platforms: ["linkedin", "twitter"],
                            status: "scheduled",
                            scheduledTime: "Thu, Oct 22 at 9:00 AM",
                            dateKey: "2026-10-22",
                          }),
                        });
                        toast({
                          title: "Queued to Social Planner",
                          description: `"${item.title}" scheduled for LinkedIn & X.`,
                        });
                      }}
                    >
                      <Send className="h-3 w-3" /> Send to Planner
                    </Button>
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
