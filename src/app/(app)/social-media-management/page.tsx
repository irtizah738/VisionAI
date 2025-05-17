
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Edit3, Inbox, BarChart3, UsersRound, MessageSquarePlus, Link2, Lightbulb, Settings, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added

// Mock social platform icons (replace with actual icons or images if available)
const SocialPlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "facebook": return <Facebook className="h-6 w-6 text-blue-600" />;
    case "instagram": return <Instagram className="h-6 w-6 text-pink-500" />;
    case "twitter": return <Twitter className="h-6 w-6 text-sky-500" />;
    case "linkedin": return <Linkedin className="h-6 w-6 text-blue-700" />;
    default: return <UsersRound className="h-6 w-6 text-muted-foreground" />;
  }
};


export default function SocialMediaManagementPage() {
  const router = useRouter(); // Added

  return (
    <>
      <PageHeader
        title="Social Media Hub"
        description="Centralize your social media activities: schedule posts, engage with your audience, and track performance across all platforms."
      />
      <Card className="shadow-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-primary" />
            Your Social Media Command Center
          </CardTitle>
          <CardDescription>
            Manage all your social profiles, schedule content, engage with your audience, and analyze performance from one central hub.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connected Accounts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" />Connected Accounts</CardTitle>
              <CardDescription>Manage your linked social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 items-center">
              {["Facebook", "Instagram", "Twitter", "LinkedIn"].map(platform => (
                <div key={platform} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                  <SocialPlatformIcon platform={platform} />
                  <span className="font-medium">{platform}</span>
                </div>
              ))}
               <Button variant="outline" size="sm" onClick={() => router.push('/social-media-management/connections')}>
                <Settings className="mr-2 h-4 w-4" /> Manage Connections
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="publisher" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 h-auto">
              <TabsTrigger value="publisher" className="py-2 text-sm sm:text-base">Content Publisher</TabsTrigger>
              <TabsTrigger value="inbox" className="py-2 text-sm sm:text-base">Unified Inbox</TabsTrigger>
              <TabsTrigger value="analytics" className="py-2 text-sm sm:text-base">Performance Analytics</TabsTrigger>
            </TabsList>

            {/* Content Publisher Tab */}
            <TabsContent value="publisher" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><Edit3 className="h-5 w-5 text-primary" />Content Publisher</CardTitle>
                  <CardDescription>Plan, schedule, and manage your social media content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="w-full sm:w-auto flex-1 sm:flex-none" onClick={() => router.push('/social-media-manager/full-schedule')}>
                      <CalendarDays className="mr-2 h-4 w-4" /> View Content Calendar
                    </Button>
                    <Button variant="secondary" className="w-full sm:w-auto  flex-1 sm:flex-none" onClick={() => router.push('/social-media-manager/schedule')}>
                      <MessageSquarePlus className="mr-2 h-4 w-4" /> Schedule New Post
                    </Button>
                     <Button variant="outline" className="w-full sm:w-auto  flex-1 sm:flex-none" onClick={() => router.push('/social-media-manager/manage-posts')}>
                      Manage Drafts (3)
                    </Button>
                  </div>
                  <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
                     <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Content calendar and scheduling interface will appear here.</p>
                  </div>
                  
                  {/* AI Content Assistant */}
                  <Card className="bg-accent/10 border-accent">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-accent"><Lightbulb className="h-5 w-5"/>AI Content Assistant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-accent/80 mb-2">Get AI-powered suggestions for post ideas, captions, and hashtags.</p>
                      <Button variant="outline" className="border-accent text-accent hover:bg-accent/20">
                        Generate Post Ideas (AI)
                      </Button>
                    </CardContent>
                  </Card>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Unified Inbox Tab */}
            <TabsContent value="inbox" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><Inbox className="h-5 w-5 text-primary" />Unified Inbox</CardTitle>
                  <CardDescription>Manage all your social media messages, comments, and mentions in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
                    <Inbox className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Your aggregated social media interactions will appear here.</p>
                  </div>
                  <Button className="w-full mt-4" onClick={() => router.push('/social-media-management/inbox')}>Go to Inbox</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Analytics Tab */}
            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Performance Analytics</CardTitle>
                  <CardDescription>Track key metrics and understand your social media performance.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardDescription>Total Reach</CardDescription>
                          <CardTitle className="text-3xl">75.2K</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-xs text-green-500">+15% last 30 days</p></CardContent>
                      </Card>
                       <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardDescription>Engagement Rate</CardDescription>
                          <CardTitle className="text-3xl">4.8%</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-xs text-green-500">+0.5% last 30 days</p></CardContent>
                      </Card>
                       <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardDescription>New Followers</CardDescription>
                          <CardTitle className="text-3xl">1,200</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-xs text-red-500">-5% last 30 days</p></CardContent>
                      </Card>
                   </div>
                  <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Detailed charts and reports on your social media performance will appear here.</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/social-media-management/analytics')}>View Detailed Analytics</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
    
