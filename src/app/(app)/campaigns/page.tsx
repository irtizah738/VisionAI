"use client";

import { Users, BarChart3, Activity, Twitter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const adPerformanceData = [
  { campaign: "Summer Sale", spend: 2000, clicks: 15000, ctr: 7.5 },
  { campaign: "New Product Launch", spend: 3500, clicks: 25000, ctr: 7.1 },
  { campaign: "Holiday Promo", spend: 1500, clicks: 10000, ctr: 6.6 },
  { campaign: "Brand Awareness", spend: 5000, clicks: 30000, ctr: 6.0 },
];

const chartConfig: ChartConfig = {
  spend: {
    label: "Spend ($)",
    color: "hsl(var(--chart-1))",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-2))",
  },
};

const twitterMentions = [
  { user: "@happycustomer", text: "Just love the new VisionAI product! #VisionAIrocks", time: "2m ago" },
  { user: "@techreviewer", text: "Checking out @VisionAI's latest features, impressive stuff!", time: "5m ago" },
  { user: "@marketingguru", text: "Heard great things about VisionAI, might give it a try for my next campaign.", time: "10m ago" },
  { user: "@anotheruser", text: "VisionAI is a game changer for marketers!", time: "15m ago" },
];

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campaign Management"
        description="Monitor and analyze your social media campaigns."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follower Counts</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">+5.2% this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Performance (Avg. CTR)</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.8%</div>
            <p className="text-xs text-muted-foreground">+0.5% vs last campaign</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Analysis (Visits)</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250.K</div>
            <p className="text-xs text-muted-foreground">+15% from social media</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ad Spend vs. Clicks</CardTitle>
            <CardDescription>Comparison of spending and clicks for recent campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={adPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="campaign" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.split(" ")[0]}/>
                <YAxis yAxisId="left" orientation="left" stroke="var(--color-spend)" tickFormatter={(value) => `$${value/1000}k`}/>
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-clicks)" tickFormatter={(value) => `${value/1000}k`}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="spend" fill="var(--color-spend)" radius={4} />
                <Bar yAxisId="right" dataKey="clicks" fill="var(--color-clicks)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-500" />
              Real-time Twitter Mentions
            </CardTitle>
            <CardDescription>Latest mentions of your brand on Twitter.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {twitterMentions.map((mention, index) => (
                <li key={index} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mention.user}</span>
                    <span className="text-xs text-muted-foreground">{mention.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{mention.text}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
