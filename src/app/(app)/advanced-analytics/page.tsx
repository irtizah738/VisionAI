
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, BarChart, LineChart as LineChartIconLucide, PieChartIcon, Lightbulb, ExternalLink } from "lucide-react"; // Renamed LineChart to LineChartIconLucide to avoid conflict
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Pie, Cell, Line, LineChart } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";


const behaviorChartData = [
  { segment: "Segment A", engagement: 65, conversion: 40, predictedChurnRisk: 15 },
  { segment: "Segment B", engagement: 78, conversion: 55, predictedChurnRisk: 5 },
  { segment: "Segment C", engagement: 50, conversion: 30, predictedChurnRisk: 25 },
  { segment: "Segment D", engagement: 85, conversion: 60, predictedChurnRisk: 10 },
];

const trendChartData = [
  { month: "Jan", value: 400, topic: "AI in Marketing" },
  { month: "Feb", value: 300, topic: "Sustainable Brands" },
  { month: "Mar", value: 600, topic: "Video Content" },
  { month: "Apr", value: 800, topic: "Personalization" },
  { month: "May", value: 500, topic: "Influencer Marketing" },
  { month: "Jun", value: 700, topic: "Data Privacy" },
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
  predictedChurnRisk: {
    label: "Predicted Churn Risk (%)",
    color: "hsl(var(--chart-5))",
  },
  value: {
    label: "Trend Score",
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
              AI-generated forecasts on customer actions, preferences, and potential churn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Predictions:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Segment A:</strong> 30% higher likelihood to purchase 'Product X' next month.</li>
                  <li><strong>Segment C:</strong> Shows a 25% churn risk. Proactive engagement recommended.</li>
                  <li><strong>High Engagement Users:</strong> 60% more likely to respond to loyalty offers.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Action Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1 text-accent">
                    <li>Launch targeted 'Product X' campaign for Segment A.</li>
                    <li>Deploy retention strategy for Segment C (e.g., special offer, survey).</li>
                    <li>Offer exclusive discounts to high engagement users.</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 h-[350px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={behaviorChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--color-engagement)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-predictedChurnRisk)" label={{ value: 'Churn Risk (%)', angle: -90, position: 'insideRight' }}/>
                    <RechartsTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} name="Engagement Score" />
                    <Bar yAxisId="left" dataKey="conversion" fill="var(--color-conversion)" radius={[4, 4, 0, 0]} name="Conversion Rate"/>
                    <Line yAxisId="right" type="monotone" dataKey="predictedChurnRisk" stroke="var(--color-predictedChurnRisk)" strokeWidth={2} name="Churn Risk (%)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Explore Raw Data
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Lightbulb className="mr-2 h-4 w-4" />
              Apply AI Recommendations (Simulated)
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Market Trend Analysis
            </CardTitle>
            <CardDescription>
              Identify emerging trends and shifts in the market landscape, powered by AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Emerging Trends:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Growing interest in 'Ethical AI in Marketing' (Search Volume +40% MoM).</li>
                  <li>Increased demand for 'Interactive Content Formats' (Social Mentions +25% MoM).</li>
                  <li>Shift towards 'Hyper-Personalization at Scale'.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Strategic Recommendations:</h3>
                 <ul className="list-disc list-inside space-y-1 text-accent">
                    <li>Develop blog posts/webinars on 'Ethical AI'.</li>
                    <li>Invest in tools for creating interactive quizzes/polls.</li>
                    <li>Explore AI solutions for advanced customer segmentation.</li>
                </ul>
              </div>
            </div>
             <div className="mt-6 h-[350px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={trendChartData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-2 bg-background shadow-lg rounded-md border">
                              <p className="font-semibold">{label}</p>
                              <p style={{ color: chartConfig.value.color }}>Trend Score: {data.value}</p>
                              <p className="text-sm text-muted-foreground">Focus Topic: {data.topic}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} activeDot={{ r: 8 }} name="Overall Market Trend Score" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Trend Sources
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Content Ideas (Simulated)
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-primary" /> {/* Assuming BarChart is the icon here */}
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
