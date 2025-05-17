
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SquarePen } from "lucide-react";

export default function CreateSocialPostPage() {
  return (
    <>
      <PageHeader
        title="Create New Social Media Post"
        description="Draft and schedule a new post for your social media platforms."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SquarePen className="h-6 w-6 text-primary" />
            Post Composer
          </CardTitle>
          <CardDescription>
            Craft your social media message.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <SquarePen className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Write your post content, add media, select platforms, and schedule for publication here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
