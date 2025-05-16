
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Filter, PlusCircle, Edit3, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const mockSegments = [
  { id: "1", name: "Tech Savvy Millennials", criteria: "Age: 25-35 | Interests: Technology, Gaming | Location: Urban Areas", members: 1250 },
  { id: "2", name: "Eco-Conscious Shoppers", criteria: "Age: 18-45 | Interests: Sustainability, Organic | Behavior: Buys eco-friendly", members: 850 },
  { id: "3", name: "Sports Enthusiasts (USA)", criteria: "Age: 18-55 | Interests: Sports, Fitness | Location: United States", members: 2100 },
  { id: "4", name: "High Value Customers", criteria: "Behavior: Frequent Purchases, High AOV", members: 450 },
];


export default function CustomerSegmentationPage() {
  return (
    <>
      <PageHeader
        title="Customer Segmentation"
        description="Define and manage your target audience segments."
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Segment
          </Button>
        }
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column for Filters/Management (Mockup's mini-sidebar) */}
        <Card className="lg:w-1/4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Segment Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mainFilter">Filter Segments</Label>
              <Select>
                <SelectTrigger id="mainFilter">
                  <SelectValue placeholder="All Segments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Segments</SelectItem>
                  <SelectItem value="archived">Archived Segments</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="filterAge">Filter by Age</Label>
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
              <Label htmlFor="filterInterests">Filter by Interests</Label>
              <Input id="filterInterests" placeholder="e.g., Technology"/>
            </div>
            <Button variant="outline" className="w-full mt-2">
                <Filter className="mr-2 h-4 w-4"/> Apply Filters
            </Button>
            <Button className="w-full mt-2">
                <Users className="mr-2 h-4 w-4"/> Manage Audiences
            </Button>
          </CardContent>
        </Card>

        {/* Main Segments List Area */}
        <div className="flex-1 space-y-4">
          {mockSegments.map((segment) => (
            <Card key={segment.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{segment.name}</CardTitle>
                    <CardDescription className="text-xs">{segment.criteria}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">View Details</span>
                </Button>
              </CardHeader>
              <CardContent className="flex justify-between items-center text-sm">
                <p><Users className="inline h-4 w-4 mr-1 text-muted-foreground"/>{segment.members.toLocaleString()} Members</p>
                <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                        <Edit3 className="h-3 w-3"/>
                    </Button>
                     <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3"/>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {mockSegments.length === 0 && (
             <Card className="shadow-md">
                <CardContent className="p-6 text-center text-muted-foreground">
                    No segments created yet. Start by creating a new segment.
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </>
  );
}
