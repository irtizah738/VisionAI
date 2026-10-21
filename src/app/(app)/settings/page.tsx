"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import {
  ensureUserProfileInFirestore,
  saveSocialAccountToFirestore,
  deleteSocialAccountFromFirestore,
  saveBrandVoiceToFirestore,
} from "@/lib/firebase";
import {
  Settings as SettingsIcon,
  User,
  Share2,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Sparkles,
  Cloud,
  Database,
  LogIn,
  LogOut,
  ExternalLink,
  Copy,
  Wand2,
} from "lucide-react";

interface SocialAccountItem {
  id: string;
  provider: "twitter" | "linkedin" | "instagram" | "facebook" | "youtube";
  accountName: string;
  handle: string;
  followers: string;
  status: "connected" | "disconnected";
  lastSynced: string;
}

const PLATFORM_META: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    defaultHandle: string;
    envKeys: string;
  }
> = {
  twitter: {
    label: "X / Twitter",
    icon: Twitter,
    accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    defaultHandle: "@VisionAI_HQ",
    envKeys: "TWITTER_CLIENT_ID / TWITTER_CLIENT_SECRET",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    defaultHandle: "linkedin.com/company/visionai",
    envKeys: "LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    accent: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    defaultHandle: "@visionai.studio",
    envKeys: "INSTAGRAM_CLIENT_ID / INSTAGRAM_CLIENT_SECRET",
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    accent: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    defaultHandle: "fb.com/VisionAIStudio",
    envKeys: "FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    accent: "text-red-400 border-red-500/30 bg-red-500/10",
    defaultHandle: "youtube.com/@VisionAI",
    envKeys: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET",
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    user: firebaseUser,
    projectId,
    cloudPosts,
    cloudAccounts,
    cloudCampaigns,
    cloudBrandVoice,
    cloudWorkspaceItems,
    isSyncing,
    signInWithGoogle,
    signOutFirebase,
    syncWorkspaceToFirestore,
  } = useFirebase();

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingBrandVoice, setIsSavingBrandVoice] = useState(false);
  const [isTestingBrandVoice, setIsTestingBrandVoice] = useState(false);
  const [brandVoiceSampleOutput, setBrandVoiceSampleOutput] = useState<string>("");

  const [connectingProvider, setConnectingProvider] = useState<string | null>(
    null
  );
  const [callbackUri, setCallbackUri] = useState(
    "https://ais-dev-z7j4uvpz5hjrfj2l6w5pue-644889006515.asia-east1.run.app/api/oauth/callback"
  );

  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "admin@vision.ai",
    role: "VP of Growth & Social",
    company: "VisionAI Technologies",
    timezone: "America/New_York",
    language: "en",
    bio: "Leading multi-channel social strategy, AI content velocity, and brand engagement across 5 global channels.",
    notifications: {
      emailDigest: true,
      publishAlerts: true,
      mentionAlerts: true,
      weeklyReports: true,
    },
  });

  const [brandVoice, setBrandVoice] = useState({
    brandName: "VisionAI Technologies",
    tone: "Authoritative, Data-Driven & Executive",
    targetAudience: "B2B SaaS CMOs, VPs of Growth, and Social Media Directors",
    keyPillars:
      "1. Fold-Aware Native Previews above the mobile cutoff\n2. Quantifiable Multi-Network Pipeline Attribution (4.2x ROI)\n3. Zero-Slop Executive Clarity & High-Contrast Visuals",
    bannedWords: "synergy, delve, game-changer, revolutionary, unleash",
    ctaStyle:
      "Include a direct benchmark URL (https://visionai.studio/launch) with concrete ROI metrics before the fold.",
    enabled: true,
  });

  const [accounts, setAccounts] = useState<SocialAccountItem[]>([]);
  const [customHandles, setCustomHandles] = useState<Record<string, string>>(
    {}
  );

  const fetchSocialAccounts = useCallback(async () => {
    try {
      const accountsRes = await fetch("/api/user/social-accounts");
      if (accountsRes.ok) {
        const { accounts: loadedAccounts } = await accountsRes.json();
        if (Array.isArray(loadedAccounts)) {
          setAccounts(loadedAccounts);
        }
      }
    } catch (err) {
      console.error("Failed to refresh social accounts:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCallbackUri(`${window.location.origin}/api/oauth/callback`);
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const [profileRes, accountsRes, bvRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/social-accounts"),
          fetch("/api/user/brand-voice"),
        ]);

        if (profileRes.ok) {
          const { user } = await profileRes.json();
          if (user) {
            setProfile({
              name: user.name || "Alex Morgan",
              email: user.email || "admin@vision.ai",
              role: user.role || "VP of Growth & Social",
              company: user.company || "VisionAI Technologies",
              timezone: user.timezone || "America/New_York",
              language: user.language || "en",
              bio: user.bio || "",
              notifications: user.notifications || {
                emailDigest: true,
                publishAlerts: true,
                mentionAlerts: true,
                weeklyReports: true,
              },
            });
          }
        }

        if (accountsRes.ok) {
          const { accounts: loadedAccounts } = await accountsRes.json();
          if (Array.isArray(loadedAccounts)) {
            setAccounts(loadedAccounts);
          }
        }

        if (bvRes.ok) {
          const { brandVoice: loadedBv } = await bvRes.json();
          if (loadedBv) {
            setBrandVoice({
              brandName: loadedBv.brandName || "VisionAI Technologies",
              tone: loadedBv.tone || "Authoritative, Data-Driven & Executive",
              targetAudience:
                loadedBv.targetAudience ||
                "B2B SaaS CMOs, VPs of Growth, and Social Media Directors",
              keyPillars: loadedBv.keyPillars || "",
              bannedWords: loadedBv.bannedWords || "",
              ctaStyle: loadedBv.ctaStyle || "",
              enabled: loadedBv.enabled !== false,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Sync incoming Firestore cloudBrandVoice if available
  useEffect(() => {
    if (cloudBrandVoice) {
      setBrandVoice((prev) => ({
        ...prev,
        brandName: cloudBrandVoice.brandName || prev.brandName,
        tone: cloudBrandVoice.tone || prev.tone,
        targetAudience: cloudBrandVoice.targetAudience || prev.targetAudience,
        keyPillars: cloudBrandVoice.keyPillars || prev.keyPillars,
        bannedWords: cloudBrandVoice.bannedWords ?? prev.bannedWords,
        ctaStyle: cloudBrandVoice.ctaStyle || prev.ctaStyle,
      }));
    }
  }, [cloudBrandVoice]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (
        origin &&
        !origin.endsWith(".run.app") &&
        !origin.includes("localhost") &&
        origin !== window.location.origin
      ) {
        return;
      }

      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        const provider = event.data.provider || "twitter";
        const account = event.data.account;
        await fetchSocialAccounts();

        if (firebaseUser && firebaseUser.emailVerified && account) {
          try {
            await saveSocialAccountToFirestore({
              id: `${firebaseUser.uid}_${account.id || provider}`,
              userId: firebaseUser.uid,
              provider: provider as any,
              accountName: account.accountName || `VisionAI (${provider})`,
              handle: account.handle || `@visionai_${provider}`,
              status: "connected",
            });
          } catch (e) {
            console.error("Failed to sync OAuth account to Firestore:", e);
          }
        }

        setConnectingProvider(null);
        toast({
          title: `${PLATFORM_META[provider]?.label || provider} Connected via OAuth 2.0`,
          description: `Successfully authenticated ${account?.handle || provider} and enabled live publishing.`,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchSocialAccounts, firebaseUser, toast]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      if (firebaseUser && firebaseUser.emailVerified) {
        await ensureUserProfileInFirestore({
          uid: firebaseUser.uid,
          displayName: profile.name,
          email: profile.email,
          avatarUrl: firebaseUser.photoURL || "",
          timezone: profile.timezone,
          language: profile.language,
        });
      }

      toast({
        title: "Workspace Settings Saved",
        description: firebaseUser
          ? "Your profile and private preferences have been saved locally and synced to Firebase Firestore."
          : "Your profile and notification preferences have been persisted.",
      });
    } catch (error: any) {
      toast({
        title: "Error Saving Settings",
        description: error?.message || "Could not update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveBrandVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBrandVoice(true);
    try {
      const res = await fetch("/api/user/brand-voice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandVoice),
      });
      if (!res.ok) throw new Error("Failed to save Brand Voice Memory");

      if (firebaseUser && firebaseUser.emailVerified) {
        await ensureUserProfileInFirestore({
          uid: firebaseUser.uid,
          displayName: profile.name,
          email: profile.email,
          avatarUrl: firebaseUser.photoURL || "",
        });
        await saveBrandVoiceToFirestore({
          userId: firebaseUser.uid,
          brandName: brandVoice.brandName,
          tone: brandVoice.tone,
          targetAudience: brandVoice.targetAudience,
          keyPillars: brandVoice.keyPillars,
          bannedWords: brandVoice.bannedWords,
          ctaStyle: brandVoice.ctaStyle,
        });
      }

      toast({
        title: "Brand Voice Memory Persisted",
        description: firebaseUser
          ? "Saved to workspace store and synced to Firestore /brandVoices/{uid}. All Gemini AI endpoints will now enforce this voice."
          : "Saved to workspace store. All Gemini AI endpoints will now enforce this Brand Voice Memory.",
      });
    } catch (error: any) {
      toast({
        title: "Error Saving Brand Voice",
        description: error?.message || "Could not update Brand Voice Memory.",
        variant: "destructive",
      });
    } finally {
      setIsSavingBrandVoice(false);
    }
  };

  const handleTestBrandVoice = async () => {
    setIsTestingBrandVoice(true);
    try {
      const res = await fetch("/api/ai/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Announcing ${brandVoice.brandName}'s Q4 omnichannel growth benchmark for ${brandVoice.targetAudience}`,
          tone: brandVoice.tone,
          useBrandVoice: true,
          brandVoiceOverride: brandVoice,
        }),
      });
      if (!res.ok) throw new Error("Failed to test Brand Voice");
      const data = await res.json();
      setBrandVoiceSampleOutput(data.postContent || data.content || "");
      toast({
        title: "Brand Voice Sample Generated",
        description: "Verified hook, tone, pillars, and banned-word filtering with Gemini.",
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error?.message || "Could not generate Brand Voice test.",
        variant: "destructive",
      });
    } finally {
      setIsTestingBrandVoice(false);
    }
  };

  const handleConnectProvider = async (provider: string) => {
    setConnectingProvider(provider);
    const handleInput =
      customHandles[provider]?.trim() ||
      PLATFORM_META[provider]?.defaultHandle ||
      `@visionai_${provider}`;

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const urlRes = await fetch(
        `/api/oauth/${provider}/url?origin=${encodeURIComponent(origin)}&handle=${encodeURIComponent(handleInput)}`
      );

      if (urlRes.ok) {
        const { url, mode } = await urlRes.json();
        if (url && mode === "live_oauth") {
          const popup = window.open(
            url,
            `oauth_${provider}`,
            "width=600,height=700"
          );
          if (popup) {
            return;
          }
        }
      }

      const res = await fetch("/api/user/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          handle: handleInput,
          accountName: `VisionAI (${PLATFORM_META[provider]?.label || provider})`,
        }),
      });
      if (!res.ok) throw new Error("Failed to connect social channel");
      const data = await res.json();
      if (Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
      }

      if (firebaseUser && firebaseUser.emailVerified && data.account) {
        await saveSocialAccountToFirestore({
          id: `${firebaseUser.uid}_${data.account.id || provider}`,
          userId: firebaseUser.uid,
          provider: provider as any,
          accountName: data.account.accountName,
          handle: data.account.handle,
          status: "connected",
        });
      }

      toast({
        title: `${PLATFORM_META[provider]?.label || provider} Connected`,
        description: `Successfully linked ${handleInput} to your social command center.`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error?.message || "Failed to connect social account.",
        variant: "destructive",
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnectAccount = async (account: SocialAccountItem) => {
    setConnectingProvider(account.provider);
    try {
      const res = await fetch(`/api/user/social-accounts/${account.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to disconnect account");
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));

      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteSocialAccountFromFirestore(
          `${firebaseUser.uid}_${account.id}`
        );
      }

      toast({
        title: `${PLATFORM_META[account.provider]?.label || account.provider} Disconnected`,
        description: `${account.handle} has been removed from active publishing channels.`,
      });
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error?.message || "Could not disconnect social account.",
        variant: "destructive",
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const signedIn = await signInWithGoogle();
      if (signedIn) {
        setProfile((prev) => ({
          ...prev,
          name: signedIn.displayName || prev.name,
          email: signedIn.email || prev.email,
        }));
        toast({
          title: "Connected to Firebase Auth",
          description: `Signed in as ${signedIn.email}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description:
          error?.message || "Popup sign-in was cancelled or blocked.",
        variant: "destructive",
      });
    }
  };

  const handleSyncToFirestore = async () => {
    try {
      const count = await syncWorkspaceToFirestore();
      toast({
        title: "Workspace Synced to Firestore",
        description: `Successfully synced ${count} records (posts, accounts, campaigns, Brand Voice, and suite items) to project ${projectId}.`,
      });
    } catch (error: any) {
      toast({
        title: "Firestore Sync Failed",
        description: error?.message || "Sign in with Google first to sync.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace, Brand Voice Memory & Cloud Settings"
        description="Configure persistent AI Brand Voice Memory, 3P OAuth 2.0 social connections, and Firebase Firestore cloud synchronization."
        icon={SettingsIcon}
      />

      <Tabs defaultValue="brand-voice" className="space-y-6">
        <TabsList className="grid w-full max-w-4xl grid-cols-5">
          <TabsTrigger value="brand-voice" className="gap-1.5 text-xs">
            <Wand2 className="h-3.5 w-3.5" />
            Brand Voice Memory
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-1.5 text-xs">
            <Share2 className="h-3.5 w-3.5" />
            OAuth Channels ({accounts.length}/5)
          </TabsTrigger>
          <TabsTrigger value="firebase" className="gap-1.5 text-xs">
            <Cloud className="h-3.5 w-3.5" />
            Firebase Cloud
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <User className="h-3.5 w-3.5" />
            Profile &amp; Identity
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            Alerts &amp; AI Engine
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: BRAND VOICE MEMORY */}
        <TabsContent value="brand-voice" className="space-y-6">
          <form onSubmit={handleSaveBrandVoice}>
            <Card className="border-emerald-500/30">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-emerald-500" />
                      Persistent AI Brand Voice Memory
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Automatically injected into every Gemini AI prompt across Social Composer, Content Studio, Blog Generator, Email Marketing, and AI Visual Generation.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bv-enabled" className="text-xs font-medium">
                      Enforce Across All AI Suites
                    </Label>
                    <Switch
                      id="bv-enabled"
                      checked={brandVoice.enabled}
                      onCheckedChange={(checked) =>
                        setBrandVoice({ ...brandVoice, enabled: checked })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bv-name">Official Brand Name</Label>
                    <Input
                      id="bv-name"
                      value={brandVoice.brandName}
                      onChange={(e) =>
                        setBrandVoice({ ...brandVoice, brandName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bv-tone">Signature Voice &amp; Tone</Label>
                    <Input
                      id="bv-tone"
                      placeholder="e.g. Authoritative, Data-Driven & Executive"
                      value={brandVoice.tone}
                      onChange={(e) =>
                        setBrandVoice({ ...brandVoice, tone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bv-audience">Primary Target Audience / ICP</Label>
                  <Input
                    id="bv-audience"
                    value={brandVoice.targetAudience}
                    onChange={(e) =>
                      setBrandVoice({
                        ...brandVoice,
                        targetAudience: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bv-pillars">Core Messaging Pillars &amp; Value Props</Label>
                  <Textarea
                    id="bv-pillars"
                    rows={3}
                    value={brandVoice.keyPillars}
                    onChange={(e) =>
                      setBrandVoice({
                        ...brandVoice,
                        keyPillars: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bv-banned">
                      Banned Words / Anti-Slop Blacklist
                    </Label>
                    <Input
                      id="bv-banned"
                      placeholder="synergy, delve, game-changer..."
                      value={brandVoice.bannedWords}
                      onChange={(e) =>
                        setBrandVoice({
                          ...brandVoice,
                          bannedWords: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bv-cta">Preferred Call-to-Action Pattern</Label>
                    <Input
                      id="bv-cta"
                      value={brandVoice.ctaStyle}
                      onChange={(e) =>
                        setBrandVoice({ ...brandVoice, ctaStyle: e.target.value })
                      }
                    />
                  </div>
                </div>

                {brandVoiceSampleOutput && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-500 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Live Brand Voice Test Output (Gemini)
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {brandVoiceSampleOutput.length} chars
                      </span>
                    </div>
                    <p className="text-xs whitespace-pre-wrap leading-relaxed text-foreground">
                      {brandVoiceSampleOutput}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestBrandVoice}
                  disabled={isTestingBrandVoice}
                  className="gap-1.5 cursor-pointer"
                >
                  <Sparkles
                    className={`h-4 w-4 ${isTestingBrandVoice ? "animate-spin" : "text-emerald-500"}`}
                  />
                  {isTestingBrandVoice
                    ? "Synthesizing Sample..."
                    : "Test Brand Voice with Gemini"}
                </Button>

                <Button
                  type="submit"
                  disabled={isSavingBrandVoice}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {isSavingBrandVoice
                    ? "Saving Brand Voice..."
                    : "Save & Sync Brand Voice Memory"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* TAB 2: OAUTH CHANNELS */}
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>
                    Connected Social Media Channels (OAuth 2.0)
                  </CardTitle>
                  <CardDescription>
                    Authenticate your official brand accounts for X/Twitter, LinkedIn, Instagram, Facebook, and YouTube via popup-based OAuth 2.0.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">OAuth Callback URI:</span>
                  <code className="font-mono text-[11px] text-foreground">
                    {callbackUri}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(callbackUri);
                      toast({
                        title: "OAuth Callback URI Copied",
                        description:
                          "Add this redirect URI to your X, LinkedIn, Meta, or Google OAuth app settings.",
                      });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(PLATFORM_META).map(([providerKey, meta]) => {
                const Icon = meta.icon;
                const connectedAccount = accounts.find(
                  (a) => a.provider === providerKey && a.status === "connected"
                );
                const isBusy = connectingProvider === providerKey;

                return (
                  <div
                    key={providerKey}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${meta.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {meta.label}
                          </span>
                          {connectedAccount ? (
                            <span className="inline-flex items-center text-xs text-emerald-500 font-medium">
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Connected
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not Connected
                            </span>
                          )}
                        </div>
                        {connectedAccount ? (
                          <p className="text-xs text-muted-foreground font-mono tabular-nums">
                            Handle:{" "}
                            <span className="font-sans font-medium text-foreground">
                              {connectedAccount.handle}
                            </span>{" "}
                            · {connectedAccount.followers} followers · Synced{" "}
                            {connectedAccount.lastSynced}
                          </p>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Input
                              placeholder={meta.defaultHandle}
                              value={customHandles[providerKey] || ""}
                              onChange={(e) =>
                                setCustomHandles((prev) => ({
                                  ...prev,
                                  [providerKey]: e.target.value,
                                }))
                              }
                              className="h-8 w-56 text-xs"
                            />
                            <span className="text-[11px] text-muted-foreground font-mono">
                              Env: {meta.envKeys}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {connectedAccount ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isBusy}
                          onClick={() =>
                            handleDisconnectAccount(connectedAccount)
                          }
                          className="text-xs h-8 gap-1.5 text-destructive hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {isBusy ? "Disconnecting..." : "Disconnect"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => handleConnectProvider(providerKey)}
                          className="text-xs h-8 gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isBusy
                            ? "Authenticating..."
                            : `Connect ${meta.label}`}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: FIREBASE CLOUD */}
        <TabsContent value="firebase" className="space-y-6">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-500" />
                    Firebase Firestore &amp; Google Authentication
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Provisioned on Google Cloud project{" "}
                    <code className="font-mono text-xs bg-background/80 px-1.5 py-0.5 rounded border">
                      {projectId}
                    </code>{" "}
                    with Zero-Trust ABAC Firestore security rules and full suite persistence.
                  </CardDescription>
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  {firebaseUser ? "Authenticated & Live" : "Provisioned & Ready"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-xs text-muted-foreground">Cloud Posts</p>
                  <p className="text-2xl font-bold font-mono tabular-nums mt-1">
                    {cloudPosts.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    <code>/posts/&#123;id&#125;</code>
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-xs text-muted-foreground">Cloud Channels</p>
                  <p className="text-2xl font-bold font-mono tabular-nums mt-1">
                    {cloudAccounts.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    <code>/socialAccounts/&#123;id&#125;</code>
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-xs text-muted-foreground">Cloud Campaigns</p>
                  <p className="text-2xl font-bold font-mono tabular-nums mt-1">
                    {cloudCampaigns.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    <code>/campaigns/&#123;id&#125;</code>
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-xs text-muted-foreground">Brand Voice</p>
                  <p className="text-2xl font-bold font-mono tabular-nums mt-1">
                    {cloudBrandVoice ? "Active" : "Local"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    <code>/brandVoices/&#123;uid&#125;</code>
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-xs text-muted-foreground">Suite Records</p>
                  <p className="text-2xl font-bold font-mono tabular-nums mt-1">
                    {cloudWorkspaceItems.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    <code>/workspaceItems/&#123;id&#125;</code>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border bg-card p-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {firebaseUser
                      ? `Signed in as ${firebaseUser.displayName || firebaseUser.email}`
                      : "Sign in with Google to enable real-time Firestore cloud persistence"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {firebaseUser
                      ? `UID: ${firebaseUser.uid} · Verified: ${firebaseUser.emailVerified ? "Yes" : "No"}`
                      : "Uses signInWithPopup and provisions isolated /users/{uid}, /brandVoices/{uid}, and /workspaceItems/{id} collections."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!firebaseUser ? (
                    <Button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="gap-2 cursor-pointer"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in with Google
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={handleSyncToFirestore}
                        disabled={isSyncing}
                        className="gap-2 cursor-pointer"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                        />
                        {isSyncing
                          ? "Syncing All Suites..."
                          : "Sync Entire Workspace to Firestore"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={signOutFirebase}
                        className="gap-1.5 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PROFILE */}
        <TabsContent value="profile">
          <form onSubmit={handleSaveProfile}>
            <Card>
              <CardHeader>
                <CardTitle>Profile &amp; Workspace Identity</CardTitle>
                <CardDescription>
                  Update your workspace display details, default timezone for scheduled posts, and localization settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Title</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) =>
                        setProfile({ ...profile, role: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Organization / Brand</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Scheduler Timezone</Label>
                    <Input
                      id="timezone"
                      value={profile.timezone}
                      onChange={(e) =>
                        setProfile({ ...profile, timezone: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Primary Content Locale</Label>
                    <Input
                      id="language"
                      value={profile.language}
                      onChange={(e) =>
                        setProfile({ ...profile, language: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Executive Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Synced with Streams &amp; Planner Command Center
                </span>
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="cursor-pointer"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Workspace Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* TAB 5: NOTIFICATIONS & AI ENGINE */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Server-Managed Gemini AI Engine
              </CardTitle>
              <CardDescription>
                All AI generation routes (Social Posts, AI Visuals, Blog Articles, Email Subject Lines, SEO Audits, and Multi-Channel Strategy) run securely server-side via the unified{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                  @google/genai
                </code>{" "}
                SDK with Brand Voice Memory injection and sliding-window rate limiting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border bg-emerald-500/5 border-emerald-500/20 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      Server-Side Gemini API Proxy Active
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Zero client-exposed API keys · Brand Voice Memory Active · Rate-limit protected
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  Operational
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which real-time alerts appear in your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3.5">
                <div>
                  <p className="text-sm font-medium">
                    Scheduled Post Publish Confirmations
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Notify immediately when queued posts go live on X, LinkedIn, Instagram, Facebook, or YouTube.
                  </p>
                </div>
                <Switch
                  checked={profile.notifications.publishAlerts}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        publishAlerts: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3.5">
                <div>
                  <p className="text-sm font-medium">
                    High-Priority Mention &amp; Inbox Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Alert when customer questions or high-reach mentions arrive in your stream columns.
                  </p>
                </div>
                <Switch
                  checked={profile.notifications.mentionAlerts}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        mentionAlerts: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="cursor-pointer"
              >
                {isSavingProfile ? "Saving..." : "Save Alert Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
