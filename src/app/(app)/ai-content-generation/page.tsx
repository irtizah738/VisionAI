
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Wand2, Lightbulb, Loader2 } from "lucide-react";

export default function AiContentGenerationPage() {
  const [contentType, setContentType] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [tone, setTone] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateContent = async () => {
    if (!prompt.trim() || !contentType) {
        // Basic validation
        setGeneratedContent("Please select a content type and provide a prompt.");
        return;
    }
    setIsLoading(true);
    setGeneratedContent("");
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    const exampleContent = `AI-Generated ${contentType} about "${prompt}" (Tone: ${tone || 'Default'}):\n\nThis is a sample output. In a real application, AI would generate compelling content based on your inputs. For instance, if you asked for a blog post idea about 'sustainable fashion', the AI might suggest:\n\nTitle: "5 Ways to Embrace Sustainable Fashion Without Breaking the Bank"\n\nKey Points:\n1. Thrifting and second-hand shopping.\n2. Investing in quality, durable pieces.\n3. Supporting ethical and transparent brands.\n4. DIY and upcycling old clothes.\n5. Renting outfits for special occasions.`;
    setGeneratedContent(exampleContent);
    setIsLoading(false);
  };

  return (
    <>
      <PageHeader
        title="AI Content Generation Studio"
        description="Craft compelling marketing copy, blog ideas, social media updates, and more with the power of AI."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Content Creation Toolkit
            </CardTitle>
            <CardDescription>
              Select your content type, provide a prompt, choose a tone, and let VisionAI do the heavy lifting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blog Post Idea">Blog Post Idea</SelectItem>
                    <SelectItem value="Social Media Post (Twitter)">Social Media Post (Twitter)</SelectItem>
                    <SelectItem value="Social Media Post (LinkedIn)">Social Media Post (LinkedIn)</SelectItem>
                    <SelectItem value="Ad Headline">Ad Headline</SelectItem>
                    <SelectItem value="Product Description">Product Description</SelectItem>
                    <SelectItem value="Email Subject Line">Email Subject Line</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tone">Tone of Voice (Optional)</Label>
                 <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Witty">Witty</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="prompt">Your Prompt / Topic / Instructions</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Write a catchy Twitter post about our new eco-friendly product launch targeting millennials.' or 'Brainstorm blog post ideas for sustainable travel.'"
                className="min-h-[120px]"
                disabled={isLoading}
              />
            </div>
            
            <Button onClick={handleGenerateContent} disabled={isLoading || !prompt.trim() || !contentType} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            {generatedContent && (
              <div className="pt-4">
                <Label htmlFor="generatedOutput" className="text-base font-medium">AI Generated Output:</Label>
                <Textarea
                  id="generatedOutput"
                  value={generatedContent}
                  readOnly
                  className="min-h-[200px] bg-muted/50 mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Prompting Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Be Specific:</strong> The more detail you provide, the better the AI can understand your needs.
              Mention target audience, desired length, key message, and any constraints.
            </p>
            <p>
              <strong>Use Keywords:</strong> Include relevant keywords you want the AI to focus on.
            </p>
            <p>
              <strong>Define the Goal:</strong> What do you want this content to achieve? (e.g., drive engagement, inform, sell).
            </p>
            <p>
              <strong>Iterate:</strong> If the first result isn't perfect, try refining your prompt and generating again.
            </p>
            <p>
              <strong>Example Prompt:</strong>
              <span className="block mt-1 p-2 bg-muted/70 rounded-md text-xs">
                "Create three attention-grabbing Facebook ad headlines for a new online course on digital photography. Target beginners. Focus on ease of learning and achieving professional results quickly."
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
