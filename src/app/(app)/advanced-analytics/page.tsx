"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Briefcase,
  Filter,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

const LAST_7_DAYS_CAMPAIGN_DATA = [
  { day: "Mon", conversions: 48, clicks: 680, impressions: 15400, roas: 3.1 },
  { day: "Tue", conversions: 56, clicks: 790, impressions: 17900, roas: 3.4 },
  { day: "Wed", conversions: 53, clicks: 745, impressions: 16800, roas: 3.3 },
  { day: "Thu", conversions: 69, clicks: 920, impressions: 20400, roas: 3.8 },
  { day: "Fri", conversions: 78, clicks: 1050, impressions: 23600, roas: 4.1 },
  { day: "Sat", conversions: 74, clicks: 980, impressions: 21900, roas: 3.9 },
  { day: "Sun", conversions: 91, clicks: 1210, impressions: 26800, roas: 4.4 },
];

export default function AdvancedAnalyticsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [adContentFilter, setAdContentFilter] = useState("");

  const chartData = useMemo(() => {
    const multiplier =
      selectedCampaign === "campaign1"
        ? 1.15
        : selectedCampaign === "campaign2"
        ? 0.9
        : 1;
    return LAST_7_DAYS_CAMPAIGN_DATA.map((d) => ({
      ...d,
      conversions: Math.round(d.conversions * multiplier),
      clicks: Math.round(d.clicks * multiplier),
      impressions: Math.round(d.impressions * multiplier),
    }));
  }, [selectedCampaign]);

  const total7dConversions = chartData.reduce((s, d) => s + d.conversions, 0);
  const total7dClicks = chartData.reduce((s, d) => s + d.clicks, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Campaign Analytics"
        description="Dive deep into your campaign performance over the last 7 days with granular filters and segment insights."
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Column */}
        <Card className="lg:w-1/4 shadow-2xs">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filterAge">Age</Label>
              <Select defaultValue="25-34">
                <SelectTrigger id="filterAge">
                  <SelectValue placeholder="Any Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45+">45+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterLocation">Location</Label>
              <Input id="filterLocation" placeholder="e.g., California, USA" />
            </div>
            <div>
              <Label htmlFor="filterInterests">Interests</Label>
              <Select defaultValue="tech">
                <SelectTrigger id="filterInterests">
                  <SelectValue placeholder="Any Interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterCampaign">Campaign</Label>
              <Select
                value={selectedCampaign}
                onValueChange={setSelectedCampaign}
              >
                <SelectTrigger id="filterCampaign">
                  <SelectValue placeholder="All Campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="campaign1">Summer Growth Wave</SelectItem>
                  <SelectItem value="campaign2">Q4 Product Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-2 cursor-pointer">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Main Analytics Content Area */}
        <div className="flex-1 space-y-6">
          <Card className="shadow-2xs border-indigo-200/80 dark:border-indigo-500/25">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Campaign Performance
                  </CardTitle>
                  <CardDescription>
                    7-day performance trend line for selected campaigns (Mon – Sun).
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <div>
                    <span className="text-muted-foreground">7d Conv: </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {total7dConversions.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">7d Clicks: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {total7dClicks.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Campaign Name (search/filter)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Input
                  placeholder="Ad Content keyword filter..."
                  value={adContentFilter}
                  onChange={(e) => setAdContentFilter(e.target.value)}
                />
              </div>

              {/* 7-Day Mini-Trend Line Chart inside Campaign Performance Card */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-b from-indigo-50/35 to-white dark:from-indigo-950/20 dark:to-slate-900 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Last 7 Days Performance Velocity
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                    +21.4% 7-day lift
                  </span>
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "11px" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        style={{ fontSize: "11px" }}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          fontSize: "12px",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="clicks"
                        name="Link Clicks"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 3.5 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="conversions"
                        name="Conversions"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={{ r: 3.5 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Audience Targeting Insights
              </CardTitle>
              <CardDescription>Understand your audience segments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="behaviors" defaultChecked />
                <Label htmlFor="behaviors" className="text-sm font-normal">
                  Behaviors (e.g., B2B SaaS Decision Makers)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="targetAge" defaultChecked />
                <Label htmlFor="targetAge" className="text-sm font-normal">
                  Age Group (e.g., 25-44)
                </Label>
              </div>
              <Textarea
                placeholder="Segment notes or custom audience exclusions..."
                className="min-h-[70px] text-xs"
              />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm font-mono tabular-nums text-muted-foreground">
                Allocated Segment Budget: $15,000
              </div>
              <Button variant="outline" size="sm">
                Export Segment Report
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
