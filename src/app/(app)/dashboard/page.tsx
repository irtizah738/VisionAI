"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, BarChartHorizontalBig, Users, TrendingUp, CalendarDays, Activity, CheckCircle, Edit, Info, AlertTriangle, Lightbulb, UserCog, BarChart, LineChart as LineChartIconLucide, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const kpiData = [
  { title: "Total Impressions", value: "1.2M", change: "+5.2%", icon: Eye, description: "Total views of your ads/content." },
  { title: "Engagement Rate", value: "4.7%", change: "+0.8%", icon: Users, description: "Interactions vs. impressions." },
  { title: "Conversions", value: "350", change: "+15", icon: CheckCircle, description: "Desired actions completed." },
  { title: "ROI", value: "280%", change: "+12%", icon: DollarSign, description: "Return on investment." },
];

const revenueChartData = [
  { name: "Jan", revenue: 4000, previousRevenue: 3500 },
  { name: "Feb", revenue: 3000, previousRevenue: 2800 },
  { name: "Mar", revenue: 5000, previousRevenue: 4800 },
  { name: "Apr", revenue: 4500, previousRevenue: 4200 },
  { name: "May", revenue: 6000, previousRevenue: 5500 },
  { name: "Jun", revenue: 5800, previousRevenue: 6100 },
  { name: "Jul", revenue: 7000, previousRevenue: 6800 },
];

const chartConfig = {
  revenue: {
    label: "Current Revenue",
    color: "hsl(var(--chart-1))",
  },
  previousRevenue: {
    label: "Previous Revenue",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig;

const mockNotifications = [
    { id: "1", title: "Campaign 'Summer Sale' CPA high", description: "Consider adjusting bids or target audience.", icon: AlertTriangle, type: "warning" as const, actionText: "Review Campaign" , actionLink: "/campaigns" },
    { id: "2", title: "New Ad Creative performing well!", description: "Top 10% in CTR for 'Q3 Launch'.", icon: TrendingUp, type: "success" as const, actionText: "View Details", actionLink: "/campaigns"  },
    { id: "3", title: "Audience Segment 'Tech Enthusiasts' growing", description: "Engagement up by 15% this week.", icon: Users, type: "info" as const, actionText: "See Segment", actionLink: "/customer-segmentation"  },
];

const mockActiveCampaigns = [
    { id: "camp1", name: "Q4 Holiday Push", progress: 75, status: "On Track", endDate: "2024-12-20" },
    { id: "camp2", name: "New Year Product Teaser", progress: 30, status: "Needs Attention", endDate: "2025-01-15" },
    { id: "camp3", name: "Brand Awareness - Phase 2", progress: 90, status: "Exceeding Goals", endDate: "2024-11-30" },
];

// Placeholder AI Assistant Chat Component
function AIAssistantChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm your VisionAI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { from: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          mode: "general",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      setMessages((msgs) => [...msgs, { from: "ai", text: data.content }]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages((msgs) => [
        ...msgs,
        { from: "ai", text: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>VisionAI Assistant</CardTitle>
        <CardDescription>Ask anything about your marketing, campaigns, or get AI-powered suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="h-64 overflow-y-auto bg-muted rounded p-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.from === "user" ? "bg-primary text-primary-foreground" : "bg-white text-black border"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg max-w-xs bg-white text-black border">
              Thinking...
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  // Empty state placeholders
  return (
    <>
      <PageHeader
        title="Welcome to VisionAI Dashboard"
        description="Your central hub for marketing intelligence and campaign oversight."
      />

      {/* KPI Statistics Panel - Empty State */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-medium">KPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground">No data</p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground pt-1 pb-3">
              Data will appear here when available.
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Sections - Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Real-Time Performance Graph - Empty State */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Revenue Performance</CardTitle>
            <CardDescription>No data to display. Connect your data source.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
            <span>No chart data available.</span>
          </CardContent>
        </Card>

        {/* AI Notifications & Insights - Empty State */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>AI Notifications & Insights</CardTitle>
            <CardDescription>Actionable alerts and suggestions from VisionAI will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-muted-foreground">
            <span>No notifications yet.</span>
            <Button variant="outline" className="w-full mt-2" onClick={() => router.push('/ai-assistant')}>
              Go to AI Assistant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns Progress - Empty State */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Active Campaigns Snapshot</CardTitle>
          <CardDescription>Quick overview of ongoing marketing efforts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <span>No active campaigns currently.</span>
        </CardContent>
        <CardFooter>
          <Button className="w-full sm:w-auto" onClick={() => router.push('/campaigns')}>
            Manage All Campaigns
          </Button>
        </CardFooter>
      </Card>

      {/* AI Features Entry Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Blog Generator</CardTitle>
            <CardDescription>Generate blog content with AI.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/blog-generator')}>Try Blog Generator</Button>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Subject Line Generator</CardTitle>
            <CardDescription>Get AI-powered email subject lines.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/subject-line-generator')}>Try Subject Line Generator</Button>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Chat Assistant</CardTitle>
            <CardDescription>Ask VisionAI anything.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/ai-assistant')}>Open Chat Assistant</Button>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>More AI Tools</CardTitle>
            <CardDescription>Explore additional AI features.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/ai-tools')}>Explore AI Tools</Button>
          </CardFooter>
        </Card>
      </div>

      {/* User-Facing AI Assistant/Chat Interface */}
      <AIAssistantChat />
    </>
  );
}
