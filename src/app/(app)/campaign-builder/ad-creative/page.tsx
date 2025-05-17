
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

export default function AdCreativePage() {
  return (
    <>
      <PageHeader
        title="Create New Ad Creative"
        description="Design and configure your ad creatives for campaigns."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-6 w-6 text-primary" />
            Ad Creative Studio
          </CardTitle>
          <CardDescription>
            Build compelling visuals and copy for your advertisements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <ImagePlus className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Upload images/videos, write ad copy, and set up ad variations here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
