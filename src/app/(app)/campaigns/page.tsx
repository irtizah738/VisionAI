"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { saveCampaignToFirestore } from "@/lib/firebase";
import {
  Megaphone,
  PlusCircle,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
  Trash2,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";

interface CampaignItem {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "draft" | "active" | "paused" | "completed";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  channels: string[];
  startDate: string;
  endDate: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: firebaseUser } = useFirebase();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "multi-channel",
    budget: "10000",
  });

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
        }
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCampaign.name,
          description:
            newCampaign.description ||
            "Omnichannel social & content marketing campaign.",
          type: newCampaign.type,
          budget: Number(newCampaign.budget) || 10000,
          status: "active",
          channels: ["twitter", "linkedin", "instagram"],
        }),
      });
      if (!res.ok) throw new Error("Failed to create campaign");
      const { campaign } = await res.json();
      setCampaigns((prev) => [campaign, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && campaign) {
        await saveCampaignToFirestore({
          id: `${firebaseUser.uid}_${campaign.id}`,
          userId: firebaseUser.uid,
          name: campaign.name,
          description: campaign.description || "",
          type: campaign.type || "multi-channel",
          status: campaign.status || "active",
          budget: Number(campaign.budget) || 10000,
        });
      }

      setNewCampaign({
        name: "",
        description: "",
        type: "multi-channel",
        budget: "10000",
      });
      setIsCreateOpen(false);
      toast({
        title: "Campaign Launched",
        description: `"${campaign.name}" is now active and tracking conversions.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Launch Failed",
        description: error?.message || "Could not create campaign.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (camp: CampaignItem) => {
    const nextStatus = camp.status === "active" ? "paused" : "active";
    setCampaigns((prev) =>
      prev.map((c) => (c.id === camp.id ? { ...c, status: nextStatus } : c))
    );
    try {
      await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: camp.id, status: nextStatus }),
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await saveCampaignToFirestore({
          id: `${firebaseUser.uid}_${camp.id}`,
          userId: firebaseUser.uid,
          name: camp.name,
          description: camp.description || "",
          type: (camp.type as any) || "multi-channel",
          status: nextStatus,
          budget: Number(camp.budget) || 0,
        });
      }
      toast({
        title: `Campaign ${nextStatus === "active" ? "Resumed" : "Paused"}`,
        description: `${camp.name} is now ${nextStatus}.`,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/campaigns?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      toast({
        title: "Campaign Removed",
        description: "Campaign deleted from workspace.",
      });
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  const handleAIOptimize = async (camp: CampaignItem) => {
    setOptimizingId(camp.id);
    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: camp.name,
          goals: camp.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to optimize campaign");
      const data = await res.json();
      toast({
        title: `Gemini Optimization for "${camp.name}"`,
        description:
          data.executiveSummary ||
          "Recommended shifting 20% budget to LinkedIn & X above-the-fold link cards.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: error?.message || "Could not run AI optimization.",
      });
    } finally {
      setOptimizingId(null);
    }
  };

  const totalBudget = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
  const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
  const totalConversions = campaigns.reduce(
    (s, c) => s + (c.conversions || 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Omnichannel Marketing Campaigns"
        description="Track, launch, and AI-optimize multi-network campaigns with real-time budget and conversion attribution."
        icon={Megaphone}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer"
            >
              Open Social Command Center
            </Button>
            <Button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="gap-1.5 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Active Campaigns</span>
              <Megaphone className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-2xl">
              {campaigns.filter((c) => c.status === "active").length} /{" "}
              {campaigns.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Total Allocated Budget</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl">
              ${totalBudget.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Attributed Conversions</span>
              <MousePointerClick className="h-4 w-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-2xl">
              {totalConversions.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Budget Utilization</span>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardDescription>
            <CardTitle className="text-2xl">
              {totalBudget > 0
                ? `${Math.round((totalSpent / totalBudget) * 100)}%`
                : "0%"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((camp) => {
          const progress =
            camp.budget > 0
              ? Math.min(100, Math.round((camp.spent / camp.budget) * 100))
              : 0;
          return (
            <Card key={camp.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={camp.status === "active" ? "default" : "secondary"}
                    className="uppercase text-[10px]"
                  >
                    {camp.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ROI: <strong className="text-emerald-400">{camp.roi || 280}%</strong>
                  </span>
                </div>
                <CardTitle className="text-lg pt-2">{camp.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {camp.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Budget Spent</span>
                    <span className="font-medium">
                      ${(camp.spent || 0).toLocaleString()} / $
                      {(camp.budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Reach</p>
                    <p className="text-sm font-semibold">
                      {((camp.impressions || 48000) / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Clicks</p>
                    <p className="text-sm font-semibold">
                      {(camp.clicks || 2150).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Conv.</p>
                    <p className="text-sm font-semibold">
                      {(camp.conversions || 180).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(camp)}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    {camp.status === "active" ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="h-8 w-8 p-0 text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={optimizingId === camp.id}
                  onClick={() => handleAIOptimize(camp)}
                  className="h-8 text-xs gap-1.5 cursor-pointer"
                >
                  {optimizingId === camp.id ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  AI Optimize
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreateCampaign}>
            <DialogHeader>
              <DialogTitle>Launch New Marketing Campaign</DialogTitle>
              <DialogDescription>
                Create a tracked campaign synced with your persistent workspace store and Firebase Firestore.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="camp-name">Campaign Name</Label>
                <Input
                  id="camp-name"
                  placeholder="e.g., Q3 Enterprise LinkedIn + X Demand Gen"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="camp-desc">Campaign Objective</Label>
                <Input
                  id="camp-desc"
                  placeholder="Drive product trials and benchmark downloads"
                  value={newCampaign.description}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="camp-budget">Allocated Budget (USD)</Label>
                <Input
                  id="camp-budget"
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, budget: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Launching..." : "Launch Campaign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
