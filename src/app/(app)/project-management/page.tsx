
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KanbanSquare } from "lucide-react";

export default function ProjectManagementPage() {
  return (
    <>
      <PageHeader
        title="Project Management"
        description="Task management with AI forecasting."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KanbanSquare className="h-6 w-6 text-primary" />
            Marketing Project Planner
          </CardTitle>
          <CardDescription>
            Organize tasks, track progress, and leverage AI for project forecasting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for Project Management will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
