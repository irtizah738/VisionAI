
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function CreateCustomerSegmentPage() {
  return (
    <>
      <PageHeader
        title="Create New Customer Segment"
        description="Define a new audience segment based on specific criteria."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Segment Builder
          </CardTitle>
          <CardDescription>
            Construct your new customer segment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Set criteria for demographics, behavior, interests, and purchase history to create a new segment.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
