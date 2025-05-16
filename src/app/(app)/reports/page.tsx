
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Settings2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate and view detailed reports on your marketing activities."
        actions={
            <Button>
                <Download className="mr-2 h-4 w-4" /> Download All Reports
            </Button>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Available Reports
          </CardTitle>
          <CardDescription>
            Access comprehensive reports on campaign performance, audience engagement, SEO metrics, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Report Generation Hub</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              This section will allow you to select report types, customize date ranges, choose specific metrics, and generate downloadable reports (e.g., PDF, CSV).
            </p>
            <Button variant="outline" className="mt-6">
                <Settings2 className="mr-2 h-4 w-4" /> Configure Report Parameters
            </Button>
          </div>
          
          {/* Placeholder for a list of recently generated reports */}
           <Card>
            <CardHeader>
                <CardTitle className="text-lg">Recently Generated</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Monthly Campaign Summary - July 2024</li>
                    <li>SEO Keyword Performance - Q2 2024</li>
                    <li>Audience Engagement Report - Last 30 Days</li>
                </ul>
            </CardContent>
           </Card>
        </CardContent>
      </Card>
    </>
  );
}
