
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Added
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailPlus, Users, TestTube2, Send, Eye, BarChart3, Zap, Edit3, ListChecks, LineChart as LineChartIcon, Loader2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { generateSubjectLinesAction } from "./actions"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const emailPerformanceData = [
  { date: "Wk 1", openRate: 22, clickRate: 3.5 },
  { date: "Wk 2", openRate: 25, clickRate: 4.1 },
  { date: "Wk 3", openRate: 23, clickRate: 3.8 },
  { date: "Wk 4", openRate: 27, clickRate: 4.5 },
];

const chartConfig: ChartConfig = {
  openRate: {
    label: "Open Rate (%)",
    color: "hsl(var(--chart-1))",
  },
  clickRate: {
    label: "Click Rate (%)",
    color: "hsl(var(--chart-2))",
  },
};

const mockCampaigns = [
  { id: "1", name: "Welcome Series - Email 1", status: "Active", sent: 1500, openRate: "35%", clickRate: "5.2%" },
  { id: "2", name: "Product Update - July", status: "Sent", sent: 12500, openRate: "22%", clickRate: "3.1%" },
  { id: "3", name: "Summer Promo Newsletter", status: "Draft", sent: 0, openRate: "N/A", clickRate: "N/A" },
  { id: "4", name: "Abandoned Cart Reminder", status: "Active", sent: 850, openRate: "45%", clickRate: "8.0%" },
];


