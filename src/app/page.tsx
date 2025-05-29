"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">VisionAI</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        AI-Powered Marketing Platform
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/campaigns">View Campaigns</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
