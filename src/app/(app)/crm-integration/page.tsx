
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UsersCog } from "lucide-react";

export default function CrmIntegrationPage() {
  return (
    <>
      <PageHeader
        title="CRM Integration"
        description="Customer relationship management with sales tracking."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersCog className="h-6 w-6 text-primary" />
            CRM Connect
          </CardTitle>
          <CardDescription>
            Integrate and manage your customer relationships and sales data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for CRM Integration will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
