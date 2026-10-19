"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Store,
  DollarSign,
  ShoppingCart,
  Users,
  Sparkles,
  Percent,
  LineChart as LineChartIcon,
  Send,
  RefreshCw,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const salesTrendData = [
  { month: "Jan", sales: 42000, profit: 26400 },
  { month: "Feb", sales: 48500, profit: 31200 },
  { month: "Mar", sales: 56200, profit: 37800 },
  { month: "Apr", sales: 61800, profit: 41900 },
  { month: "May", sales: 74900, profit: 51400 },
  { month: "Jun", sales: 89400, profit: 62800 },
];

const topProductsData = [
  {
    id: "SKU-01",
    name: "VisionAI Enterprise Suite (Annual)",
    unitsSold: 142,
    revenue: 170400,
    conversionRate: "5.8%",
  },
  {
    id: "SKU-02",
    name: "Growth Team Omnichannel Plan",
    unitsSold: 380,
    revenue: 113620,
    conversionRate: "6.4%",
  },
  {
    id: "SKU-03",
    name: "Agency Multi-Brand Add-On",
    unitsSold: 215,
    revenue: 64285,
    conversionRate: "4.9%",
  },
  {
    id: "SKU-04",
    name: "Dedicated AI Brand Voice Fine-Tuning",
    unitsSold: 94,
    revenue: 46906,
    conversionRate: "4.2%",
  },
];

const chartConfig: ChartConfig = {
  sales: {
    label: "Gross Revenue ($)",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Net Margin ($)",
    color: "hsl(var(--chart-2))",
  },
};

export default function EcommerceAnalyticsPage() {
  const { toast } = useToast();
  const [launchingPromo, setLaunchingPromo] = useState<string | null>(null);

  const handleLaunchProductPromo = async (productName: string, offer: string) => {
    setLaunchingPromo(productName);
    try {
      const copy = `⚡ Limited-Time Offer on ${productName}: ${offer}\n\nSee how high-velocity teams scale social attribution at https://visionai.studio/store #SocialCommerce #GrowthMarketing`;
      const [postRes, campRes] = await Promise.all([
        fetch("/api/social/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: copy,
            platforms: ["twitter", "linkedin", "instagram"],
            publishNow: false,
            scheduledTime: "Today, 4:00 PM (Peak Conversion Window)",
          }),
        }),
        fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Promo: ${productName}`,
            description: offer,
            type: "multi-channel",
            status: "active",
            budget: 5000,
            channels: ["twitter", "linkedin", "instagram"],
          }),
        }),
      ]);

      if (!postRes.ok || !campRes.ok) {
        throw new Error("Failed to launch promotion");
      }

      toast({
        title: "Product Promotion Queued & Active",
        description: `Launched "${productName}" across your Campaigns and Social Queue.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Promotion Error",
        description: error?.message || "Could not launch product promo.",
      });
    } finally {
      setLaunchingPromo(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-Commerce & Social Commerce Revenue Lab"
        description="Track social-attributed revenue, SKU conversion velocity, and 1-click launch promotional campaigns."
        icon={Store}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Social-Attributed Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              $395,211
            </div>
            <p className="text-xs text-emerald-500 mt-1">
              +24.8% vs. prior 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Average Order Value (AOV)
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              $475.50
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +8.2% from bundle offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Link Card Checkout Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              5.42%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +1.1% from fold-optimized hooks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Paying Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              1,842
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              94.6% net retention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LineChartIcon className="h-5 w-5 text-primary" />
            Monthly Revenue &amp; Net Margin Velocity
          </CardTitle>
          <CardDescription className="text-xs">
            Attributed revenue growth across social link cards and email sequences.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" style={{ fontSize: "11px" }} />
                <YAxis
                  style={{ fontSize: "11px" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <RechartsTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-sales)"
                  strokeWidth={2.5}
                  name="Gross Revenue ($)"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-profit)"
                  strokeWidth={2.5}
                  name="Net Margin ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">
              Top Performing Offerings (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2.5 px-3 font-medium">Offering / SKU</th>
                    <th className="py-2.5 px-3 font-medium text-right">
                      Units
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right">
                      Conv. Rate
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topProductsData.map((prod) => (
                    <tr key={prod.id} className="hover:bg-muted/30">
                      <td className="py-3 px-3 font-medium">{prod.name}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-xs">
                        {prod.unitsSold}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-emerald-500">
                        {prod.conversionRate}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-xs font-semibold">
                        ${prod.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              1-Click AI Revenue Promotions
            </CardTitle>
            <CardDescription className="text-xs">
              Deploy high-converting social + campaign promotions directly from product telemetry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                sku: "Growth Team Omnichannel Plan",
                offer:
                  "15% Annual Upgrade Bonus + Free Multi-Network Truncation Audit",
              },
              {
                sku: "Agency Multi-Brand Add-On",
                offer:
                  "Bundle 5 Client Workspaces with Unlimited OAuth Channels",
              },
            ].map((promo, i) => (
              <div key={i} className="rounded-lg border p-3.5 space-y-2">
                <p className="text-xs font-semibold">{promo.sku}</p>
                <p className="text-xs text-muted-foreground">{promo.offer}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={launchingPromo === promo.sku}
                  onClick={() =>
                    handleLaunchProductPromo(promo.sku, promo.offer)
                  }
                  className="w-full h-8 text-xs gap-1.5 cursor-pointer"
                >
                  {launchingPromo === promo.sku ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Launch Omnichannel Promo
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}