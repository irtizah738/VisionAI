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
  MailCheck,
  Sparkles,
  Copy,
  Send,
  RefreshCw,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function EmailMarketingPage() {
  const { toast } = useToast();
  const [topic, setTopic] = useState(
    "Q2 Product Launch: Live Multi-Platform Social Previews & Command Center"
  );
  const [audience, setAudience] = useState(
    "VP of Marketing, Growth Leads & Social Media Managers"
  );
  const [tone, setTone] = useState("High-Converting & Executive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingCampaign, setIsSavingCampaign] = useState(false);
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState(0);

  const [emailData, setEmailData] = useState({
    subjectLines: [
      "[New] Preview X, LinkedIn, Instagram, Facebook & YouTube side-by-side before scheduling",
      "Why 68% of social CTAs get cut off below the fold (and how to fix it in 10 seconds)",
      "Meet the new VisionAI Streams & Planner Command Center ⚡",
      "3x your social CTR by eliminating premature '...more' truncation",
    ],
    preheaders: [
      "See exact character cutoffs and link cards across all 5 channels before you publish.",
      "Interactive platform tabs + side-by-side comparison mode are now live.",
    ],
    emailBody: `Hi there,\n\nWe just shipped our most requested capability inside VisionAI Studio: **Live Multi-Platform Native Post Previews** integrated directly into your Streams & Planner Command Center.\n\nBefore scheduling any post, you can now validate:\n• Exact character truncation and "...more" fold cutoffs for X/Twitter, LinkedIn, Instagram, Facebook, and YouTube\n• Automatic hashtag, @mention, and OG link card rendering\n• Interactive single-platform tabs or side-by-side comparison mode\n\nLog into your workspace today to test your next campaign.\n\nBest,\nThe VisionAI Product Team`,
  });

  const handleGenerateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, tone }),
      });
      if (!res.ok) throw new Error("Failed to generate email campaign");
      const data = await res.json();
      setEmailData(data);
      setSelectedSubjectIdx(0);
      toast({
        title: "Email Sequence Generated",
        description: `Generated ${data.subjectLines?.length || 5} high-converting subject lines and body copy.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: error?.message || "Could not generate email copy.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsCampaign = async () => {
    setIsSavingCampaign(true);
    try {
      const chosenSubject =
        emailData.subjectLines[selectedSubjectIdx] || topic;
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Email Blast: ${chosenSubject.slice(0, 60)}`,
          description: emailData.preheaders[0] || topic,
          type: "email",
          status: "active",
          budget: 4500,
          channels: ["email", "linkedin"],
        }),
      });
      if (!res.ok) throw new Error("Failed to save email campaign");
      toast({
        title: "Email Campaign Saved & Scheduled",
        description:
          "Added to your active Campaigns dashboard with tracking enabled.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Campaign Error",
        description: error?.message || "Could not save campaign.",
      });
    } finally {
      setIsSavingCampaign(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Email Marketing & Subject Line Studio"
        description="Generate A/B subject lines, preheaders, and conversion-focused email copy with Gemini AI."
        icon={MailCheck}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 h-fit">
          <form onSubmit={handleGenerateEmail}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Campaign Offer &amp; Audience
              </CardTitle>
              <CardDescription>
                Generate subject line variants and full body copy tailored to your segment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-topic">Campaign Topic / Offer</Label>
                <Textarea
                  id="email-topic"
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-audience">Target Segment</Label>
                <Input
                  id="email-audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-tone">Voice &amp; Tone</Label>
                <Input
                  id="email-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
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
                    Generating Variants...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Subject Lines &amp; Email Copy
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="outline" className="gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                A/B Subject Line Variants
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Subject: ${emailData.subjectLines[selectedSubjectIdx]}\n\n${emailData.emailBody}`
                    );
                    toast({
                      title: "Email Copied",
                      description: "Subject line and body copied to clipboard.",
                    });
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Email
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isSavingCampaign}
                  onClick={handleSaveAsCampaign}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSavingCampaign
                    ? "Launching..."
                    : "Launch as Active Campaign"}
                </Button>
              </div>
            </div>
            <CardTitle className="text-lg pt-2">
              Select Winning Subject Line
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              {emailData.subjectLines.map((subj, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSubjectIdx(idx)}
                  className={`w-full text-left flex items-center justify-between rounded-lg border p-3 text-sm transition-colors cursor-pointer ${
                    selectedSubjectIdx === idx
                      ? "border-primary bg-primary/10 font-medium"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        selectedSubjectIdx === idx
                          ? "text-primary"
                          : "text-muted-foreground/40"
                      }`}
                    />
                    {subj}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Variant {String.fromCharCode(65 + idx)}
                  </Badge>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Email Body Copy
              </Label>
              <div className="rounded-lg border bg-card p-4 whitespace-pre-wrap text-sm leading-relaxed">
                {emailData.emailBody}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
