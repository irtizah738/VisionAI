
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function LocalMarketingPage() {
  return (
    <>
      <PageHeader
        title="Local Marketing Optimization"
        description="Enhance your business's local presence and reach."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Local Marketing Tools
          </CardTitle>
          <CardDescription>
            Tools and insights for optimizing your local marketing efforts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Local Marketing Optimization will be displayed here. This includes features like business page enhancement, directory management, and location-based social tactics.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
