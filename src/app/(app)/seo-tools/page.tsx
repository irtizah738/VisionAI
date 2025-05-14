
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SearchCheck } from "lucide-react";

export default function SeoToolsPage() {
  return (
    <>
      <PageHeader
        title="SEO Tools"
        description="AI-driven keyword research and optimization."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchCheck className="h-6 w-6 text-primary" />
            Comprehensive SEO Toolkit
          </CardTitle>
          <CardDescription>
            Access a suite of AI-driven tools for keyword research, site audits, and optimization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for SEO Tools will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
