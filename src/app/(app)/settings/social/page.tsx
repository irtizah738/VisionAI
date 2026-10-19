"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/page-header";
import { AccountManager } from "@/components/social/account-manager";
import { Platform } from "@/types/campaign";
import { useSocialAccounts } from "@/hooks/use-social-accounts";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import {
  saveSocialAccountToFirestore,
  deleteSocialAccountFromFirestore,
} from "@/lib/firebase";

function SocialSettingsContent() {
  const t = useTranslations("social");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: accounts, isLoading, mutate } = useSocialAccounts();
  const { user: firebaseUser } = useFirebase();

  useEffect(() => {
    const code = searchParams.get("code");
    const platform = searchParams.get("platform");

    if (code && platform) {
      const handleCallback = async () => {
        try {
          const response = await fetch("/api/social-accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform }),
          });

          if (!response.ok) {
            throw new Error("Failed to save social account");
          }

          const saved = await response.json();
          if (firebaseUser && firebaseUser.emailVerified && saved?.id) {
            await saveSocialAccountToFirestore({
              id: `${firebaseUser.uid}_${saved.id}`,
              userId: firebaseUser.uid,
              provider: platform as any,
              accountName: saved.accountName || `VisionAI ${platform}`,
              handle: saved.username || `@visionai_${platform}`,
              status: "connected",
            });
          }

          await mutate();
          toast({
            title: t("connectSuccess.title"),
            description: t("connectSuccess.description", {
              platform: t(`platforms.${platform}`),
            }),
          });
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
          toast({
            title: t("connectError.title"),
            description: t("connectError.description"),
            variant: "destructive",
          });
        }
      };

      handleCallback();
      router.replace("/settings/social");
    }
  }, [searchParams, router, toast, t, mutate, firebaseUser]);

  const handleConnect = async (platform: Platform) => {
    try {
      const response = await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect social account");
      }

      const saved = await response.json();
      if (firebaseUser && firebaseUser.emailVerified && saved?.id) {
        await saveSocialAccountToFirestore({
          id: `${firebaseUser.uid}_${saved.id}`,
          userId: firebaseUser.uid,
          provider: platform as any,
          accountName: saved.accountName || `VisionAI ${platform}`,
          handle: saved.username || `@visionai_${platform}`,
          status: "connected",
        });
      }

      await mutate();
      toast({
        title: t("connectSuccess.title"),
        description: t("connectSuccess.description", {
          platform: t(`platforms.${platform}`),
        }),
      });
    } catch (error) {
      console.error("Error initiating connection:", error);
      toast({
        title: t("connectError.title"),
        description: t("connectError.description"),
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-accounts/${accountId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteSocialAccountFromFirestore(
          `${firebaseUser.uid}_${accountId}`
        );
      }

      await mutate();
    } catch (error) {
      console.error("Error disconnecting account:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.title")}
        description={t("settings.description")}
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

export default function SocialSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground">
          Loading social settings...
        </div>
      }
    >
      <SocialSettingsContent />
    </Suspense>
  );
}