
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UserCircle, Gauge, Route, Lightbulb, TrendingUp, UsersCog, MessageSquarePlus, Target, Mail, CalendarPlus, ShoppingBag, History, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function CrmIntegrationPage() {
  return (
    <>
      <PageHeader
        title="CRM Integration & Customer Insights"
        description="Manage customer relationships, track sales, and gain AI-powered recommendations."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile and AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-primary" />
                Customer Profile: John Doe
              </CardTitle>
              <CardDescription>Detailed overview of customer interactions, history, and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Customer Avatar" data-ai-hint="person avatar"/>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">john.doe@example.com | +1-555-123-4567</p>
                  <p className="text-xs text-muted-foreground">Loyalty Tier: Gold | Member Since: Jan 15, 2022</p>
                </div>
              </div>
              
              <Separator />

              <div>
                <h4 className="font-semibold mb-2 text-primary flex items-center gap-1"><ShoppingBag className="h-5 w-5"/> Transaction History</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                  <li>Order #1024 - Smart Watch Model X - $299.99 (July 10, 2024)</li>
                  <li>Order #985 - Wireless Earbuds - $79.00 (June 05, 2024)</li>
                  <li>Order #950 - Fitness Tracker - $120.50 (April 20, 2024)</li>
                </ul>
                 <p className="text-xs text-muted-foreground mt-1">Total Spend: $1,250.49</p>
              </div>
              
              <Separator />

              <div>
                <h4 className="font-semibold mb-2 text-primary flex items-center gap-1"><History className="h-5 w-5"/> Interaction Timeline</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium">Visited 'New Arrivals' page</span>
                      <p className="text-xs text-muted-foreground">July 15, 2024 - 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                     <ShoppingBag className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium">Added 'Wireless Headphones' to cart</span>
                      <p className="text-xs text-muted-foreground">July 15, 2024 - 10:35 AM</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium">Opened 'Weekly Deals' newsletter</span>
                      <p className="text-xs text-muted-foreground">July 14, 2024 - 09:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
             <CardFooter>
                <Button variant="outline">View Full CRM Record</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Lightbulb className="h-6 w-6" />
                AI-Powered Next Best Actions
              </CardTitle>
              <CardDescription className="text-accent/80">
                Tailored suggestions to enhance engagement with John Doe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background/70 rounded-md shadow-sm border">
                <h4 className="font-semibold flex items-center gap-1.5 mb-1">
                  <MessageSquarePlus className="h-5 w-5 text-primary"/>
                  High Priority: Cart Abandonment
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  John Doe has 'Wireless Headphones' in his cart. Send a follow-up email offering a 5% discount to encourage purchase.
                </p>
                <Button size="sm">
                  <Mail className="mr-2 h-4 w-4"/>
                  Send Discount Email (Simulated)
                </Button>
              </div>
              <div className="p-4 bg-background/70 rounded-md shadow-sm border">
                <h4 className="font-semibold flex items-center gap-1.5 mb-1">
                  <Target className="h-5 w-5 text-primary"/>
                  Content Engagement: Smart Watch
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Share a blog post about 'Top 5 Accessories for Smart Watches' with John, based on his last purchase.
                </p>
                 <Button size="sm" variant="secondary">
                  <FileText className="mr-2 h-4 w-4"/>
                  Share Blog Post (Simulated)
                </Button>
              </div>
               <div className="p-4 bg-background/70 rounded-md shadow-sm border">
                <h4 className="font-semibold flex items-center gap-1.5 mb-1">
                  <CalendarPlus className="h-5 w-5 text-primary"/>
                  Proactive Follow-up: Loyalty
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Schedule a task to check in with John in 2 weeks about his Gold Tier benefits.
                </p>
                 <Button size="sm" variant="secondary">
                  <CalendarPlus className="mr-2 h-4 w-4"/>
                  Schedule Task (Simulated)
                </Button>
              </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">AI recommendations are updated in real-time based on new data.</p>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Lead Scoring and Journey Tracking */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-6 w-6 text-primary" />
                Lead Scoring
              </CardTitle>
              <CardDescription>Prioritize leads based on their engagement and likelihood to convert.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Jane Smith (Lead Score: 85)</span>
                  <span className="text-green-500">High Priority</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Robert Brown (Lead Score: 60)</span>
                  <span className="text-yellow-500">Medium Priority</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
               <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Lisa Green (Lead Score: 30)</span>
                  <span className="text-red-500">Low Priority</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">View All Leads</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-6 w-6 text-primary" />
                Customer Journey Tracking
              </CardTitle>
              <CardDescription>Visualize and analyze customer touchpoints.</CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground mb-3">
                Follow the path customers take from awareness to conversion and beyond.
              </p>
              {/* Placeholder for a journey map visual */}
              <div className="relative h-48 border border-dashed rounded-md p-2 flex flex-col items-center justify-center bg-muted/50">
                <Image src="https://placehold.co/300x100/EBF4FF/6366F1?text=Customer+Journey+Map" alt="Customer Journey Map Placeholder" width={300} height={100} data-ai-hint="journey map" className="opacity-50" />
                <p className="text-xs text-muted-foreground mt-2">Customer journey visualization will appear here.</p>
              </div>
               <Button variant="outline" size="sm" className="w-full mt-4">Explore Journeys</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
