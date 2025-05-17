
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageContentTypesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Manage Content Types"
        description="Define and configure different types of content for your website (e.g., Blog Post, Page, Product)."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Content Type Configuration
          </CardTitle>
          <CardDescription>
            Add, edit, or remove content types and their associated fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <Settings2 className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              A list of existing content types will be displayed here, with options to create new ones, edit fields, and manage settings.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button onClick={() => router.back()}>Back to Content Management</Button>
        </CardFooter>
      </Card>
    </>
  );
}
