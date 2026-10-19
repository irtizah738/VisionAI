
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SocialPlatformSettingsPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Social Media Platform Settings"
        description="Manage connected accounts and default settings for each platform."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Platform Configuration
          </CardTitle>
          <CardDescription>
            Adjust settings for your connected social media accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <Settings2 className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Options to connect/disconnect social accounts, set default posting preferences per platform, and manage API keys will be here.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </>
  );
}
