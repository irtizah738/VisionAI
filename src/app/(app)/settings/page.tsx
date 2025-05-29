"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { LoadingPage } from '@/components/ui/loading';
import { ProfileForm } from './profile-form';
import { ApiKeySection } from './api-key-section';
import { SocialAccountsSection } from './social-accounts-section';

async function getSettings(userId: string) {
  const [user, apiKeys, socialAccounts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.socialAccount.findMany({
      where: { userId },
    }),
  ]);

  return { user, apiKeys, socialAccounts };
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  const data = await getSettings(session.user.id);

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Profile</h2>
          <Suspense fallback={<LoadingPage />}>
            <ProfileForm user={data.user} />
          </Suspense>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">API Keys</h2>
          <Suspense fallback={<LoadingPage />}>
            <ApiKeySection apiKeys={data.apiKeys} />
          </Suspense>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Connected Accounts</h2>
          <Suspense fallback={<LoadingPage />}>
            <SocialAccountsSection accounts={data.socialAccounts} />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

