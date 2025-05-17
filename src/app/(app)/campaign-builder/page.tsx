
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Settings, Filter, Users, MapPin, DollarSign, CalendarDays, Eye, UploadCloud } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; // Added

export default function CampaignBuilderPage() {
  const router = useRouter(); // Added

  return (
    <>
      <PageHeader
        title="Campaign Builder"
        description="Create and configure your new marketing campaigns."
        actions={
          <Button onClick={() => console.log("Save Campaign clicked")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Save Campaign
          </Button>
        }
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column for Filters/Settings (Mockup's mini-sidebar) */}
        <Card className="lg:w-1/4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Campaign Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input id="campaignName" placeholder="e.g., Summer Sale Q3" />
            </div>
            <div>
                <Label htmlFor="createAd">Create Ad</Label>
                <Button variant="outline" className="w-full justify-start mt-1" onClick={() => router.push('/campaign-builder/ad-creative')}>
                    <PlusCircle className="mr-2 h-4 w-4"/> New Ad Creative
                </Button>
            </div>
             <div>
                <Label htmlFor="accountSettings">Account</Label>
                <Button variant="outline" className="w-full justify-start mt-1" onClick={() => router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4"/> Account Settings
                </Button>
            </div>
            <div>
                <Label htmlFor="filters">Filters</Label>
                <Button variant="outline" className="w-full justify-start mt-1" onClick={() => router.push('/campaign-builder/audience-filters')}>
                    <Filter className="mr-2 h-4 w-4"/> Audience Filters
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Campaign Configuration Area */}
        <div className="flex-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Targeting Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" placeholder="e.g., 25-45" />
                </div>
                <div>
                  <Label htmlFor="locationFilter">Location</Label>
                  <Input id="locationFilter" placeholder="e.g., New York, USA" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Audience Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="behaviors" defaultChecked />
                <Label htmlFor="behaviors">Behaviors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="locationTarget" />
                <Label htmlFor="locationTarget">Location</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ageTarget" defaultChecked />
                <Label htmlFor="ageTarget">Age</Label>
              </div>
              <div className="mt-4 p-4 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted/30">
                <Image
                  src="https://placehold.co/300x150.png"
                  alt="Ad creative placeholder"
                  width={300}
                  height={150}
                  data-ai-hint="ad creative placeholder"
                  className="rounded"
                />
                <Button variant="outline" size="sm" className="mt-3" onClick={() => console.log("Upload Creative clicked")}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Creative
                </Button>
                <Input id="imageDetails" placeholder="momatz: (image details from mockup - unclear)" className="mt-2 text-xs h-8"/>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Budget & Duration</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" type="number" placeholder="5,300" defaultValue="5300" />
              </div>
              <div className="flex-1">
                <Label htmlFor="duration">Duration</Label>
                 <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>
                    15 Days
                </Button>
              </div>
            </CardContent>
             <CardFooter>
                <Button className="w-full sm:w-auto" onClick={() => console.log("Preview Campaign Clicked")}>
                    <Eye className="mr-2 h-4 w-4"/> Preview Campaign
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
