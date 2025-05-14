
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, PlusCircle, ListChecks, History, CalendarClock } from "lucide-react";

export default function CampaignsPage() {
  const [campaignName, setCampaignName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [adSpend, setAdSpend] = useState("");

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create campaign will go here
    console.log({ campaignName, targetAudience, adSpend });
    // Reset form for now
    setCampaignName("");
    setTargetAudience("");
    setAdSpend("");
  };

  return (
    <>
      <PageHeader
        title="Campaign Management"
        description="Oversee, create, and optimize your marketing campaigns."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Display Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Campaigns</CardTitle>
              <CardDescription>View and manage all your marketing campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="active" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" /> Active
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" /> Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex items-center gap-2">
                    <History className="h-4 w-4" /> Past
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">Placeholder for active campaigns list.</p>
                      {/* Example campaign item */}
                      <div className="border p-3 rounded-md shadow-sm">
                        <h4 className="font-semibold">Summer Sale 2024</h4>
                        <p className="text-xs text-muted-foreground">Status: Ongoing | Budget: $5000</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="upcoming">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">Placeholder for upcoming campaigns list.</p>
                       <div className="border p-3 rounded-md shadow-sm">
                        <h4 className="font-semibold">Holiday Product Launch</h4>
                        <p className="text-xs text-muted-foreground">Starts: Nov 15, 2024 | Budget: $7500</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="past">
                  <Card>
                    <CardHeader>
                      <CardTitle>Past Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">Placeholder for past campaigns list.</p>
                       <div className="border p-3 rounded-md shadow-sm">
                        <h4 className="font-semibold">Spring Awareness Q1</h4>
                        <p className="text-xs text-muted-foreground">Ended: Mar 31, 2024 | Performance: Good</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
               <Button variant="outline" className="w-full md:w-auto">
                <Wand2 className="mr-2 h-4 w-4" />
                AI-Suggest Campaign Improvements
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Campaign Creation Section */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Create New Campaign
              </CardTitle>
              <CardDescription>Set up your next marketing initiative.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateCampaign}>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaignName" className="text-base font-medium">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., 'Q4 Holiday Promotion'"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience" className="text-base font-medium">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Describe your target audience (e.g., demographics, interests)"
                    className="mt-1 min-h-[80px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="adSpend" className="text-base font-medium">Ad Spend ($)</Label>
                  <Input
                    id="adSpend"
                    type="number"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    placeholder="e.g., 1500"
                    className="mt-1"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Create Campaign
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
