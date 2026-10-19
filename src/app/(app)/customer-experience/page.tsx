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
  saveWorkspaceItemToFirestore,
  deleteWorkspaceItemFromFirestore,
} from "@/lib/firebase";
import {
  renderPlatformIcon,
  SocialNetwork,
} from "@/components/social/social-post-live-preview";
import {
  MessageSquareHeart,
  Sparkles,
  Send,
  UserPlus,
  CheckCircle2,
  RefreshCw,
  Cloud,
  Plus,
  Trash2,
} from "lucide-react";

interface InboxTicket {
  id: string;
  title: string;
  status: "Question" | "Urgent" | "Positive" | "Neutral";
  summary: string;
  primaryMetric: number; // Sentiment / Intent Score (0-100)
  secondaryMetric: number; // Estimated Pipeline Value ($)
  meta?: {
    network?: SocialNetwork;
    author?: string;
    handle?: string;
    sentiment?: string;
    replied?: boolean;
    replyText?: string;
    escalatedToCrm?: boolean;
    time?: string;
  };
}

export default function CustomerExperiencePage() {
  const { toast } = useToast();
  const { user: firebaseUser, cloudWorkspaceItems } = useFirebase();

  const [tickets, setTickets] = useState<InboxTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");

  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});
  const [generatingReplyId, setGeneratingReplyId] = useState<string | null>(
    null
  );
  const [escalatingId, setEscalatingId] = useState<string | null>(null);

  const [newAuthor, setNewAuthor] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [newNetwork, setNewNetwork] = useState<SocialNetwork>("linkedin");
  const [newSentiment, setNewSentiment] = useState<
    "Question" | "Urgent" | "Positive" | "Neutral"
  >("Question");
  const [newMessage, setNewMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadInbox = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspace-suites?suite=inbox");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setTickets(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load CX inbox:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const handleGenerateSmartReply = async (ticket: InboxTicket) => {
    setGeneratingReplyId(ticket.id);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "social",
          useBrandVoice: true,
          message: `Write a concise, helpful, Brand-Voice-aligned social media reply (under 240 characters) to ${
            ticket.meta?.author || ticket.title
          } on ${ticket.meta?.network || "LinkedIn"} who wrote: "${
            ticket.summary
          }". Include a direct link to https://visionai.studio/launch if helpful.`,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate AI smart reply");
      const data = await res.json();
      const reply = (data.content || data.message || "").trim();
      setDraftReplies((prev) => ({
        ...prev,
        [ticket.id]:
          reply ||
          `Hi ${
            ticket.meta?.author || "there"
          }! Yes—VisionAI Studio supports full multi-workspace OAuth, UTM tagging, and side-by-side fold previews across all 5 channels. Book a walkthrough at https://visionai.studio/launch`,
      }));
      toast({
        title: "Brand-Voice Smart Reply Drafted",
        description: "Review and click Send Reply to dispatch.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Smart Reply Error",
        description: err?.message || "Could not draft smart reply.",
      });
    } finally {
      setGeneratingReplyId(null);
    }
  };

  const handleSendReply = async (ticket: InboxTicket) => {
    const replyText = (draftReplies[ticket.id] || "").trim();
    if (!replyText) {
      toast({
        variant: "destructive",
        title: "Reply Empty",
        description: "Write or generate a smart reply before sending.",
      });
      return;
    }

    const updatedMeta = {
      ...(ticket.meta || {}),
      replied: true,
      replyText,
    };

    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, meta: updatedMeta } : t))
    );

    try {
      await fetch("/api/workspace-suites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ticket.id,
          meta: updatedMeta,
        }),
      });

      if (firebaseUser && firebaseUser.emailVerified) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${ticket.id}`,
          userId: firebaseUser.uid,
          suite: "inbox",
          title: ticket.title,
          status: ticket.status,
          summary: `${ticket.summary} [Replied: ${replyText.slice(0, 120)}]`.slice(
            0,
            2000
          ),
          primaryMetric: Number(ticket.primaryMetric) || 95,
          secondaryMetric: Number(ticket.secondaryMetric) || 25000,
        });
      }

      toast({
        title: "Reply Dispatched & Logged",
        description: `Sent response to ${ticket.meta?.author || ticket.title}.`,
      });
    } catch (err) {
      console.error("Failed to save reply:", err);
    }
  };

  const handleEscalateToCrm = async (ticket: InboxTicket) => {
    setEscalatingId(ticket.id);
    try {
      const crmRes = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "crm",
          title: `${ticket.meta?.author || ticket.title} (${
            ticket.meta?.handle || "Social Inbound"
          })`,
          status: "qualified",
          summary: `Escalated from ${
            ticket.meta?.network || "Social"
          } Inbox: "${ticket.summary}"`,
          primaryMetric: Number(ticket.secondaryMetric) || 36000,
          secondaryMetric: Number(ticket.primaryMetric) || 92,
          meta: {
            email: "inbound@enterprise-lead.io",
            segment: "enterprise",
            source: `${(ticket.meta?.network || "linkedin").toUpperCase()} Social Triage`,
          },
        }),
      });
      if (!crmRes.ok) throw new Error("Failed to create CRM lead");
      const { item: crmItem } = await crmRes.json();

      if (firebaseUser && firebaseUser.emailVerified && crmItem) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${crmItem.id}`,
          userId: firebaseUser.uid,
          suite: "crm",
          title: crmItem.title,
          status: crmItem.status,
          summary: crmItem.summary,
          primaryMetric: Number(crmItem.primaryMetric) || 36000,
          secondaryMetric: Number(crmItem.secondaryMetric) || 92,
        });
      }

      const updatedMeta = { ...(ticket.meta || {}), escalatedToCrm: true };
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, meta: updatedMeta } : t))
      );

      await fetch("/api/workspace-suites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ticket.id,
          meta: updatedMeta,
        }),
      });

      toast({
        title: "Escalated to CRM Pipeline",
        description: firebaseUser
          ? "Lead added to CRM Integration Suite and synced to Firestore /workspaceItems."
          : "Lead added to your CRM Integration Pipeline.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Escalation Error",
        description: err?.message || "Could not escalate to CRM.",
      });
    } finally {
      setEscalatingId(null);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "inbox",
          title: `${newAuthor.trim()} (${
            newHandle.trim() || "@prospect"
          }) — Inbound ${newSentiment}`,
          status: newSentiment,
          summary: newMessage.trim(),
          primaryMetric: newSentiment === "Urgent" ? 96 : 90,
          secondaryMetric: 32000,
          meta: {
            network: newNetwork,
            author: newAuthor.trim(),
            handle: newHandle.trim() || "@prospect",
            sentiment: newSentiment,
            replied: false,
            escalatedToCrm: false,
            time: "Just now",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to add social mention");
      const { item } = await res.json();
      setTickets((prev) => [item, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "inbox",
          title: item.title,
          status: item.status,
          summary: item.summary,
          primaryMetric: Number(item.primaryMetric) || 90,
          secondaryMetric: Number(item.secondaryMetric) || 32000,
        });
      }

      setNewAuthor("");
      setNewHandle("");
      setNewMessage("");
      toast({
        title: "Social Mention Logged",
        description: "Added to AI Triage Queue and synced to cloud.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Could not create mention.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/workspace-suites?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteWorkspaceItemFromFirestore(`${firebaseUser.uid}_${id}`);
      }
    } catch (err) {
      console.error("Failed to delete ticket:", err);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSentiment =
      sentimentFilter === "all" ||
      t.status.toLowerCase() === sentimentFilter.toLowerCase();
    const net = t.meta?.network || "linkedin";
    const matchesNetwork = networkFilter === "all" || net === networkFilter;
    return matchesSentiment && matchesNetwork;
  });

  const cloudInboxCount = cloudWorkspaceItems.filter(
    (i) => i.suite === "inbox"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Social Inbox, Sentiment Triage & CX Studio"
        description="Filter multi-network brand mentions by sentiment, draft Brand-Voice-aligned smart replies with Gemini AI, and escalate high-intent prospects to your CRM pipeline."
        icon={MessageSquareHeart}
      />

      {/* Top KPI Summary Bar */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">
              Active Social Mentions
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {tickets.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Across X, LinkedIn, Instagram, FB &amp; YouTube
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">
              High-Intent Questions &amp; Urgent
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums text-amber-500">
              {
                tickets.filter(
                  (t) => t.status === "Question" || t.status === "Urgent"
                ).length
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Priority SLA response queue
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">
              Attributed Social Pipeline
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums text-emerald-500">
              $
              {tickets
                .reduce((acc, t) => acc + (Number(t.secondaryMetric) || 0), 0)
                .toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            1-click escalatable to CRM Suite
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              Firestore Cloud Sync
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {firebaseUser ? `${cloudInboxCount} Synced` : "Local Ready"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Real-time /workspaceItems persistence
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Log Incoming Mention */}
        <Card className="lg:col-span-4 h-fit">
          <CardHeader>
            <CardTitle className="text-base">
              Ingest Brand Mention / CX Inquiry
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate or log an inbound customer question for AI triage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Author Name &amp; Company</Label>
                <Input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g., Priya Patel (CMO @ CloudScale)"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Handle</Label>
                  <Input
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="@priya_cmo"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Channel</Label>
                  <Select
                    value={newNetwork}
                    onValueChange={(v) => setNewNetwork(v as SocialNetwork)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">X / Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sentiment Classification</Label>
                <Select
                  value={newSentiment}
                  onValueChange={(v: any) => setNewSentiment(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Question">Question (High Intent)</SelectItem>
                    <SelectItem value="Urgent">Urgent SLA</SelectItem>
                    <SelectItem value="Positive">Positive Praise</SelectItem>
                    <SelectItem value="Neutral">Neutral Mention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Inbound Mention Copy</Label>
                <Textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Paste the customer's question or comment..."
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full gap-1.5 text-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {isCreating ? "Adding to Triage..." : "Add to Social Triage Queue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Filterable Triage Stream with AI Smart Replies & CRM Escalation */}
        <Card className="lg:col-span-8">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  Omnichannel Sentiment &amp; Response Stream
                </CardTitle>
                <CardDescription className="text-xs">
                  Generate Brand-Voice smart replies or escalate enterprise leads to CRM in 1 click.
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {["all", "Question", "Urgent", "Positive"].map((sent) => (
                  <button
                    key={sent}
                    type="button"
                    onClick={() => setSentimentFilter(sent)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      sentimentFilter === sent
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sent === "all" ? "All Sentiments" : sent}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {(
                [
                  "all",
                  "linkedin",
                  "twitter",
                  "instagram",
                  "facebook",
                  "youtube",
                ] as const
              ).map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetworkFilter(net)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                    networkFilter === net
                      ? "border-foreground bg-foreground text-background font-medium"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {net !== "all" &&
                    renderPlatformIcon(net as SocialNetwork, "h-3 w-3")}
                  <span className="capitalize">
                    {net === "all" ? "All Networks" : net}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {isLoading ? (
              <p className="text-xs text-muted-foreground py-8 text-center">
                Loading social triage inbox...
              </p>
            ) : filteredTickets.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">
                No mentions match the active filter.
              </p>
            ) : (
              filteredTickets.map((ticket) => {
                const net = (ticket.meta?.network || "linkedin") as SocialNetwork;
                const isReplied = Boolean(ticket.meta?.replied);
                const isEscalated = Boolean(ticket.meta?.escalatedToCrm);
                const currentDraft =
                  draftReplies[ticket.id] ?? ticket.meta?.replyText ?? "";

                return (
                  <div
                    key={ticket.id}
                    className="rounded-lg border p-4 space-y-3 bg-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {renderPlatformIcon(net, "h-4 w-4")}
                          <span className="text-sm font-semibold">
                            {ticket.title}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            · {ticket.meta?.time || "Recent"} · Sentiment:{" "}
                            <strong
                              className={
                                ticket.status === "Urgent"
                                  ? "text-amber-500"
                                  : ticket.status === "Positive"
                                  ? "text-emerald-500"
                                  : "text-primary"
                              }
                            >
                              {ticket.status}
                            </strong>{" "}
                            · Est. Value: $
                            {(Number(ticket.secondaryMetric) || 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/90">
                          &ldquo;{ticket.summary}&rdquo;
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                        aria-label="Delete mention"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Smart Reply & CRM Escalation Controls */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={generatingReplyId === ticket.id}
                            onClick={() => handleGenerateSmartReply(ticket)}
                            className="h-7 text-xs gap-1.5 cursor-pointer"
                          >
                            {generatingReplyId === ticket.id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Sparkles className="h-3 w-3 text-primary" />
                            )}
                            AI Brand-Voice Smart Reply
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isEscalated || escalatingId === ticket.id}
                            onClick={() => handleEscalateToCrm(ticket)}
                            className="h-7 text-xs gap-1.5 cursor-pointer"
                          >
                            {isEscalated ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                In CRM Pipeline
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3" />
                                Escalate to CRM
                              </>
                            )}
                          </Button>
                        </div>

                        {isReplied && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Replied
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={currentDraft}
                          onChange={(e) =>
                            setDraftReplies((prev) => ({
                              ...prev,
                              [ticket.id]: e.target.value,
                            }))
                          }
                          placeholder="Click 'AI Brand-Voice Smart Reply' or type your response..."
                          className="text-xs h-8 flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSendReply(ticket)}
                          className="h-8 text-xs gap-1.5 cursor-pointer shrink-0"
                        >
                          <Send className="h-3 w-3" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
