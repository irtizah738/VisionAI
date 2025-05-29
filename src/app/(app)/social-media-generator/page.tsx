"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Twitter, Instagram, Youtube, Calendar as CalendarIcon, Clock, Image as ImageIcon } from "lucide-react";

type Platform = "facebook" | "twitter" | "instagram" | "youtube";
type ContentType = "text" | "image" | "video" | "carousel";

type Post = {
  id: string;
  platforms: Platform[];
  content: string;
  contentType: ContentType;
  scheduledFor?: Date;
  mediaUrls?: string[];
  timestamp: Date;
};

export default function SocialMediaGeneratorPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [contentType, setContentType] = useState<ContentType>("text");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  const generatePost = async () => {
    if (!prompt || selectedPlatforms.length === 0) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/social-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          platforms: selectedPlatforms,
          contentType,
          tone,
          scheduledFor: scheduledDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate post");
      }

      const data = await response.json();
      setGeneratedPosts((prev) => [data, ...prev]);
      setActiveTab("preview");
    } catch (error) {
      console.error("Failed to generate post:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const PlatformIcon = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <PageHeader
        title="Social Media Generator"
        description="Create engaging social media content across platforms"
      />

      <div className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>Configure your social media post generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Platforms</label>
                <div className="flex flex-wrap gap-4">
                  {(Object.keys(PlatformIcon) as Platform[]).map((platform) => {
                    const Icon = PlatformIcon[platform];
                    return (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform]);
                            } else {
                              setSelectedPlatforms(
                                selectedPlatforms.filter((p) => p !== platform)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={platform}
                          className="text-sm font-medium capitalize flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {platform}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Only</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">What would you like to post about?</label>
                <Textarea
                  placeholder="Describe your post content..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Scheduling */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Post</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setScheduledDate(new Date())}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? scheduledDate.toLocaleDateString() : "Select Date"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setScheduledDate(undefined)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Post Now
                  </Button>
                </div>
                {scheduledDate && (
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    className="rounded-md border"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={generatePost}
                disabled={!prompt || selectedPlatforms.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  "Generate Post"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Preview Section */}
          <Card className="md:col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="editor" className="mt-0">
                  {generatedPosts[0] && (
                    <div className="space-y-4">
                      <Textarea
                        className="min-h-[400px] font-mono"
                        value={generatedPosts[0].content}
                        readOnly
                      />
                      <div className="flex flex-wrap gap-2">
                        {generatedPosts[0].platforms.map((platform) => {
                          const Icon = PlatformIcon[platform];
                          return (
                            <div
                              key={platform}
                              className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold"
                            >
                              <Icon className="mr-1 h-3 w-3" />
                              {platform}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <ScrollArea className="h-[500px]">
                    {generatedPosts[0] && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {generatedPosts[0].platforms.map((platform) => {
                              const Icon = PlatformIcon[platform];
                              return (
                                <div
                                  key={platform}
                                  className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold"
                                >
                                  <Icon className="mr-1 h-3 w-3" />
                                  {platform}
                                </div>
                              );
                            })}
                          </div>
                          <div className="whitespace-pre-wrap">{generatedPosts[0].content}</div>
                        </div>
                        {generatedPosts[0].scheduledFor && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            Scheduled for: {generatedPosts[0].scheduledFor.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {generatedPosts.map((post) => (
                        <Card key={post.id}>
                          <CardHeader>
                            <div className="flex flex-wrap gap-2">
                              {post.platforms.map((platform) => {
                                const Icon = PlatformIcon[platform];
                                return (
                                  <div
                                    key={platform}
                                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold"
                                  >
                                    <Icon className="mr-1 h-3 w-3" />
                                    {platform}
                                  </div>
                                );
                              })}
                            </div>
                            <CardDescription>
                              {post.timestamp.toLocaleString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3">{post.content}</p>
                          </CardContent>
                          {post.scheduledFor && (
                            <CardFooter>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                Scheduled for: {post.scheduledFor.toLocaleString()}
                              </div>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
} 