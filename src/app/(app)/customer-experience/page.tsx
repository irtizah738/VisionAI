
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SmilePlus } from "lucide-react";

export default function CustomerExperiencePage() {
  return (
    <>
      <PageHeader
        title="Customer Experience"
        description="Implement technical optimizations for better user experience and search rankings."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SmilePlus className="h-6 w-6 text-primary" />
            CX Optimization
          </CardTitle>
          <CardDescription>
            Tools to improve user satisfaction and site performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Customer Experience will be displayed here. This includes technical optimizations for a better user journey and improved search rankings.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
