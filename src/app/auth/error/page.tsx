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

export const dynamic = "force-dynamic";

interface ErrorPageProps {
  searchParams: Promise<{ error?: string }> | { error?: string };
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const resolvedParams = await Promise.resolve(searchParams);
  const error = resolvedParams?.error;

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Authentication Error</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            {error === "AccessDenied"
              ? "You do not have permission to access this resource."
              : error === "Configuration"
              ? "There is a problem with the server authentication configuration."
              : error === "Verification"
              ? "The verification link has expired or has already been used."
              : "There was an error completing your authentication request."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-muted-foreground">
            {error === "AccessDenied"
              ? "Please contact your administrator if you believe this is a mistake."
              : "Please try again or contact support if the problem persists."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/login">
              Try Again
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
