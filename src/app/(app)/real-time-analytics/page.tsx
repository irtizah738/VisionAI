
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Briefcase, MapPin, Filter, BarChart3, ChevronDown, Settings2, FileSearch } from "lucide-react";

export default function RealTimeAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Real-Time Analytics"
        description="Dive deep into your campaign performance with granular filters and insights."
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Column - Mockup's mini-sidebar */}
        <Card className="lg:w-1/4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filterAge">Age</Label>
              <Select>
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
              <Select>
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
              <Select>
                <SelectTrigger id="filterCampaign">
                  <SelectValue placeholder="All Campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campaign1">Summer Sale 2024</SelectItem>
                  <SelectItem value="campaign2">Q3 Product Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-2">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Main Analytics Content Area */}
        <div className="flex-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Campaign Performance
              </CardTitle>
              <CardDescription>Overview of selected campaigns based on filters.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input placeholder="Campaigns Name (search/filter)" className="mb-4"/>
                <Textarea placeholder="Ad Content (search/filter)" className="mb-4 min-h-[80px]" />
                <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Campaign performance data and charts will appear here.</p>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Audience Targeting Insights
              </CardTitle>
              <CardDescription>Understand your audience segments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="behaviors" />
                <Label htmlFor="behaviors" className="text-sm font-normal">Behaviors (e.g., Online Shoppers)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="targetAge" />
                <Label htmlFor="targetAge" className="text-sm font-normal">Age Group (e.g., 25-35)</Label>
                 <Input type="text" placeholder="e.g. 25-35" className="ml-2 h-8 w-24"/>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="targetLocation" />
                <Label htmlFor="targetLocation" className="text-sm font-normal">Location (e.g., Specific Cities)</Label>
                <Input type="text" placeholder="e.g. New York" className="ml-2 h-8"/>
              </div>
               <div className="p-6 mt-2 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[150px] bg-muted/30">
                    <Users className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Audience segment performance charts will display here.</p>
                </div>
            </CardContent>
             <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Budget: $5,000 (Simulated)</div>
                <Button variant="outline" size="sm">View Bundles/Offers</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

// Placeholder for Textarea since it might not be imported by default
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
);
import { cn } from "@/lib/utils"; // Ensure cn is imported if not globally available
