
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListPlus } from "lucide-react";

export default function CreateTaskPage() {
  return (
    <>
      <PageHeader
        title="Add New Task"
        description="Create a new task for one of your marketing projects."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListPlus className="h-6 w-6 text-primary" />
            New Task Entry
          </CardTitle>
          <CardDescription>
            Detail the task requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
            <ListPlus className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Enter task details, assign to a project and team member, set due dates, and add sub-tasks here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
