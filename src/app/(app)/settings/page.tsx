
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your VisionAI account and platform settings."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Account & Platform Configuration
          </CardTitle>
          <CardDescription>
            Adjust your preferences for VisionAI, manage billing, and user access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <SettingsIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Account settings, billing information, user management, and platform preferences will be configured here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
