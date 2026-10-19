
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCustomReportPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Create Custom Report"
        description="Define parameters and generate a new custom report."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus2 className="h-6 w-6 text-primary" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
            Select metrics, date ranges, and filters for your report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <FilePlus2 className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              Report building interface with metric selection, date pickers, and filter options will be here.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button>Generate Report</Button>
        </CardFooter>
      </Card>
    </>
  );
}
