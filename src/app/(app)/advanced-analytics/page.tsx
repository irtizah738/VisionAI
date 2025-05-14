
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChartBig } from "lucide-react";

export default function AdvancedAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Advanced Analytics"
        description="Comprehensive reporting with user-friendly dashboards."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartBig className="h-6 w-6 text-primary" />
            Advanced Analytics Platform
          </CardTitle>
          <CardDescription>
            Deep dive into your data with comprehensive reports and visualizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Advanced Analytics will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
