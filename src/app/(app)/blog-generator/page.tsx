"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Download, History } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
};

export default function BlogGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState("editor");

  const generateBlog = async () => {
    if (!topic) return;
    setIsGenerating(true);

    try {
      // TODO: Replace with actual API call to your AI backend
      const response = await new Promise<BlogPost>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            title: `${topic} - A Comprehensive Guide`,
            content: "This is a placeholder blog post. Connect to your AI backend for real content generation.",
            timestamp: new Date(),
          });
        }, 2000);
      });

      setGeneratedPosts((prev) => [response, ...prev]);
      setActiveTab("preview");
    } catch (error) {
      console.error("Failed to generate blog post:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const downloadAsMarkdown = (post: BlogPost) => {
    const markdown = `# ${post.title}\n\n${post.content}`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <PageHeader
        title="Blog Generator"
        description="Generate high-quality blog posts with AI"
      />

      <div className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Blog Settings</CardTitle>
              <CardDescription>Configure your blog post generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  placeholder="Enter your blog topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords (comma-separated)</label>
                <Input
                  placeholder="SEO, marketing, strategy..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

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
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Length (words): {length}</label>
                <Slider
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                  min={300}
                  max={2000}
                  step={100}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={generateBlog}
                disabled={!topic || isGenerating}
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Blog Post
                  </>
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(generatedPosts[0].content)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => downloadAsMarkdown(generatedPosts[0])}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <ScrollArea className="h-[500px]">
                    {generatedPosts[0] && (
                      <article className="prose prose-sm dark:prose-invert max-w-none">
                        <h1>{generatedPosts[0].title}</h1>
                        <p>{generatedPosts[0].content}</p>
                      </article>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {generatedPosts.map((post) => (
                        <Card key={post.id}>
                          <CardHeader>
                            <CardTitle className="text-base">{post.title}</CardTitle>
                            <CardDescription>
                              {post.timestamp.toLocaleString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3">{post.content}</p>
                          </CardContent>
                          <CardFooter>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(post.content)}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadAsMarkdown(post)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </CardFooter>
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
