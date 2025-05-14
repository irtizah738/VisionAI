
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UserCircle, Gauge, Route, Lightbulb, TrendingUp, UsersCog, MessageSquarePlus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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
                Customer Profile View
              </CardTitle>
              <CardDescription>Detailed overview of a selected customer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Customer Avatar" data-ai-hint="person avatar"/>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  <p className="text-xs text-muted-foreground">Loyalty Tier: Gold</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Last Interaction:</strong> 2 days ago (Email Open)</div>
                <div><strong>Total Spend:</strong> $1,250</div>
                <div><strong>Preferred Category:</strong> Electronics</div>
                <div><strong>Last Purchase:</strong> Smart Watch Model X</div>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold mb-1">Recent Activity:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Visited 'New Arrivals' page - 1 day ago</li>
                  <li>Added 'Wireless Headphones' to cart - 1 day ago</li>
                  <li>Opened 'Weekly Deals' newsletter - 2 days ago</li>
                </ul>
              </div>
            </CardContent>
             <CardFooter>
                <Button variant="outline">View Full Profile</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Lightbulb className="h-6 w-6" />
                AI Recommendations
              </CardTitle>
              <CardDescription className="text-accent/80">
                Tailored suggestions to enhance customer engagement and sales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-background/50 rounded-md shadow-sm">
                <h4 className="font-semibold flex items-center gap-1">
                  <MessageSquarePlus className="h-4 w-4 text-primary"/>
                  Next Best Action:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Send a follow-up email to John Doe regarding the 'Wireless Headphones' in his cart. Offer a 5% discount to encourage purchase.
                </p>
              </div>
              <div className="p-3 bg-background/50 rounded-md shadow-sm">
                <h4 className="font-semibold flex items-center gap-1">
                  <Target className="h-4 w-4 text-primary"/>
                  Content Suggestion:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Share a blog post about 'Top 5 Accessories for Smart Watches' with John, based on his last purchase.
                </p>
              </div>
            </CardContent>
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
