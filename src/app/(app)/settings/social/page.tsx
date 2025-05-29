"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/page-header';
import { AccountManager } from '@/components/social/account-manager';
import { Platform } from '@/types/campaign';
import { useSocialAccounts } from '@/hooks/use-social-accounts';
import { useToast } from '@/hooks/use-toast';
import { SocialService } from '@/services/social';
import { MetaPlatform } from '@/services/social/platforms/meta';

// Initialize social service with platform implementations
const socialService = new SocialService();

// Register platforms with their configurations
socialService.registerPlatform(
  'facebook',
  new MetaPlatform({
    clientId: process.env.NEXT_PUBLIC_META_CLIENT_ID!,
    clientSecret: process.env.META_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/settings/social`,
    scopes: ['public_profile', 'pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
  })
);

export default function SocialSettingsPage() {
  const t = useTranslations('social');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: accounts, isLoading, mutate } = useSocialAccounts();

  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const platform = searchParams.get('platform');

    if (code && platform) {
      const handleCallback = async () => {
        try {
          const platformInstance = socialService.getPlatform(platform as Platform);
          const account = await platformInstance.handleAuthCallback(code);
          
          // Save the account to your backend
          const response = await fetch('/api/social-accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account),
          });

          if (!response.ok) {
            throw new Error('Failed to save social account');
          }

          await mutate();
          toast({
            title: t('connectSuccess.title'),
            description: t('connectSuccess.description', {
              platform: t(`platforms.${platform}`),
            }),
          });
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          toast({
            title: t('connectError.title'),
            description: t('connectError.description'),
            variant: 'destructive',
          });
        }
      };

      handleCallback();
      // Clear the URL parameters
      router.replace('/settings/social');
    }
  }, [searchParams, router, toast, t, mutate]);

  const handleConnect = async (platform: Platform) => {
    try {
      const platformInstance = socialService.getPlatform(platform);
      const authUrl = platformInstance.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating connection:', error);
      toast({
        title: t('connectError.title'),
        description: t('connectError.description'),
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect account');
      }

      await mutate();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading={t('settings.title')}
        description={t('settings.description')}
      />

      <AccountManager
        accounts={accounts || []}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isLoading={isLoading}
      />
    </div>
  );
} 
 