
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, ListChecks, TrendingUp, Edit3, MessageSquareShare, BarChart3, Compass, Users, Lightbulb, Search, CloudUpload, Globe } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast"; // Added

export default function LocalMarketingPage() {
  const { toast } = useToast(); // Added

  return (
    <>
      <PageHeader
        title="Local Marketing Optimization"
        description="Tools to enhance your business's local presence and reach."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Profile Optimizer Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              Business Profile Optimizer
            </CardTitle>
            <CardDescription>
              Ensure your business information is accurate, complete, and optimized across platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" placeholder="e.g., VisionAI Cafe" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g., 123 AI Street, Tech City" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="e.g., (555) 123-4567" />
            </div>
             <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" placeholder="e.g., https://visionai.example.com" />
            </div>
            <div>
              <Label htmlFor="hours">Operating Hours</Label>
              <Input id="hours" placeholder="e.g., Mon-Fri 9AM-6PM, Sat 10AM-4PM" />
            </div>
            <div>
              <Label htmlFor="services">Services/Description</Label>
              <Textarea id="services" placeholder="Describe your business and services offered..." className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label>Profile Completeness</Label>
              <Progress value={65} className="h-3" indicatorClassName="bg-green-500" />
              <p className="text-xs text-muted-foreground">65% complete. Add more details for better visibility.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto" onClick={() => toast({ title: "AI Analysis", description: "Analyzing profile and generating suggestions (Simulated)..." })}>
              <Lightbulb className="mr-2 h-4 w-4" /> Analyze & Suggest (AI)
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Profile Saved", description: "Business profile saved and syncing (Simulated)." })}>
              <CloudUpload className="mr-2 h-4 w-4" /> Save & Sync
            </Button>
          </CardFooter>
        </Card>

        {/* Local Directory Management Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              Local Directory Management
            </CardTitle>
            <CardDescription>
              Manage and synchronize your listings across important local directories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500"/>
                <span>Google Business Profile</span>
              </div>
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Synced</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                 <Users className="h-5 w-5 text-red-500"/>
                <span>Yelp</span>
              </div>
              <Badge variant="destructive">Needs Update</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-sky-500"/>
                <span>Bing Places</span>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
             <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500"/>
                <span>Local Maps Service</span>
              </div>
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Synced</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto" onClick={() => toast({ title: "Scanning Directories", description: "Checking status across local directories (Simulated)..." })}>
              <Search className="mr-2 h-4 w-4" /> Scan Directories
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Syncing Listings", description: "Updating all local directory listings (Simulated)..." })}>
              <CloudUpload className="mr-2 h-4 w-4" /> Sync All Listings (Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* Geo-Targeted Social Campaigns Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareShare className="h-6 w-6 text-primary" />
              Geo-Targeted Social Campaigns
            </CardTitle>
            <CardDescription>
              Create social media campaigns targeting customers in specific geographic areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="socialPlatform">Platform</Label>
              <Select>
                <SelectTrigger id="socialPlatform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetArea">Target Area (e.g., City, Zip Code, Radius)</Label>
              <Input id="targetArea" placeholder="e.g., San Francisco, CA or 5 miles around 94107" />
            </div>
            <div>
              <Label htmlFor="postContent">Post Content / Ad Creative</Label>
              <Textarea id="postContent" placeholder="Craft your engaging local post..." className="min-h-[100px]" />
            </div>
             <div className="p-3 border border-dashed rounded-md bg-muted/30 text-center">
              <p className="text-sm text-muted-foreground">Campaign Performance Preview (Placeholder)</p>
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mt-2"/>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => toast({ title: "Campaign Launched", description: "Geo-targeted campaign has been launched (Simulated)." })}>
              <TrendingUp className="mr-2 h-4 w-4" /> Launch Geo-Targeted Campaign (Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* Local SEO Health Check Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Local SEO Health Check
            </CardTitle>
            <CardDescription>
              Analyze your local search performance and get actionable insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seoKeyword">Target Keyword</Label>
              <Input id="seoKeyword" placeholder="e.g., best coffee near me" />
            </div>
            <div>
              <Label htmlFor="seoLocation">Location</Label>
              <Input id="seoLocation" placeholder="e.g., Downtown Tech City" />
            </div>
             <div className="mt-4 p-4 border border-dashed rounded-md bg-muted/30">
                <h4 className="font-semibold text-sm mb-2">Analysis Results (Placeholder):</h4>
                <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                    <li>Overall Score: <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">72/100</Badge></li>
                    <li>Google Business Profile Optimization: Good</li>
                    <li>Local Citations Consistency: Needs Improvement</li>
                    <li>Online Reviews & Ratings: Excellent</li>
                    <li>Local On-Page SEO: Fair</li>
                </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => toast({ title: "SEO Health Check", description: "Running local SEO health check and generating AI tips (Simulated)..." })}>
              <Lightbulb className="mr-2 h-4 w-4" /> Run SEO Health Check & Get AI Tips
            </Button>
          </CardFooter>
        </Card>

      </div>
    </>
  );
}
