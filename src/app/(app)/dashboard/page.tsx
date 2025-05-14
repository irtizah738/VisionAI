
"use client";

import Link from 'next/link';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Brain, CalendarCheck, Megaphone, Search, Users, Briefcase, Target, ShoppingBag, BarChartBig, LineChart } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="VisionAI Dashboard"
        description="Your central hub for marketing intelligence and campaign oversight."
      />

      {/* Top Navigation Links Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-foreground">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" /> Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Main overview</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/campaigns" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" /> Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage all campaigns</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/advanced-analytics" passHref> {/* Assuming AI Insights maps to Advanced Analytics */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartBig className="h-5 w-5" /> AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Deep dive analytics</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/crm-integration" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> CRM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Customer relations</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* AI-Powered Analytics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-foreground">AI-Powered Analytics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Real-Time Campaign Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Live tracking of your active campaigns' KPIs.</p>
              <div className="mt-4 h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart/Data Placeholder</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Forecasting marketing trends and outcomes.</p>
               <div className="mt-4 h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Predictions Placeholder</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Upcoming Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Automated suggestions and scheduled tasks.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>- Suggested action 1</li>
                <li>- Suggested action 2</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links to Tools Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-foreground">Tools Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary"/> Marketing Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Access SEO, Email, and Content Generation tools.</p>
              <Button variant="outline" size="sm" className="mt-3">Explore Marketing</Button>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Briefcase className="h-5 w-5 text-primary"/> Branding Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage brand assets and strategy.</p>
               <Button variant="outline" size="sm" className="mt-3">Explore Branding</Button>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary"/> Advertising Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Optimize ad spend and campaign reach.</p>
               <Button variant="outline" size="sm" className="mt-3">Explore Advertising</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