export default function EmailMarketingPage() {
  const router = useRouter(); // Added
  const [subjectLineTopic, setSubjectLineTopic] = useState("");
  const [generatedSubjectLines, setGeneratedSubjectLines] = useState<string[]>([]);
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [subjectError, setSubjectError] = useState<string | null>(null);

  const [emailBodyPrompt, setEmailBodyPrompt] = useState("");
  const [generatedEmailBody, setGeneratedEmailBody] = useState<string | null>(null);
  const [isEmailBodyLoading, setIsEmailBodyLoading] = useState(false);
  const [emailBodyError, setEmailBodyError] = useState<string | null>(null);


  const handleGenerateSubjects = async () => {
    if (!subjectLineTopic.trim()) {
      setSubjectError("Please enter a topic for subject lines.");
      return;
    }
    setIsSubjectLoading(true);
    setSubjectError(null);
    setGeneratedSubjectLines([]);

    const result = await generateSubjectLinesAction({ topic: subjectLineTopic });

    if ('error' in result) {
      setSubjectError(result.error);
    } else {
      setGeneratedSubjectLines(result.subjectLines);
    }
    setIsSubjectLoading(false);
  };
  
  const handleGenerateEmailBody = async () => {
    if (!emailBodyPrompt.trim()) {
      setEmailBodyError("Please describe the email's purpose.");
      return;
    }
    setIsEmailBodyLoading(true);
    setEmailBodyError(null);
    setGeneratedEmailBody(null);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setGeneratedEmailBody(`AI-Generated Email Body based on: "${emailBodyPrompt}"\n\nDear [Name],\n\nWe're excited to share some groundbreaking updates that will revolutionize how you approach [topic related to prompt]. Our team has been hard at work developing new features...\n\nSincerely,\nThe VisionAI Team`);
    setIsEmailBodyLoading(false);
  };


  return (
    <>
      <PageHeader
        title="Email Automation Suite"
        description="Personalized campaigns with A/B testing and AI-powered enhancements."
      />
      <div className="space-y-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full justify-start text-base py-6" onClick={() => router.push('/campaign-builder')}>
              <MailPlus className="mr-3 h-5 w-5" /> Create New Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start text-base py-6" onClick={() => router.push('/customer-segmentation')}>
              <Users className="mr-3 h-5 w-5" /> Manage Audiences
            </Button>
            <Button variant="outline" className="w-full justify-start text-base py-6" onClick={() => console.log("View A/B Tests clicked")}>
              <TestTube2 className="mr-3 h-5 w-5" /> View A/B Tests
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              Campaigns Overview
            </CardTitle>
            <CardDescription>Monitor your ongoing and recent email campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns.map(campaign => (
                <div key={campaign.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-semibold text-lg">{campaign.name}</h4>
                    <Badge variant={campaign.status === "Active" ? "default" : campaign.status === "Draft" ? "secondary" : "outline"}
                           className={campaign.status === "Active" ? "bg-green-500 hover:bg-green-600" : campaign.status === "Draft" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm text-muted-foreground">
                    <p><Send className="inline h-4 w-4 mr-1" />Sent: {campaign.sent.toLocaleString()}</p>
                    <p><Eye className="inline h-4 w-4 mr-1" />Open Rate: {campaign.openRate}</p>
                    <p><BarChart3 className="inline h-4 w-4 mr-1" />Click Rate: {campaign.clickRate}</p>
                    <Button size="sm" variant="ghost" className="sm:ml-auto h-auto p-1 text-primary hover:text-primary/80" onClick={() => console.log(`View details for ${campaign.name}`)}>View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-6 w-6 text-primary" />
                    Performance Snapshot
                </CardTitle>
                <CardDescription>Key email marketing metrics at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/40">
                        <p className="text-sm text-muted-foreground">Total Subscribers</p>
                        <p className="text-2xl font-bold">25,830</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted/40">
                        <p className="text-sm text-muted-foreground">Avg. Open Rate (Last 30d)</p>
                        <p className="text-2xl font-bold">24.5%</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted/40">
                        <p className="text-sm text-muted-foreground">Avg. Click-Through Rate (Last 30d)</p>
                        <p className="text-2xl font-bold">4.2%</p>
                    </div>
                </div>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emailPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="openRate" stroke="var(--color-openRate)" name="Open Rate (%)" />
                        <Line yAxisId="right" type="monotone" dataKey="clickRate" stroke="var(--color-clickRate)" name="Click Rate (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              AI-Powered Email Tools
            </CardTitle>
            <CardDescription>Enhance your emails with AI assistance.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-3">
              <Label htmlFor="aiSubject" className="text-base font-medium">AI Subject Line Generator</Label>
              <Input 
                id="aiSubject" 
                placeholder="Enter email topic or keywords..." 
                value={subjectLineTopic}
                onChange={(e) => setSubjectLineTopic(e.target.value)}
                disabled={isSubjectLoading}
              />
              <Button 
                onClick={handleGenerateSubjects} 
                disabled={isSubjectLoading || !subjectLineTopic.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSubjectLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Generate Subject Lines
              </Button>
              {subjectError && (
                 <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{subjectError}</AlertDescription>
                  </Alert>
              )}
              {generatedSubjectLines.length > 0 && (
                <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground min-h-[60px] mt-2">
                  <p className="font-medium">Suggestions:</p>
                  <ul className="list-disc list-inside pl-2">
                    {generatedSubjectLines.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="aiBody" className="text-base font-medium">AI Email Body Assistant</Label>
              <Textarea 
                id="aiBody" 
                placeholder="Describe the email's purpose, key points, and desired tone..." 
                className="min-h-[100px]" 
                value={emailBodyPrompt}
                onChange={(e) => setEmailBodyPrompt(e.target.value)}
                disabled={isEmailBodyLoading}
              />
              <Button 
                onClick={handleGenerateEmailBody} 
                disabled={isEmailBodyLoading || !emailBodyPrompt.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isEmailBodyLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                 <Edit3 className="mr-2 h-4 w-4" />
                )}
                Draft Email Body (AI)
              </Button>
              {emailBodyError && (
                 <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{emailBodyError}</AlertDescription>
                  </Alert>
              )}
               {generatedEmailBody && (
                <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground min-h-[60px] mt-2 whitespace-pre-wrap">
                  <p className="font-medium">Generated Snippet:</p>
                  {generatedEmailBody}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
