
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FullSchedulePage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Full Social Media Schedule"
        description="View your complete content calendar across all platforms."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Content Calendar
          </CardTitle>
          <CardDescription>
            A comprehensive view of all scheduled social media posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[400px] bg-muted/30">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-center">
              A detailed, filterable calendar view showing all scheduled posts across different platforms will be displayed here.
            </p>
          </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" onClick={() => router.back()}>Back to Social Manager</Button>
        </CardFooter>
      </Card>
    </>
  );
}
