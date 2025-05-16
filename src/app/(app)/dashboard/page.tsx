
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, LineChart as LineChartIconLucide, Users, TrendingUp, CalendarDays } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import Image from "next/image";

const kpiData = [
  { title: "Total Revenue", value: "$125,670", change: "+12.5%", icon: DollarSign },
  { title: "Impressions", value: "2.3M", change: "+8.2%", icon: Eye },
  { title: "Active Users", value: "1,450", change: "-1.5%", icon: Users },
];

const revenueChartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5800 },
  { name: "Jul", revenue: 7000 },
];

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

const mockCampaigns = [
    { name: "Summer Sale Fiesta", cta: "View Details", status: "Active", progress: 75, details: "Impressions: 500K, CTR: 2.5%" },
    { name: "Q3 Product Launch", cta: "Review Performance", status: "Completed", progress: 100, details: "Conversions: 1.2K, ROI: 250%" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your marketing performance."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIconLucide className="h-6 w-6 text-primary" />
            Revenue
          </CardTitle>
          <CardDescription>Last 7 Months Performance</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pr-2">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" style={{ fontSize: '0.75rem' }} />
                <YAxis style={{ fontSize: '0.75rem' }} tickFormatter={(value) => `$${value / 1000}k`} />
                <RechartsTooltip
                  content={<ChartTooltipContent indicator="line" />}
                  cursorStyle={{ stroke: "hsl(var(--foreground))", strokeWidth: 1, opacity: 0.3 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-revenue)" }} activeDot={{ r: 6 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        {mockCampaigns.map((campaign) => (
            <Card key={campaign.name} className="shadow-lg">
                <CardHeader>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>{campaign.details}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" size="sm">{campaign.cta}</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </>
  );
}
