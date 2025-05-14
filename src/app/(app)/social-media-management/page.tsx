
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UsersRound } from "lucide-react";

export default function SocialMediaManagementPage() {
  return (
    <>
      <PageHeader
        title="Social Media Management"
        description="Multi-profile management with performance analytics."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-primary" />
            Social Media Hub
          </CardTitle>
          <CardDescription>
            Streamline your social media presence across multiple platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Social Media Management will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
