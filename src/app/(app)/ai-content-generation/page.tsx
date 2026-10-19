"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Copy,
  Send,
  FileText,
  Mail,
  MessageSquare,
  RefreshCw,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { savePostToFirestore } from "@/lib/firebase";
import {
  SocialPostLivePreview,
  SocialNetwork,
} from "@/components/social/social-post-live-preview";

export default function AIContentGenerationPage() {
  const { toast } = useToast();
  const { user: firebaseUser } = useFirebase();
  const [contentType, setContentType] = useState("social");
  const [topic, setTopic] = useState(
    "Launching our unified multi-platform social preview & command center"
  );
  const [tone, setTone] = useState("professional");
  const [keywords, setKeywords] = useState(
    "social media preview, fold cutoff, marketing automation"
  );
  const [generatedContent, setGeneratedContent] = useState(
    `🚀 Launching our unified multi-platform social preview & command center!\n\nSee how your posts render on X, LinkedIn, Instagram, Facebook, and YouTube before you schedule—complete with real-time character truncation cutoffs and native OG link cards.\n\nTry it live: https://visionai.studio/launch #SocialMedia #MarketingAI #ProductLaunch`
  );
  const [activePlatform, setActivePlatform] =
    useState<SocialNetwork>("linkedin");
  const [isLoading, setIsLoading] = useState(false);
  const [isQueuing, setIsQueuing] = useState(false);
  const [isRepurposing, setIsRepurposing] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: contentType === "social" ? "social" : "content",
          useBrandVoice: true,
          message: `Generate ${contentType} copy about "${topic}". Tone: ${tone}. Include keywords: ${keywords}. Make it ready to publish immediately with a clear above-the-fold hook.`,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate content");
      const data = await response.json();
      setGeneratedContent(data.content || data.message || "");

      toast({
        title: "Content Generated with Gemini & Brand Voice",
        description: "Your AI content is ready to review or schedule.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepurposeForSelectedNetwork = async () => {
    if (!generatedContent.trim()) return;
    setIsRepurposing(true);
    try {
      const res = await fetch("/api/ai/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic,
          content: generatedContent,
          targetUrl: "https://visionai.studio/launch",
          useBrandVoice: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to repurpose content");
      const data = await res.json();
      const match = (data.variants || []).find(
        (v: any) => v.network === activePlatform
      );
      if (match) {
        setGeneratedContent(match.content);
        toast({
          title: `Adapted for ${activePlatform.toUpperCase()} Fold`,
          description: match.foldStrategy,
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Adaptation Error",
        description: err?.message || "Could not adapt copy.",
      });
    } finally {
      setIsRepurposing(false);
    }
  };

  const handleQueueToStreams = async () => {
    if (!generatedContent.trim()) return;
    setIsQueuing(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          network: activePlatform,
          platforms: [activePlatform, "twitter", "linkedin"],
          status: "scheduled",
          scheduledTime: "Today, 5:30 PM",
        }),
      });
      if (!res.ok) throw new Error("Failed to schedule content");
      const { post } = await res.json();

      if (firebaseUser && firebaseUser.emailVerified && post) {
        await savePostToFirestore({
          id: `${firebaseUser.uid}_${post.id}`,
          userId: firebaseUser.uid,
          network: activePlatform,
          handle: "@VisionAI_HQ",
          content: generatedContent,
          status: "scheduled",
          scheduledTime: "Today, 5:30 PM",
        });
      }

      toast({
        title: "Sent to Streams & Planner Queue",
        description: firebaseUser
          ? `Scheduled for Today at 5:30 PM and synced to Firestore /posts.`
          : `Scheduled across ${activePlatform.toUpperCase()} for Today at 5:30 PM.`,
      });
    } catch (error: any) {
      toast({
        title: "Schedule Error",
        description: error?.message || "Could not schedule post.",
        variant: "destructive",
      });
    } finally {
      setIsQueuing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Content Generation & Omnichannel Adapter"
        description="Create conversion-ready social copy, ad variations, and product announcements with Brand Voice Memory and live fold validation."
        icon={Sparkles}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 h-fit">
          <CardHeader>
            <CardTitle>Content Configuration</CardTitle>
            <CardDescription>
              Configure format, tone, and target keywords for Gemini 3.8 Flash.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Format</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Multi-Network Social Post
                    </div>
                  </SelectItem>
                  <SelectItem value="blog">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Executive LinkedIn Article
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Product Launch Email Snippet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Campaign Topic / Value Proposition</Label>
              <Textarea
                id="topic"
                placeholder="Describe what you're announcing or promoting..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Brand Voice Override</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">
                    Executive &amp; Authoritative
                  </SelectItem>
                  <SelectItem value="casual">
                    Creator-Friendly &amp; Conversational
                  </SelectItem>
                  <SelectItem value="persuasive">
                    High-Converting Direct Response
                  </SelectItem>
                  <SelectItem value="informative">
                    Data-Driven &amp; Analytical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords / Hashtag Seeds</Label>
              <Input
                id="keywords"
                placeholder="Enter keywords separated by commas"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="draft-editor">Editable Draft Output</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isRepurposing}
                  onClick={handleRepurposeForSelectedNetwork}
                  className="h-7 text-xs gap-1.5 cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  {isRepurposing
                    ? "Adapting..."
                    : `Optimize for ${activePlatform} Fold`}
                </Button>
              </div>
              <Textarea
                id="draft-editor"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={5}
                className="text-xs leading-relaxed"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content with Brand Voice
                </>
              )}
            </Button>
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-1.5 text-xs cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  toast({
                    title: "Copied to Clipboard",
                    description: "Draft copied to your clipboard.",
                  });
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Text
              </Button>
              <Button
                type="button"
                disabled={isQueuing}
                onClick={handleQueueToStreams}
                className="flex-1 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                {isQueuing ? "Scheduling..." : "Queue to Planner"}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="lg:col-span-7">
          <SocialPostLivePreview
            content={generatedContent}
            selectedPlatforms={[
              "twitter",
              "linkedin",
              "instagram",
              "facebook",
              "youtube",
            ]}
            activePlatform={activePlatform}
            onActivePlatformChange={setActivePlatform}
            selectedPresetId="preset-launch"
            scheduledTime="Today, 5:30 PM"
          />
        </div>
      </div>
    </div>
  );
}
