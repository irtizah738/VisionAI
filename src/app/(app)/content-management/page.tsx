
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FolderKanban } from "lucide-react";

export default function ContentManagementPage() {
  return (
    <>
      <PageHeader
        title="Content Management"
        description="User-friendly CMS with SEO tools."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" />
            Content Management System
          </CardTitle>
          <CardDescription>
            Organize, create, and manage your digital content efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Content Management will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
