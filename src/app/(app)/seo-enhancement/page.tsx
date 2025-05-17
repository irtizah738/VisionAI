
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { KeyRound, FileSearch2, MonitorSmartphone, ListChecks, Lightbulb, Search, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Added
import { useRouter } from "next/navigation"; // Added

export default function SeoEnhancementPage() {
  const [serpTitle, setSerpTitle] = useState("Your Awesome Page Title | Your Brand");
  const [serpUrl, setSerpUrl] = useState("https://yourbrand.com/your-awesome-page");
  const [serpDescription, setSerpDescription] = useState("This is an engaging and SEO-friendly meta description for your awesome page, highlighting key benefits and encouraging clicks from search results.");
  const [auditUrl, setAuditUrl] = useState("");
  const [auditResults, setAuditResults] = useState<null | { score: number; issues: { title: string; status: 'Good' | 'Needs Improvement' | 'Critical'; details: string }[] }>(null);
  const { toast } = useToast(); // Added
  const router = useRouter(); // Added

  const handleRunAudit = () => {
    if (!auditUrl) {
        setAuditResults({
            score: 0,
            issues: [{title: "Error", status: "Critical", details: "Please enter a URL to audit."}]
        });
        toast({ title: "Audit Error", description: "Please enter a URL to audit.", variant: "destructive"});
        return;
    }
    toast({ title: "Audit Running", description: `Running SEO audit for ${auditUrl} (Simulated)...`});
    // Simulated AI Audit
    setAuditResults({
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-99
      issues: [
        { title: "Page Load Speed", status: Math.random() > 0.3 ? "Good" : "Needs Improvement", details: "Aim for <2s LCP. Current: 2.8s (Simulated)" },
        { title: "Mobile Friendliness", status: "Good", details: "Page is responsive and mobile-friendly. (Simulated)" },
        { title: "SSL Certificate", status: "Good", details: "HTTPS is enabled and secure. (Simulated)" },
        { title: "Meta Title & Description", status: Math.random() > 0.5 ? "Good" : "Needs Improvement", details: "Meta tags are present and within length limits. (Simulated)" },
        { title: "Broken Links", status: "Good", details: "No broken internal links found. (Simulated)" },
      ]
    });
  };


  return (
    <>
      <PageHeader
        title="Advanced SEO Tools"
        description="Enhance your SEO with long-tail keywords, content gap analysis, SERP previews, and technical audits."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Long-Tail Keyword Generator */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              Long-Tail Keyword Generator
            </CardTitle>
            <CardDescription>
              Discover valuable long-tail keywords for your content strategy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seedKeyword">Seed Keyword / Topic</Label>
              <Input id="seedKeyword" placeholder="e.g., 'digital marketing strategies'" />
            </div>
            <div className="pt-2">
              <h4 className="font-semibold text-sm mb-2">AI Generated Ideas (Simulated):</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
                <li>"best digital marketing strategies for small business"</li>
                <li>"how to measure digital marketing roi"</li>
                <li>"latest digital marketing trends for b2b"</li>
                <li>"affordable digital marketing tools for startups"</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => toast({ title: "Generating Keywords", description: "AI is generating keyword ideas (Simulated)..."})}>
              <Lightbulb className="mr-2 h-4 w-4" /> Generate Keywords (AI Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* Content Gap Analyzer */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch2 className="h-6 w-6 text-primary" />
              Content Gap Analyzer
            </CardTitle>
            <CardDescription>
              Identify topics your competitors cover that you might be missing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="yourDomain">Your Domain</Label>
              <Input id="yourDomain" placeholder="e.g., https://yourbrand.com" />
            </div>
            <div>
              <Label htmlFor="competitorDomain">Competitor Domain</Label>
              <Input id="competitorDomain" placeholder="e.g., https://competitor.com" />
            </div>
             <div className="pt-2">
              <h4 className="font-semibold text-sm mb-2">Potential Gaps (Simulated):</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
                <li>"Topic: AI in Customer Service" (Competitor ranks, you don't)</li>
                <li>"Keyword: 'Future of E-commerce Personalization'"</li>
                <li>"Content Type: Video Tutorials for Product X"</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => toast({ title: "Finding Gaps", description: "AI is analyzing content gaps (Simulated)..."})}>
              <Search className="mr-2 h-4 w-4" /> Find Content Gaps (AI Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* SERP Preview Tool */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorSmartphone className="h-6 w-6 text-primary" />
              SERP Preview Tool
            </CardTitle>
            <CardDescription>
              Visualize how your page might appear in Google search results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="serpTitle">Page Title</Label>
                  <Input id="serpTitle" value={serpTitle} onChange={(e) => setSerpTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="serpUrl">URL</Label>
                  <Input id="serpUrl" value={serpUrl} onChange={(e) => setSerpUrl(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="serpDescription">Meta Description</Label>
                  <Textarea id="serpDescription" value={serpDescription} onChange={(e) => setSerpDescription(e.target.value)} className="min-h-[100px]" />
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg shadow-inner">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Google SERP Preview:</h4>
                <div className="p-3 bg-background rounded-md border space-y-0.5">
                  <a href={serpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 text-lg hover:underline truncate block">
                    {serpTitle || "Your Page Title"}
                  </a>
                  <p className="text-green-700 text-sm truncate block">{serpUrl || "https://yourbrand.com/your-page"}</p>
                  <p className="text-gray-700 text-sm leading-tight line-clamp-2">
                    {serpDescription || "Your compelling meta description will appear here. Make it count!"}
                  </p>
                </div>
                 <p className="text-xs text-muted-foreground mt-3 text-center">This is a simplified preview. Actual appearance may vary.</p>
              </div>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => console.log("SERP Preview updated with current input values.")}>
                Update Live Preview
            </Button>
          </CardFooter>
        </Card>
        
        {/* Technical SEO Quick Audit */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              Technical SEO Quick Audit
            </CardTitle>
            <CardDescription>
              Get a quick, AI-simulated overview of potential technical SEO issues for any URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                id="auditUrl" 
                type="url" 
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                placeholder="e.g., https://yourwebsite.com" 
                className="flex-grow"
              />
              <Button onClick={handleRunAudit}>
                <Search className="mr-2 h-4 w-4" /> Run Audit (AI Simulated)
              </Button>
            </div>
            {auditResults && (
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">Audit Results for: <span className="text-primary truncate">{auditUrl || "N/A"}</span></h4>
                    <Badge variant={auditResults.score > 80 ? "default" : auditResults.score > 60 ? "secondary" : "destructive"} className={auditResults.score > 80 ? "bg-green-500" : auditResults.score > 60 ? "bg-yellow-500" : ""}>
                        Score: {auditResults.score}/100
                    </Badge>
                </div>
                <div className="space-y-3">
                  {auditResults.issues.map((issue, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-md border">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{issue.title}</p>
                        <Badge variant={issue.status === "Good" ? "default" : issue.status === "Needs Improvement" ? "secondary" : "destructive"}  className={issue.status === "Good" ? "bg-green-500" : issue.status === "Needs Improvement" ? "bg-yellow-500" : ""}>
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{issue.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => router.push('/seo-enhancement/technical-report')}>
                <ExternalLink className="mr-2 h-4 w-4" /> View Full Technical Report
            </Button>
          </CardFooter>
        </Card>

      </div>
    </>
  );
}
