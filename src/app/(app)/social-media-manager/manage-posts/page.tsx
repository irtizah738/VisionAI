
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageSocialPostsPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Manage Social Media Posts"
        description="View, edit, or delete scheduled and drafted posts."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListFilter className="h-6 w-6 text-primary" />
            Post Management
          </CardTitle>
          <CardDescription>
            Oversee your social media content pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <ListFilter className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              A list or table of scheduled posts, drafts, and past posts with options to edit, delete, reschedule, or view performance will be displayed here.
            </p>
          </div>
        </CardContent>
         <CardFooter>
            <Button variant="outline" onClick={() => router.back()}>Back to Social Manager</Button>
        </CardFooter>
      </Card>
    </>
  );
}
