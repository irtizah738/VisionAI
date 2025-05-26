
"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisionAILogo } from "@/components/icons";
import { Mail, Lock, Facebook as FacebookIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast"; // Added
import { useRouter } from "next/navigation"; // Added

export default function LoginPage() {
  const { toast } = useToast(); // Added
  const router = useRouter(); // Added

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link behavior
    toast({
      title: "Password Reset",
      description: "If your email is registered, a password reset link has been sent.",
    });
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate login and redirect
    toast({
      title: "Login Successful",
      description: "Redirecting to dashboard...",
    });
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <VisionAILogo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>
          Sign in to access your VisionAI dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="email" type="email" placeholder="m@example.com" required className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={handleForgotPassword} // Added onClick handler
                prefetch={false}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="password" type="password" required className="pl-10" />
            </div>
          </div>
          <Button type="submit" className="w-full text-lg py-6">
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="w-full py-5 text-base" onClick={() => toast({ title: "Google Login", description: "Google login functionality coming soon." })}>
            {/* Placeholder for Google Icon. Lucide doesn't have one. */}
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google
          </Button>
          <Button variant="outline" className="w-full py-5 text-base" onClick={() => toast({ title: "Facebook Login", description: "Facebook login functionality coming soon." })}>
            <FacebookIcon className="mr-2 h-5 w-5 text-[#1877F2]" />
            Facebook
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup" // Changed to /signup
          className="ml-1 font-semibold text-primary hover:underline"
          prefetch={false}
        >
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
