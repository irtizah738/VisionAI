"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  auth,
  db,
  googleProvider,
  testFirestoreConnection,
  ensureUserProfileInFirestore,
  savePostToFirestore,
  saveSocialAccountToFirestore,
  saveCampaignToFirestore,
  saveBrandVoiceToFirestore,
  saveWorkspaceItemToFirestore,
  handleFirestoreError,
  OperationType,
  FIREBASE_PROJECT_ID,
} from "@/lib/firebase";

export interface CloudPostRecord {
  id: string;
  userId: string;
  network: string;
  handle: string;
  content: string;
  status: string;
  scheduledTime: string;
}

export interface CloudAccountRecord {
  id: string;
  userId: string;
  provider: string;
  accountName: string;
  handle: string;
  status: string;
}

export interface CloudCampaignRecord {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  budget: number;
}

export interface CloudBrandVoiceRecord {
  userId: string;
  brandName: string;
  tone: string;
  targetAudience: string;
  keyPillars: string;
  bannedWords: string;
  ctaStyle: string;
}

export interface CloudWorkspaceItemRecord {
  id: string;
  userId: string;
  suite: "content" | "cro" | "crm" | "segment" | "project" | "inbox";
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
}

interface FirebaseContextValue {
  user: User | null;
  isAuthReady: boolean;
  isSyncing: boolean;
  projectId: string;
  cloudPosts: CloudPostRecord[];
  cloudAccounts: CloudAccountRecord[];
  cloudCampaigns: CloudCampaignRecord[];
  cloudBrandVoice: CloudBrandVoiceRecord | null;
  cloudWorkspaceItems: CloudWorkspaceItemRecord[];
  signInWithGoogle: () => Promise<User | null>;
  signOutFirebase: () => Promise<void>;
  syncWorkspaceToFirestore: () => Promise<number>;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  user: null,
  isAuthReady: false,
  isSyncing: false,
  projectId: FIREBASE_PROJECT_ID,
  cloudPosts: [],
  cloudAccounts: [],
  cloudCampaigns: [],
  cloudBrandVoice: null,
  cloudWorkspaceItems: [],
  signInWithGoogle: async () => null,
  signOutFirebase: async () => {},
  syncWorkspaceToFirestore: async () => 0,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudPosts, setCloudPosts] = useState<CloudPostRecord[]>([]);
  const [cloudAccounts, setCloudAccounts] = useState<CloudAccountRecord[]>([]);
  const [cloudCampaigns, setCloudCampaigns] = useState<CloudCampaignRecord[]>([]);
  const [cloudBrandVoice, setCloudBrandVoice] = useState<CloudBrandVoiceRecord | null>(null);
  const [cloudWorkspaceItems, setCloudWorkspaceItems] = useState<CloudWorkspaceItemRecord[]>([]);

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser && currentUser.emailVerified) {
        try {
          await ensureUserProfileInFirestore({
            uid: currentUser.uid,
            displayName: currentUser.displayName || "VisionAI User",
            email: currentUser.email || "user@vision.ai",
            avatarUrl: currentUser.photoURL || "",
          });
        } catch (err) {
          console.error("Failed to bootstrap user profile in Firestore:", err);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setCloudPosts([]);
      setCloudAccounts([]);
      setCloudCampaigns([]);
      setCloudBrandVoice(null);
      setCloudWorkspaceItems([]);
      return;
    }

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", user.uid)
    );
    const unsubPosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        const items: CloudPostRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CloudPostRecord, "id">),
        }));
        setCloudPosts(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "posts");
      }
    );

    const accountsQuery = query(
      collection(db, "socialAccounts"),
      where("userId", "==", user.uid)
    );
    const unsubAccounts = onSnapshot(
      accountsQuery,
      (snapshot) => {
        const items: CloudAccountRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CloudAccountRecord, "id">),
        }));
        setCloudAccounts(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "socialAccounts");
      }
    );

    const campaignsQuery = query(
      collection(db, "campaigns"),
      where("userId", "==", user.uid)
    );
    const unsubCampaigns = onSnapshot(
      campaignsQuery,
      (snapshot) => {
        const items: CloudCampaignRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CloudCampaignRecord, "id">),
        }));
        setCloudCampaigns(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "campaigns");
      }
    );

    const brandVoiceRef = doc(db, "brandVoices", user.uid);
    const unsubBrandVoice = onSnapshot(
      brandVoiceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCloudBrandVoice(snapshot.data() as CloudBrandVoiceRecord);
        } else {
          setCloudBrandVoice(null);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `brandVoices/${user.uid}`);
      }
    );

    const workspaceItemsQuery = query(
      collection(db, "workspaceItems"),
      where("userId", "==", user.uid)
    );
    const unsubWorkspaceItems = onSnapshot(
      workspaceItemsQuery,
      (snapshot) => {
        const items: CloudWorkspaceItemRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CloudWorkspaceItemRecord, "id">),
        }));
        setCloudWorkspaceItems(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "workspaceItems");
      }
    );

    return () => {
      unsubPosts();
      unsubAccounts();
      unsubCampaigns();
      unsubBrandVoice();
      unsubWorkspaceItems();
    };
  }, [isAuthReady, user]);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    const credential = await signInWithPopup(auth, googleProvider);
    if (credential.user && credential.user.emailVerified) {
      await ensureUserProfileInFirestore({
        uid: credential.user.uid,
        displayName: credential.user.displayName || "VisionAI User",
        email: credential.user.email || "user@vision.ai",
        avatarUrl: credential.user.photoURL || "",
      });
    }
    return credential.user;
  }, []);

  const signOutFirebase = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const syncWorkspaceToFirestore = useCallback(async (): Promise<number> => {
    if (!auth.currentUser) {
      throw new Error("Sign in with Google first to sync workspace data to Firestore.");
    }
    setIsSyncing(true);
    let syncedCount = 0;
    try {
      const uid = auth.currentUser.uid;
      await ensureUserProfileInFirestore({
        uid,
        displayName: auth.currentUser.displayName || "VisionAI User",
        email: auth.currentUser.email || "user@vision.ai",
        avatarUrl: auth.currentUser.photoURL || "",
      });

      const [streamsRes, campaignsRes, brandVoiceRes, suitesRes] = await Promise.all([
        fetch("/api/streams"),
        fetch("/api/campaigns"),
        fetch("/api/user/brand-voice"),
        fetch("/api/workspace-suites"),
      ]);

      if (streamsRes.ok) {
        const streamsData = await streamsRes.json();
        const allPosts = [
          ...(streamsData.scheduledPosts || []),
          ...(streamsData.publishedPosts || []),
        ];
        for (const post of allPosts) {
          await savePostToFirestore({
            id: `${uid}_${post.id}`,
            userId: uid,
            network: post.network || "twitter",
            handle: post.handle || "@VisionAI_HQ",
            content: post.content || "",
            status: post.status === "published" ? "published" : "scheduled",
            scheduledTime: post.scheduledTime || "Scheduled",
          });
          syncedCount++;
        }

        const accounts = streamsData.socialAccounts || [];
        for (const acc of accounts) {
          await saveSocialAccountToFirestore({
            id: `${uid}_${acc.id || acc.provider}`,
            userId: uid,
            provider: acc.provider || "twitter",
            accountName: acc.accountName || "VisionAI Official",
            handle: acc.handle || "@VisionAI_HQ",
            status: acc.status === "disconnected" ? "disconnected" : "connected",
          });
          syncedCount++;
        }
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        for (const camp of campaignsData.campaigns || []) {
          await saveCampaignToFirestore({
            id: `${uid}_${camp.id}`,
            userId: uid,
            name: camp.name || "Campaign",
            description: camp.description || "",
            type: camp.type || "multi-channel",
            status: camp.status || "active",
            budget: Number(camp.budget) || 0,
          });
          syncedCount++;
        }
      }

      if (brandVoiceRes.ok) {
        const { brandVoice } = await brandVoiceRes.json();
        if (brandVoice) {
          await saveBrandVoiceToFirestore({
            userId: uid,
            brandName: brandVoice.brandName,
            tone: brandVoice.tone,
            targetAudience: brandVoice.targetAudience,
            keyPillars: brandVoice.keyPillars,
            bannedWords: brandVoice.bannedWords,
            ctaStyle: brandVoice.ctaStyle,
          });
          syncedCount++;
        }
      }

      if (suitesRes.ok) {
        const { items } = await suitesRes.json();
        for (const item of items || []) {
          await saveWorkspaceItemToFirestore({
            id: `${uid}_${item.id}`,
            userId: uid,
            suite: item.suite,
            title: item.title,
            status: item.status,
            summary: item.summary,
            primaryMetric: Number(item.primaryMetric) || 0,
            secondaryMetric: Number(item.secondaryMetric) || 0,
          });
          syncedCount++;
        }
      }

      return syncedCount;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isAuthReady,
        isSyncing,
        projectId: FIREBASE_PROJECT_ID,
        cloudPosts,
        cloudAccounts,
        cloudCampaigns,
        cloudBrandVoice,
        cloudWorkspaceItems,
        signInWithGoogle,
        signOutFirebase,
        syncWorkspaceToFirestore,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
