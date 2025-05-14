"use client";

import { CircleDollarSign, Target, Filter, BarChartHorizontalBig, PieChartIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const profitBreakdownData = [
  { source: "Organic Search", profit: 15000, fill: "var(--color-organic)" },
  { source: "Paid Search", profit: 8000, fill: "var(--color-paid)" },
  { source: "Direct Traffic", profit: 12000, fill: "var(--color-direct)" },
  { source: "Referrals", profit: 5000, fill: "var(--color-referrals)" },
];

const chartConfig: ChartConfig = {
  profit: {
    label: "Profit",
  },
  organic: {
    label: "Organic Search",
    color: "hsl(var(--chart-1))",
  },
  paid: {
    label: "Paid Search",
    color: "hsl(var(--chart-2))",
  },
  direct: {
    label: "Direct Traffic",
    color: "hsl(var(--chart-3))",
  },
  referrals: {
    label: "Referrals",
    color: "hsl(var(--chart-4))",
  },
};


export default function SeoPage() {
  return (
    <>
      <PageHeader
        title="SEO Dashboard"
        description="Track your search engine optimization performance."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign Budgets</CardTitle>
            <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,500</div>
            <p className="text-xs text-muted-foreground">Monthly SEO Spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organic Conversions</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
            <Filter className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.3%</div>
            <p className="text-xs text-muted-foreground">+1.5% WoW</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit (SEO)</CardTitle>
            <BarChartHorizontalBig className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$40,500</div>
            <p className="text-xs text-muted-foreground">YTD from SEO efforts</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Profit Breakdown by Source
            </CardTitle>
            <CardDescription>Distribution of profit from different traffic sources.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="profit" hideLabel />} />
                <Pie data={profitBreakdownData} dataKey="profit" nameKey="source" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}>
                  {profitBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="source" />}
                  className="-translate-y-2"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
