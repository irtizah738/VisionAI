
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, BarChartHorizontalBig, Users, TrendingUp, CalendarDays, Activity, CheckCircle, Edit, Info, AlertTriangle, Lightbulb, UserCog, BarChart, LineChart as LineChartIconLucide, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation"; // Added

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


export default function DashboardPage() {
  const router = useRouter(); // Added

  return (
    <>
      <PageHeader
        title="Welcome to VisionAI Dashboard"
        description="Your central hub for marketing intelligence and campaign oversight."
      />

      {/* KPI Statistics Panel */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.change}
              </p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground pt-1 pb-3">
              {kpi.description}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Real-Time Performance Graph */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIconLucide className="h-6 w-6 text-primary" />
              Revenue Performance
            </CardTitle>
            <CardDescription>Comparison of revenue over the last 7 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pr-2">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '0.75rem' }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '0.75rem' }} tickFormatter={(value) => `$${value / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-revenue)" }} activeDot={{ r: 6 }} name="Current Revenue" />
                  <Line type="monotone" dataKey="previousRevenue" stroke="var(--color-previousRevenue)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: "var(--color-previousRevenue)" }} activeDot={{ r: 6 }} name="Previous Period" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI-Generated Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              AI Notifications & Insights
            </CardTitle>
            <CardDescription>Actionable alerts and suggestions from VisionAI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotifications.map(notification => (
                <div key={notification.id} className={`p-3 rounded-md border-l-4 ${notification.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10' : notification.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
                    <div className="flex items-start gap-2">
                        <notification.icon className={`h-5 w-5 mt-0.5 ${notification.type === 'warning' ? 'text-yellow-600' : notification.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}/>
                        <div>
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            {notification.actionText && (
                                <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs text-primary hover:underline" onClick={() => router.push(notification.actionLink || '#')}>
                                    {notification.actionText} <ArrowRight className="ml-1 h-3 w-3"/>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
             <Button variant="outline" className="w-full mt-2" onClick={() => router.push('/ai-assistant')}>
                View All Notifications
             </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Campaigns Progress */}
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Active Campaigns Snapshot
          </CardTitle>
          <CardDescription>Quick overview of ongoing marketing efforts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {mockActiveCampaigns.map(campaign => (
                 <div key={campaign.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${campaign.status === "On Track" ? "bg-blue-100 text-blue-700" : campaign.status === "Needs Attention" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {campaign.status}
                        </span>
                    </div>
                    <Progress value={campaign.progress} className="h-2 mb-1" indicatorClassName={campaign.status === "Needs Attention" ? "bg-red-500" : campaign.status === "Exceeding Goals" ? "bg-green-500" : "bg-blue-500"} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Ends: {campaign.endDate}</span>
                        <span>{campaign.progress}% complete</span>
                    </div>
                     <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto" onClick={() => router.push('/campaigns')}>
                        View Details
                    </Button>
                 </div>
            ))}
             {mockActiveCampaigns.length === 0 && <p className="text-muted-foreground">No active campaigns currently.</p>}
        </CardContent>
        <CardFooter>
            <Button className="w-full sm:w-auto" onClick={() => router.push('/campaigns')}>
                Manage All Campaigns
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
