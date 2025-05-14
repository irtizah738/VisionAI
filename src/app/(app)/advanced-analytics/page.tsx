
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, BarChart, LineChart, PieChartIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Pie, Cell, Line } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";


const behaviorChartData = [
  { segment: "Segment A", engagement: 65, conversion: 40 },
  { segment: "Segment B", engagement: 78, conversion: 55 },
  { segment: "Segment C", engagement: 50, conversion: 30 },
  { segment: "Segment D", engagement: 85, conversion: 60 },
];

const trendChartData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 600 },
  { month: "Apr", value: 800 },
  { month: "May", value: 500 },
  { month: "Jun", value: 700 },
];

const chartConfig: ChartConfig = {
  engagement: {
    label: "Engagement",
    color: "hsl(var(--chart-1))",
  },
  conversion: {
    label: "Conversion",
    color: "hsl(var(--chart-2))",
  },
  value: {
    label: "Trend Value",
    color: "hsl(var(--chart-3))",
  }
};


export default function AdvancedAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="AI Insights & Advanced Analytics"
        description="Comprehensive reporting with AI-driven insights and user-friendly dashboards."
      />
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Customer Behavior Predictions
            </CardTitle>
            <CardDescription>
              AI-generated predictions on customer actions and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Based on historical data and current trends, VisionAI predicts that customers in Segment X are 30% more likely to respond to offers related to 'New Technology'. Consider tailoring your upcoming campaign for this segment.
            </p>
            <p className="text-sm text-muted-foreground">
              <em>Further details and specific customer lists can be explored in the CRM section.</em>
            </p>
            <div className="mt-6 h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={behaviorChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis />
                    <RechartsTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversion" fill="var(--color-conversion)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Market Trend Analysis
            </CardTitle>
            <CardDescription>
              Identify emerging trends and shifts in the market landscape.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Current market analysis indicates a growing interest in 'Sustainable Marketing Practices'. This trend has seen a 25% increase in search volume over the last quarter.
            </p>
            <p className="text-sm text-accent">
              <strong>Recommendation:</strong> Consider incorporating sustainability themes into your upcoming content strategy.
            </p>
             <div className="mt-6 h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={trendChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip content={<ChartTooltipContent indicator="line" />} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-primary" />
              Custom Report Builder
            </CardTitle>
            <CardDescription>
              Generate tailored reports based on specific metrics and dimensions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Utilize the report builder to create custom dashboards focusing on KPIs that matter most to your business. (Reporting tools and visualizations will be available here).
            </p>
            <div className="mt-4 p-8 border border-dashed rounded-md flex items-center justify-center h-48 bg-muted/50">
                <p className="text-muted-foreground text-center">Chart/Report Builder Interface Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
