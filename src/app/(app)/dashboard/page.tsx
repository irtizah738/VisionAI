
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Eye, MousePointerClick, Goal, TrendingUp, AlertCircle, ListChecks } from "lucide-react"; // LineChart icon removed from here as it's a component
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts"; // Added LineChart here
import type { ChartConfig } from "@/components/ui/chart";

const performanceChartData = [
  { date: "2024-07-01", value: 1200 },
  { date: "2024-07-02", value: 1500 },
  { date: "2024-07-03", value: 1300 },
  { date: "2024-07-04", value: 1700 },
  { date: "2024-07-05", value: 1600 },
  { date: "2024-07-06", value: 1900 },
  { date: "2024-07-07", value: 2100 },
];

const chartConfig: ChartConfig = {
  value: {
    label: "Performance",
    color: "hsl(var(--chart-1))",
  },
};

const kpis = [
  { title: "Impressions", value: "1.2M", icon: Eye, change: "+15%", changeType: "positive" as const },
  { title: "Engagement", value: "25K", icon: MousePointerClick, change: "+8%", changeType: "positive" as const },
  { title: "Conversions", value: "1,200", icon: Goal, change: "-2%", changeType: "negative" as const },
  { title: "ROI", value: "350%", icon: TrendingUp, change: "+5%", changeType: "positive" as const },
];

const aiNotifications = [
  { id: "1", message: "Campaign 'Summer Sale' has a 20% higher CTR on Instagram. Consider reallocating budget.", severity: "recommendation" },
  { id: "2", message: "Ad spend for 'New Product Launch' is pacing 15% faster than expected.", severity: "warning" },
  { id: "3", message: "Keyword 'AI Marketing' is trending up. Create content around this topic.", severity: "info" },
];

const activeCampaigns = [
  { id: "c1", name: "Q3 Content Push", progress: 75, status: "On Track" },
  { id: "c2", name: "Holiday Promo Alpha", progress: 30, status: "Needs Attention" },
  { id: "c3", name: "Brand Awareness Video", progress: 90, status: "Finishing Strong" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="VisionAI Dashboard"
        description="Your central hub for marketing intelligence and campaign oversight."
      />

      {/* KPI Statistics Panel */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-foreground">Key Performance Indicators</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Graph Section */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary" /> {/* Lucide icon for title */}
              Real-Time Performance Graph
            </CardTitle>
            <CardDescription>Overall marketing performance trend.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pr-2">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}> {/* Changed RechartsPrimitive.LineChart to LineChart */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} style={{ fontSize: '0.75rem' }} />
                  <YAxis style={{ fontSize: '0.75rem' }} />
                  <RechartsTooltip
                    content={<ChartTooltipContent indicator="line" />}
                    cursorStyle={{ stroke: "hsl(var(--foreground))", strokeWidth: 1, opacity: 0.3 }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-value)" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI-Generated Notifications & Active Campaigns */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                AI-Generated Notifications
              </CardTitle>
              <CardDescription>Insights and alerts for campaign improvements.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {aiNotifications.map((notification) => (
                  <li key={notification.id} className="flex items-start gap-3 text-sm">
                    <AlertCircle className={`h-5 w-5 mt-0.5 shrink-0 ${notification.severity === 'warning' ? 'text-yellow-500' : notification.severity === 'recommendation' ? 'text-green-500' : 'text-blue-500'}`} />
                    <span className="text-muted-foreground">{notification.message}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-primary" />
                Active Campaigns Progress
              </CardTitle>
              <CardDescription>Overview of ongoing initiatives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{campaign.name}</span>
                    <span className={`text-xs font-semibold ${campaign.status === "Needs Attention" ? "text-yellow-600" : "text-green-600"}`}>{campaign.status}</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" indicatorClassName={campaign.status === "Needs Attention" ? "bg-yellow-500" : "bg-green-500"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
