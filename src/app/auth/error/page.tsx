"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>
          {error === "AccessDenied"
            ? "You do not have permission to access this resource."
            : "There was an error signing in."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {error === "AccessDenied"
            ? "Please contact your administrator if you believe this is a mistake."
            : "Please try again or contact support if the problem persists."}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/login">
            Try Again
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
} 