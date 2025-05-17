
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FilePlus2 } from "lucide-react";

export default function CreateContentPage() {
  return (
    <>
      <PageHeader
        title="Create New Content"
        description="Add a new blog post, page, or other content type to your website."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus2 className="h-6 w-6 text-primary" />
            Content Editor
          </CardTitle>
          <CardDescription>
            Craft your new piece of content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <FilePlus2 className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Select content type, add title, write content, and manage SEO settings here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
