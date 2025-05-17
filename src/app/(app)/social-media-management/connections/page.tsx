
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SocialMediaConnectionsPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Manage Social Media Connections"
        description="Connect, disconnect, or refresh permissions for your social media accounts."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Oversee your integrated social media platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <Settings className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              A list of connected social platforms (e.g., Facebook, Instagram, X, LinkedIn) will appear here, with options to add new connections, manage existing ones, or view connection status.
            </p>
          </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" onClick={() => router.back()}>Back to Social Hub</Button>
        </CardFooter>
      </Card>
    </>
  );
}
