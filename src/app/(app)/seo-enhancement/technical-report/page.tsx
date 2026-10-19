
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TechnicalSeoReportPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Full Technical SEO Report"
        description="Detailed analysis of your website's technical SEO health."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Technical SEO Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive report on site speed, mobile-friendliness, crawlability, indexing, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[400px] bg-muted/30">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              A detailed technical SEO report with specific metrics, issues, and recommendations will be displayed here.
            </p>
          </div>
        </CardContent>
         <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Back to SEO Tools</Button>
            <Button>Download Report</Button>
        </CardFooter>
      </Card>
    </>
  );
}
