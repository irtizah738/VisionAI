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
  Users,
  Plus,
  Sparkles,
  Trash2,
  Cloud,
  RefreshCw,
  Building2,
} from "lucide-react";

interface CrmSuiteItem {
  id: string;
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
  meta?: {
    email?: string;
    segment?: string;
    source?: string;
  };
}

export default function CrmIntegrationPage() {
  const { toast } = useToast();
  const { user: firebaseUser, cloudWorkspaceItems } = useFirebase();

  const [contacts, setContacts] = useState<CrmSuiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [companyAndContact, setCompanyAndContact] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("qualified");
  const [ltv, setLtv] = useState("36000");
  const [intentScore, setIntentScore] = useState("89");
  const [notes, setNotes] = useState("");

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspace-suites?suite=crm");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setContacts(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load CRM contacts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleGeneratePlaybook = async () => {
    const target = companyAndContact.trim() || "Enterprise SaaS Account";
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "general",
          useBrandVoice: true,
          message: `Write a 2-sentence account-based marketing (ABM) social + email outreach playbook for "${target}" in the "${stage}" pipeline stage.`,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate ABM playbook");
      const data = await res.json();
      if (!companyAndContact.trim()) {
        setCompanyAndContact("Apex Cloud Systems (Sarah Jenkins - CMO)");
      }
      setNotes((data.content || data.message || "").slice(0, 600));
      toast({
        title: "AI ABM Playbook Generated",
        description: "Tailored using your workspace Brand Voice Memory.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: err?.message || "Could not generate ABM playbook.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyAndContact.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "crm",
          title: companyAndContact.trim(),
          status: stage,
          summary:
            notes.trim() ||
            "Multi-touch attribution lead captured via LinkedIn & X social stream.",
          primaryMetric: Number(ltv) || 25000,
          secondaryMetric: Number(intentScore) || 85,
          meta: {
            email: email.trim() || "contact@enterprise.io",
            segment: "enterprise",
            source: "Social Command Center",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save CRM account");
      const { item } = await res.json();
      setContacts((prev) => [item, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "crm",
          title: item.title,
          status: item.status,
          summary: item.summary,
          primaryMetric: Number(item.primaryMetric) || 0,
          secondaryMetric: Number(item.secondaryMetric) || 0,
        });
      }

      setCompanyAndContact("");
      setEmail("");
      setNotes("");
      toast({
        title: "CRM Account Synced",
        description: firebaseUser
          ? "Saved locally and synced to Firestore /workspaceItems."
          : "Saved to CRM pipeline store.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "CRM Error",
        description: err?.message || "Could not save CRM account.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/workspace-suites?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteWorkspaceItemFromFirestore(`${firebaseUser.uid}_${id}`);
      }
      toast({
        title: "Account Removed",
        description: "Removed from CRM attribution pipeline.",
      });
    } catch (err) {
      console.error("Failed to delete CRM record:", err);
    }
  };

  const totalPipelineLtv = contacts.reduce(
    (acc, c) => acc + (Number(c.primaryMetric) || 0),
    0
  );
  const cloudCrmCount = cloudWorkspaceItems.filter(
    (i) => i.suite === "crm"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM Pipeline Attribution & Social Lead Intelligence"
        description="Track enterprise accounts, social-attributed deal velocity, and AI ABM outreach playbooks with live Firestore persistence."
        icon={Users}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Total Attributed Pipeline</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums text-emerald-500">
              ${totalPipelineLtv.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Across {contacts.length} active enterprise accounts
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Mean Buyer Intent Score</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {contacts.length
                ? Math.round(
                    contacts.reduce(
                      (acc, c) => acc + (Number(c.secondaryMetric) || 0),
                      0
                    ) / contacts.length
                  )
                : 90}{" "}
              / 100
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Based on social link card &amp; thread interactions
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              Firestore Cloud Sync
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {firebaseUser ? `${cloudCrmCount} Synced` : "Local Ready"}
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
              <CardTitle className="text-base">Add Attributed Account</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeneratePlaybook}
                disabled={isGeneratingAI}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                )}
                AI ABM Playbook
              </Button>
            </div>
            <CardDescription className="text-xs">
              Log a social-attributed prospect or enterprise customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateContact} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="crm-name" className="text-xs">
                  Account &amp; Decision Maker
                </Label>
                <Input
                  id="crm-name"
                  placeholder="e.g. FinScale Enterprise (Marcus Vance - VP)"
                  value={companyAndContact}
                  onChange={(e) => setCompanyAndContact(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="crm-email" className="text-xs">
                    Contact Email
                  </Label>
                  <Input
                    id="crm-email"
                    type="email"
                    placeholder="vp@company.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="crm-stage" className="text-xs">
                    Pipeline Stage
                  </Label>
                  <select
                    id="crm-stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full h-8 text-xs border border-border rounded px-2 bg-background"
                  >
                    <option value="lead">Inbound Social Lead</option>
                    <option value="qualified">Sales Qualified (SQL)</option>
                    <option value="customer">Active Customer</option>
                    <option value="vip">Enterprise VIP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="crm-ltv" className="text-xs">
                    Annual Contract Value ($)
                  </Label>
                  <Input
                    id="crm-ltv"
                    type="number"
                    value={ltv}
                    onChange={(e) => setLtv(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="crm-score" className="text-xs">
                    Intent Score (1–100)
                  </Label>
                  <Input
                    id="crm-score"
                    type="number"
                    value={intentScore}
                    onChange={(e) => setIntentScore(e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crm-notes" className="text-xs">
                  Attribution Touchpoints &amp; ABM Playbook
                </Label>
                <Textarea
                  id="crm-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating || !companyAndContact.trim()}
                className="w-full h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {isCreating ? "Saving..." : "Save Account & Sync to Firestore"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Attributed CRM Accounts</CardTitle>
            <CardDescription className="text-xs">
              Real-time pipeline records persisted across local store and Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Loading CRM accounts...
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-lg border border-border bg-card space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {contact.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {contact.meta?.email || "enterprise@account.io"} ·{" "}
                          {contact.meta?.source || "LinkedIn Organic"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {contact.status}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {contact.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 font-mono text-[11px]">
                    <span>
                      ACV / LTV:{" "}
                      <strong className="text-emerald-500">
                        ${Number(contact.primaryMetric).toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      Intent Score:{" "}
                      <strong className="text-foreground">
                        {contact.secondaryMetric}/100
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
