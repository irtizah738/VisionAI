
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Edit3, PlusSquare, Image as ImageIcon, Youtube, TwitterIcon, MessageSquare, Settings2 } from "lucide-react"; 
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Added

const XPlatformIcon = () => <TwitterIcon className="h-5 w-5" />; 

export default function SocialMediaManagerPage() {
  const router = useRouter();
  const { toast } = useToast(); // Added

  return (
    <>
      <PageHeader
        title="Social Media Manager"
        description="Schedule posts, create content, and manage your social presence."
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-1/4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tools & Platforms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/social-media-manager/schedule')}>
              <CalendarDays className="mr-2 h-4 w-4" /> Schedule Post
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/social-media-manager/manage-posts')}>
              <Edit3 className="mr-2 h-4 w-4" /> Manage Posts
            </Button>
            <Button variant="default" className="w-full justify-start" onClick={() => router.push('/social-media-manager/create-post')}>
              <PlusSquare className="mr-2 h-4 w-4" /> New Post
            </Button>
            
            <div className="pt-3">
                <Label className="text-sm font-medium">Create for:</Label>
                <div className="space-y-2 mt-1">
                     <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" onClick={() => toast({ title: "Media Tool", description: "Opening general media creation tool..."})}>
                        <ImageIcon className="mr-2 h-4 w-4" /> I Media (General Media)
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" onClick={() => toast({ title: "X (Twitter) Tool", description: "Opening X (Twitter) post creation tool..."})}>
                        <XPlatformIcon /> <span className="ml-2">X (Twitter)</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" onClick={() => toast({ title: "YouTube Tool", description: "Opening YouTube content creation tool..."})}>
                        <Youtube className="mr-2 h-4 w-4" /> YouTube
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" onClick={() => toast({ title: "Rumble Tool", description: "Opening Rumble content creation tool..."})}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Rumble (Example)
                    </Button>
                </div>
            </div>
          </CardContent>
           <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push('/social-media-manager/platform-settings')}>
                    <Settings2 className="mr-2 h-4 w-4"/> Platform Settings
                </Button>
           </CardFooter>
        </Card>

        <div className="flex-1">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Content Calendar</CardTitle>
              <Select defaultValue="instagram">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">PeLisi (Instagram)</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(day => <div key={day}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 grid-rows-5 gap-1 aspect-[7/5] border rounded-md p-1 bg-muted/30">
                {Array.from({ length: 35 }).map((_, index) => (
                  <div key={index} className="border rounded-sm bg-background/50 p-1 flex flex-col items-start justify-start min-h-[60px]">
                    <span className="text-xs text-muted-foreground">{(index % 7) + 1 + (Math.floor(index/7)*7) > 31 ? "" : (index % 7) + 1 + (Math.floor(index/7)*7) - 4 < 1 ? "" : (index % 7) + 1 + (Math.floor(index/7)*7) - 4}</span>
                    {index === 9 && <div className="mt-1 w-full bg-primary/20 p-1 rounded text-primary text-[8px] leading-tight truncate">Post Title 1</div>}
                    {index === 16 && <div className="mt-1 w-full bg-accent/20 p-1 rounded text-accent-foreground text-[8px] leading-tight truncate">Event Post</div>}
                     {index === 23 && <div className="mt-1 w-full bg-secondary/20 p-1 rounded text-secondary-foreground text-[8px] leading-tight truncate">Ad Campaign Start</div>}
                  </div>
                ))}
              </div>
               <div className="mt-4 text-center p-4 border border-dashed rounded-md bg-muted/50">
                  <Image 
                    src="https://placehold.co/500x250.png" 
                    alt="Social media post previews" 
                    width={500} 
                    height={250}
                    data-ai-hint="social media posts calendar"
                    className="rounded-md mx-auto opacity-70"
                  />
                   <p className="text-sm text-muted-foreground mt-2">This is a visual representation of the scheduled posts. Interactive elements for Monu, Cl, MeTuleo, Runtlie, Mexe, Port, Pust (from mockup) would be part of each day's detailed view or creation modal.</p>
                </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/social-media-manager/full-schedule')}>View Full Schedule</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
