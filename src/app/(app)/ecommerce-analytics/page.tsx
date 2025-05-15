
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Store, DollarSign, ShoppingCart, Users, TrendingUp, Lightbulb, BarChart3, PackageSearch, Percent, LineChart as LineChartIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Bar, Pie, PieChart, Cell } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const salesTrendData = [
  { month: "Jan", sales: 4000, profit: 2400 },
  { month: "Feb", sales: 3000, profit: 1398 },
  { month: "Mar", sales: 5000, profit: 3800 },
  { month: "Apr", sales: 4780, profit: 2908 },
  { month: "May", sales: 6890, profit: 4800 },
  { month: "Jun", sales: 5390, profit: 3800 },
];

const topProductsData = [
  { id: "PROD001", name: "Smart Watch Series X", unitsSold: 350, revenue: 104650 },
  { id: "PROD002", name: "Wireless Earbuds Pro", unitsSold: 520, revenue: 77880 },
  { id: "PROD003", name: "AI-Powered Coffee Maker", unitsSold: 180, revenue: 35982 },
  { id: "PROD004", name: "Eco-Friendly Yoga Mat", unitsSold: 290, revenue: 13050 },
];

const chartConfig: ChartConfig = {
  sales: {
    label: "Sales ($)",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit ($)",
    color: "hsl(var(--chart-2))",
  },
};

export default function EcommerceAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="E-commerce Analytics"
        description="Predictive analytics for sales optimization and customer understanding."
      />
      <div className="space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125.70</div>
              <p className="text-xs text-muted-foreground">+5.3% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Percent className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.45%</div>
              <p className="text-xs text-muted-foreground">+0.2% from last week</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+80 since last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trend Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-6 w-6 text-primary" />
              Sales & Profit Trend
            </CardTitle>
            <CardDescription>
              Monthly overview of sales and profit performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pr-2">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                  <YAxis yAxisId="left" style={{ fontSize: '0.75rem' }} tickFormatter={(value) => `$${value/1000}k`}/>
                  <YAxis yAxisId="right" orientation="right" style={{ fontSize: '0.75rem' }} tickFormatter={(value) => `$${value/1000}k`}/>
                  <RechartsTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} name="Sales" />
                  <Line yAxisId="right" type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Performance */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageSearch className="h-6 w-6 text-primary" />
                Product Performance
              </CardTitle>
              <CardDescription>
                Insights into top-selling and underperforming products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="mb-2 font-semibold">Top Selling Products (Last 30 Days)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProductsData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.unitsSold}</TableCell>
                      <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 border border-dashed rounded-md text-center bg-muted/50">
                <p className="text-sm text-muted-foreground">Category sales breakdown chart placeholder</p>
                <BarChart3 className="h-10 w-10 mx-auto mt-2 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Recommendations */}
          <Card className="shadow-lg lg:col-span-1 bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Lightbulb className="h-6 w-6" />
                AI Recommendations
              </CardTitle>
              <CardDescription className="text-accent/80">
                Actionable insights to boost your e-commerce success.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-background/70 rounded-md shadow-sm border">
                <h4 className="font-semibold text-sm mb-1">Promotion Opportunity</h4>
                <p className="text-xs text-muted-foreground mb-1.5">
                  "AI-Powered Coffee Maker" shows high engagement but lower conversion. Consider a 10% flash sale.
                </p>
                <Button size="sm" variant="outline">Create Promotion (Simulated)</Button>
              </div>
              <div className="p-3 bg-background/70 rounded-md shadow-sm border">
                <h4 className="font-semibold text-sm mb-1">Inventory Alert</h4>
                <p className="text-xs text-muted-foreground mb-1.5">
                  "Wireless Earbuds Pro" stock is low (15 units). Predicted to sell out in 3 days.
                </p>
                <Button size="sm" variant="outline">Reorder Stock (Simulated)</Button>
              </div>
              <div className="p-3 bg-background/70 rounded-md shadow-sm border">
                <h4 className="font-semibold text-sm mb-1">Cross-selling Suggestion</h4>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Customers buying "Smart Watch Series X" often purchase "Extra Watch Bands". Bundle them.
                </p>
                <Button size="sm" variant="outline">Create Bundle (Simulated)</Button>
              </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">AI insights are updated based on the latest sales data.</p>
            </CardFooter>
          </Card>
        </div>

        {/* Customer Insights Placeholder */}
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary"/>
                    Customer Insights
                </CardTitle>
                <CardDescription>Understand your customer base better.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-muted/40">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Customer Lifetime Value (CLV)</p>
                    <p className="text-2xl font-bold">$450.20</p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/40">
                    <p className="text-sm font-medium text-muted-foreground">Repeat Purchase Rate</p>
                    <p className="text-2xl font-bold">28%</p>
                </div>
                 <div className="p-4 border rounded-lg bg-muted/40 md:col-span-2 text-center">
                    <p className="text-sm text-muted-foreground">Customer Segmentation Chart Placeholder</p>
                    <Users className="h-10 w-10 mx-auto mt-2 text-muted-foreground/50" />
                </div>
            </CardContent>
        </Card>

      </div>
    </>
  );
}


    