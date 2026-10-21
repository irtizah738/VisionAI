
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderPlus } from "lucide-react";

export default function CreateProjectPage() {
  return (
    <>
      <PageHeader
        title="Create New Project"
        description="Start a new marketing project and define its scope."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderPlus className="h-6 w-6 text-primary" />
            New Project Setup
          </CardTitle>
          <CardDescription>
            Outline your new project&apos;s details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <FolderPlus className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Enter project name, description, assign team members, set deadlines, and add initial tasks here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
