"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Building,
  ListChecks,
  TrendingUp,
  Globe,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LocalMarketingPage() {
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("VisionAI Studio — NYC Hub");
  const [address, setAddress] = useState("350 Fifth Avenue, New York, NY 10118");
  const [phone, setPhone] = useState("+1 (212) 555-0194");
  const [website, setWebsite] = useState("https://visionai.studio/nyc");
  const [services, setServices] = useState(
    "Enterprise AI marketing command center, multi-platform social scheduling, and real-time attribution workshops."
  );
  const [isAuditingLocal, setIsAuditingLocal] = useState(false);
  const [localTips, setLocalTips] = useState<string[]>([
    "Include 'New York Enterprise AI Marketing Studio' in your Google Business Profile primary category and secondary attributes.",
    "Publish weekly Geo-Targeted LinkedIn and Instagram posts featuring local client case studies with NYC location tags.",
    "Maintain 100% NAP (Name, Address, Phone) citation consistency across Google Business Profile, Bing Places, and Apple Business Connect.",
  ]);

  const [geoCity, setGeoCity] = useState("New York Metro & Tri-State");
  const [geoCopy, setGeoCopy] = useState(
    "Joining fellow NYC marketing leaders this Thursday for our live Multi-Platform Social Velocity Workshop in Midtown! Reserve your seat: https://visionai.studio/nyc #NYCTech #MarketingOps"
  );
  const [isLaunchingGeo, setIsLaunchingGeo] = useState(false);

  const handleRunLocalAudit = async () => {
    setIsAuditingLocal(true);
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `${businessName} · ${address} · ${services}`,
          keywords: ["local SEO", address, businessName],
        }),
      });
      if (!res.ok) throw new Error("Failed to run local SEO audit");
      const json = await res.json();
      if (Array.isArray(json.data?.suggestions) && json.data.suggestions.length > 0) {
        setLocalTips(json.data.suggestions);
      }
      toast({
        title: "Local SEO & Directory Audit Complete",
        description: `Optimized local signals for ${businessName}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Local Audit Error",
        description: error?.message || "Could not complete local SEO audit.",
      });
    } finally {
      setIsAuditingLocal(false);
    }
  };

  const handleLaunchGeoCampaign = async () => {
    if (!geoCopy.trim()) return;
    setIsLaunchingGeo(true);
    try {
      const [postRes, campRes] = await Promise.all([
        fetch("/api/social/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: geoCopy,
            platforms: ["linkedin", "twitter", "instagram"],
            publishNow: false,
            scheduledTime: `Geo-Targeted (${geoCity}) · Tomorrow 10:00 AM`,
          }),
        }),
        fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Geo-Targeted Launch: ${geoCity}`,
            description: geoCopy,
            type: "social",
            status: "active",
            budget: 3500,
            channels: ["linkedin", "twitter", "instagram"],
          }),
        }),
      ]);

      if (!postRes.ok || !campRes.ok) {
        throw new Error("Failed to launch geo-targeted campaign");
      }

      toast({
        title: `Geo-Targeted Campaign Active (${geoCity})`,
        description:
          "Queued regional social posts and created a tracked campaign.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Launch Error",
        description: error?.message || "Could not launch regional campaign.",
      });
    } finally {
      setIsLaunchingGeo(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Local & Geo-Targeted Marketing Studio"
        description="Optimize regional business profiles, audit NAP directory citations, and dispatch geo-targeted social campaigns."
        icon={MapPin}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5 text-primary" />
              Regional Business Profile &amp; Local SEO Optimizer
            </CardTitle>
            <CardDescription>
              Keep NAP (Name, Address, Phone) metadata synchronized and optimized for regional search intent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="loc-name">Business / Hub Name</Label>
                <Input
                  id="loc-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loc-phone">Regional Phone</Label>
                <Input
                  id="loc-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-addr">Street Address &amp; Postal Code</Label>
              <Input
                id="loc-addr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-web">Regional Landing Page URL</Label>
              <Input
                id="loc-web"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-serv">Regional Services &amp; Keywords</Label>
              <Textarea
                id="loc-serv"
                rows={3}
                value={services}
                onChange={(e) => setServices(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>NAP Citation &amp; Schema Completeness</span>
                <span className="font-mono tabular-nums text-emerald-500 font-semibold">
                  94%
                </span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button
              type="button"
              disabled={isAuditingLocal}
              onClick={handleRunLocalAudit}
              className="w-full gap-2 cursor-pointer"
            >
              {isAuditingLocal ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Gemini Local SEO Audit...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Audit Local SEO with Gemini
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-primary" />
                Gemini Local Search &amp; Citation Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {localTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Geo-Targeted Social Campaign Dispatcher
              </CardTitle>
              <CardDescription>
                Launch a regional campaign synced with your Omnichannel Campaigns and Social Queue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="geo-city">Target Metro / Radius</Label>
                <Input
                  id="geo-city"
                  value={geoCity}
                  onChange={(e) => setGeoCity(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="geo-copy">Regional Post Copy</Label>
                <Textarea
                  id="geo-copy"
                  rows={3}
                  value={geoCopy}
                  onChange={(e) => setGeoCopy(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                type="button"
                disabled={isLaunchingGeo}
                onClick={handleLaunchGeoCampaign}
                className="w-full gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isLaunchingGeo
                  ? "Launching Regional Campaign..."
                  : `Launch Geo-Targeted Campaign (${geoCity})`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
