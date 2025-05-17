
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScheduleSocialPostPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Schedule Social Media Post"
        description="Select content, platforms, and schedule a time for your post."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="h-6 w-6 text-primary" />
            Post Scheduler
          </CardTitle>
          <CardDescription>
            Finalize and schedule your social media content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <CalendarPlus className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Interface for selecting existing content drafts or creating new content, choosing target platforms, picking date/time, and confirming schedule will be here.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button>Schedule Post</Button>
        </CardFooter>
      </Card>
    </>
  );
}
