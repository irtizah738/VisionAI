
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function AiContentGenerationPage() {
  return (
    <>
      <PageHeader
        title="AI Content Generation"
        description="Quick creation of various marketing content."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI-Powered Content Creation
          </CardTitle>
          <CardDescription>
            Generate diverse marketing copy, scripts, and more with AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for AI Content Generation will be displayed here.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
