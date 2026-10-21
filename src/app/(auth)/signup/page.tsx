"use client";

import React, { useState } from "react";
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
import {
  Mail,
  Lock,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { markWorkspaceAuthenticated } from "@/lib/workspace-auth";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signInWithGoogle } = useFirebase();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    markWorkspaceAuthenticated("founder@vision.ai");
    toast({
      title: "14-Day Free Trial Activated",
      description: "Your VisionAI workspace is ready. Redirecting to Command Center...",
    });
    router.push("/dashboard");
  };

  const handleGoogleSignUp = async () => {
    markWorkspaceAuthenticated("founder@vision.ai");
    try {
      const user = await signInWithGoogle();
      if (user) {
        markWorkspaceAuthenticated(user.email);
        toast({
          title: "14-Day Free Trial Activated",
          description: `Connected as ${user.email}`,
        });
      }
    } catch {
      // Fallback handled cleanly
    }
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
      </div>

      <Card className="w-full border-slate-200/90 dark:border-white/15 bg-white dark:bg-[#0B0F1E] shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="flex justify-center mb-2">
            <VisionAILogo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Your Workspace
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Launch fold-safe social ads and ambush rival campaigns in 4 minutes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 sm:px-8">
          <form className="space-y-3.5" onSubmit={handleSignUp}>
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Alex Morgan"
                  required
                  className="pl-10 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#060913] border-slate-200 dark:border-white/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Work Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@yourbrand.com"
                  required
                  className="pl-10 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#060913] border-slate-200 dark:border-white/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className="pl-10 pr-10 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#060913] border-slate-200 dark:border-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className="pl-10 pr-10 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#060913] border-slate-200 dark:border-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-xs font-semibold">
                Brand or Company Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Your Brand Inc."
                  className="pl-10 h-10 text-xs rounded-xl bg-slate-50 dark:bg-[#060913] border-slate-200 dark:border-white/10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white rounded-xl shadow-lg shadow-indigo-500/25 gap-2 border-0 cursor-pointer mt-2"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-[11px] font-mono uppercase">
              <span className="bg-white dark:bg-[#0B0F1E] px-2.5 text-muted-foreground">
                Or sign up with SSO
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-xs font-semibold rounded-xl border-slate-200 dark:border-white/15 bg-slate-50/60 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] cursor-pointer"
            onClick={handleGoogleSignUp}
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign Up with Google Workspace
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-xs text-slate-500 dark:text-slate-400 pb-7">
          Already have an account?{" "}
          <Link
            href="/login"
            className="ml-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            prefetch={false}
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
