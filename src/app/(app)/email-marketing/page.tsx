
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function EmailMarketingPage() {
  return (
    <>
      <PageHeader
        title="Email Marketing Automation"
        description="Personalized campaigns with A/B testing."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailCheck className="h-6 w-6 text-primary" />
            Email Automation Suite
          </CardTitle>
          <CardDescription>
            Manage, automate, and optimize your email marketing campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Email Marketing Automation will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
