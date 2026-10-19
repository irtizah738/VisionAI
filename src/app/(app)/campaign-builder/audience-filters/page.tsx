
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Filter } from "lucide-react";

export default function AudienceFiltersPage() {
  return (
    <>
      <PageHeader
        title="Define Audience Filters"
        description="Set up specific audience filters for your campaign targeting."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-6 w-6 text-primary" />
            Audience Filter Configuration
          </CardTitle>
          <CardDescription>
            Fine-tune your targeting parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <Filter className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Configure detailed demographic, behavioral, and interest-based filters for your audience here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
