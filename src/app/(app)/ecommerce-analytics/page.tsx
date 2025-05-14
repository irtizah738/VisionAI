
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function EcommerceAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="E-commerce Analytics"
        description="Predictive analytics for sales optimization."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            E-commerce Insights
          </CardTitle>
          <CardDescription>
            Analyze sales data and gain predictive insights to optimize your e-commerce strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for E-commerce Analytics will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
