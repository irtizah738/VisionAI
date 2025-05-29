"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Platform } from '@/types/campaign';
import { SocialAccount } from '@/services/social';
import { PlatformConnect } from './platform-connect';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AccountManagerProps {
  accounts: SocialAccount[];
  onConnect: (platform: Platform) => Promise<void>;
  onDisconnect: (accountId: string) => Promise<void>;
  isLoading?: boolean;
}

export function AccountManager({
  accounts,
  onConnect,
  onDisconnect,
  isLoading = false,
}: AccountManagerProps) {
  const t = useTranslations('social');
  const { toast } = useToast();
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const connectedPlatforms = accounts.map((account) => account.platform);

  const handleDisconnect = async (accountId: string) => {
    try {
      setDisconnecting(accountId);
      await onDisconnect(accountId);
      toast({
        title: t('disconnectSuccess.title'),
        description: t('disconnectSuccess.description'),
      });
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: t('disconnectError.title'),
        description: t('disconnectError.description'),
        variant: 'destructive',
      });
    } finally {
      setDisconnecting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlatformConnect
        onConnect={onConnect}
        connectedPlatforms={connectedPlatforms}
      />

      {accounts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('connectedAccounts')}</h3>
          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={account.profileUrl} />
                        <AvatarFallback>
                          {account.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{account.username}</CardTitle>
                        <CardDescription>
                          {t(`platforms.${account.platform}`)}
                        </CardDescription>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          disabled={disconnecting === account.id}
                        >
                          {disconnecting === account.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('disconnectConfirm.title')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('disconnectConfirm.description', {
                              platform: t(`platforms.${account.platform}`),
                              username: account.username,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t('disconnectConfirm.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDisconnect(account.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('disconnectConfirm.confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {t('lastSync')}: {new Date().toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 