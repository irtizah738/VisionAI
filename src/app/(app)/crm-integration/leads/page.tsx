
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Lead Management"
        description="View, manage, and track all your leads."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Lead Dashboard
          </CardTitle>
          <CardDescription>
            Overview of all prospect interactions and statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              A list of all leads, their scores, statuses, and associated actions will be displayed here. This includes filtering, sorting, and bulk action capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
