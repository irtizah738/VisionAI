
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConfigureReportParametersPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Configure Report Parameters"
        description="Set default parameters and templates for your reports."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Report Configuration
          </CardTitle>
          <CardDescription>
            Manage default settings, templates, and scheduling for your reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <Settings2 className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Options for setting default report parameters, creating report templates, and managing scheduled reports will be available here.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button>Save Configuration</Button>
        </CardFooter>
      </Card>
    </>
  );
}
