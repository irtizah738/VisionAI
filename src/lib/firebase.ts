import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import blueprint from '../../firebase-blueprint.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId;

// Extract validation constants directly from firebase-blueprint.json
export const BLUEPRINT_LIMITS = {
  idPattern: new RegExp(
    blueprint.entities.UserProfile.properties.uid.pattern || '^[a-zA-Z0-9_\\-]+$'
  ),
  maxIdLength: blueprint.entities.UserProfile.properties.uid.maxLength || 128,
  maxDisplayNameLength:
    blueprint.entities.UserProfile.properties.displayName.maxLength || 100,
  maxAvatarUrlLength:
    blueprint.entities.UserProfile.properties.avatarUrl.maxLength || 500,
  maxEmailLength:
    blueprint.entities.UserPrivateInfo.properties.email.maxLength || 254,
  maxTimezoneLength:
    blueprint.entities.UserPrivateInfo.properties.timezone.maxLength || 64,
  maxLanguageLength:
    blueprint.entities.UserPrivateInfo.properties.language.maxLength || 10,
  maxPostContentLength:
    blueprint.entities.SocialPost.properties.content.maxLength || 5000,
  maxHandleLength:
    blueprint.entities.SocialPost.properties.handle.maxLength || 100,
  maxCampaignNameLength:
    blueprint.entities.Campaign.properties.name.maxLength || 150,
  maxCampaignDescLength:
    blueprint.entities.Campaign.properties.description.maxLength || 2000,
  maxBrandNameLength:
    blueprint.entities.BrandVoice.properties.brandName.maxLength || 100,
  maxBrandToneLength:
    blueprint.entities.BrandVoice.properties.tone.maxLength || 150,
  maxBrandAudienceLength:
    blueprint.entities.BrandVoice.properties.targetAudience.maxLength || 500,
  maxBrandPillarsLength:
    blueprint.entities.BrandVoice.properties.keyPillars.maxLength || 1000,
  maxBrandBannedLength:
    blueprint.entities.BrandVoice.properties.bannedWords.maxLength || 500,
  maxBrandCtaLength:
    blueprint.entities.BrandVoice.properties.ctaStyle.maxLength || 250,
  maxWorkspaceTitleLength:
    blueprint.entities.WorkspaceItem.properties.title.maxLength || 150,
  maxWorkspaceSummaryLength:
    blueprint.entities.WorkspaceItem.properties.summary.maxLength || 2000,
};

export function sanitizeFirestoreId(rawId: string): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, BLUEPRINT_LIMITS.maxIdLength);
  return cleaned.length > 0 ? cleaned : `doc_${Date.now()}`;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;

export async function testFirestoreConnection(): Promise<void> {
  if (connectionTested || typeof window === 'undefined') return;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

export async function ensureUserProfileInFirestore(params: {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  timezone?: string;
  language?: string;
}): Promise<void> {
  const safeUid = sanitizeFirestoreId(params.uid);
  const userPath = `users/${safeUid}`;
  const privatePath = `users/${safeUid}/private/settings`;

  const cleanDisplayName = (params.displayName || 'VisionAI User')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxDisplayNameLength);
  const cleanAvatarUrl = (params.avatarUrl || '').slice(
    0,
    BLUEPRINT_LIMITS.maxAvatarUrlLength
  );
  const cleanEmail = (params.email || 'user@vision.ai')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxEmailLength);
  const cleanTimezone = (params.timezone || 'America/New_York')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxTimezoneLength);
  const cleanLanguage = (params.language || 'en')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxLanguageLength);

  try {
    const existingProfile = await getDoc(doc(db, 'users', safeUid));
    if (!existingProfile.exists()) {
      await setDoc(doc(db, 'users', safeUid), {
        uid: safeUid,
        displayName: cleanDisplayName || 'VisionAI User',
        avatarUrl: cleanAvatarUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(doc(db, 'users', safeUid), {
        displayName: cleanDisplayName || 'VisionAI User',
        avatarUrl: cleanAvatarUrl,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  try {
    const existingPrivate = await getDoc(
      doc(db, 'users', safeUid, 'private', 'settings')
    );
    if (!existingPrivate.exists()) {
      await setDoc(doc(db, 'users', safeUid, 'private', 'settings'), {
        uid: safeUid,
        email: cleanEmail,
        timezone: cleanTimezone,
        language: cleanLanguage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(doc(db, 'users', safeUid, 'private', 'settings'), {
        email: cleanEmail,
        timezone: cleanTimezone,
        language: cleanLanguage,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, privatePath);
  }
}

export async function savePostToFirestore(params: {
  id: string;
  userId: string;
  network: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  handle: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledTime: string;
}): Promise<void> {
  const safeId = sanitizeFirestoreId(params.id);
  const safeUid = sanitizeFirestoreId(params.userId);
  const path = `posts/${safeId}`;
  const validNetworks = ['twitter', 'linkedin', 'instagram', 'facebook', 'youtube'];
  const validStatuses = ['draft', 'scheduled', 'published'];

  const network = validNetworks.includes(params.network)
    ? params.network
    : 'twitter';
  const status = validStatuses.includes(params.status)
    ? params.status
    : 'scheduled';
  const handle = (params.handle || '@VisionAI_HQ')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxHandleLength);
  const content = (params.content || 'Scheduled post')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxPostContentLength);
  const scheduledTime = (params.scheduledTime || 'Scheduled')
    .trim()
    .slice(0, 100);

  try {
    const docRef = doc(db, 'posts', safeId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        userId: safeUid,
        network,
        handle,
        content,
        status,
        scheduledTime,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else if (snap.data()?.status !== 'published') {
      await updateDoc(docRef, {
        network,
        handle,
        content,
        status,
        scheduledTime,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePostFromFirestore(id: string): Promise<void> {
  const safeId = sanitizeFirestoreId(id);
  const path = `posts/${safeId}`;
  try {
    await deleteDoc(doc(db, 'posts', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSocialAccountToFirestore(params: {
  id: string;
  userId: string;
  provider: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  accountName: string;
  handle: string;
  status: 'connected' | 'disconnected';
}): Promise<void> {
  const safeId = sanitizeFirestoreId(params.id);
  const safeUid = sanitizeFirestoreId(params.userId);
  const path = `socialAccounts/${safeId}`;
  const validProviders = ['twitter', 'linkedin', 'instagram', 'facebook', 'youtube'];

  const provider = validProviders.includes(params.provider)
    ? params.provider
    : 'twitter';
  const accountName = (params.accountName || 'VisionAI Official')
    .trim()
    .slice(0, 100);
  const handle = (params.handle || '@VisionAI_HQ').trim().slice(0, 100);
  const status = params.status === 'disconnected' ? 'disconnected' : 'connected';

  try {
    const docRef = doc(db, 'socialAccounts', safeId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        userId: safeUid,
        provider,
        accountName,
        handle,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        accountName,
        handle,
        status,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSocialAccountFromFirestore(id: string): Promise<void> {
  const safeId = sanitizeFirestoreId(id);
  const path = `socialAccounts/${safeId}`;
  try {
    await deleteDoc(doc(db, 'socialAccounts', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveCampaignToFirestore(params: {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'social' | 'email' | 'seo' | 'multi-channel' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
}): Promise<void> {
  const safeId = sanitizeFirestoreId(params.id);
  const safeUid = sanitizeFirestoreId(params.userId);
  const path = `campaigns/${safeId}`;
  const validTypes = ['social', 'email', 'seo', 'multi-channel', 'content'];
  const validStatuses = ['draft', 'active', 'paused', 'completed'];

  const type = validTypes.includes(params.type) ? params.type : 'multi-channel';
  const status = validStatuses.includes(params.status) ? params.status : 'active';
  const name = (params.name || 'Untitled Campaign')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxCampaignNameLength);
  const description = (params.description || '')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxCampaignDescLength);
  const budget = Math.max(0, Math.min(100000000, Number(params.budget) || 0));

  try {
    const docRef = doc(db, 'campaigns', safeId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        userId: safeUid,
        name,
        description,
        type,
        status,
        budget,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else if (snap.data()?.status !== 'completed') {
      await updateDoc(docRef, {
        name,
        description,
        type,
        status,
        budget,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveBrandVoiceToFirestore(params: {
  userId: string;
  brandName: string;
  tone: string;
  targetAudience: string;
  keyPillars: string;
  bannedWords: string;
  ctaStyle: string;
}): Promise<void> {
  const safeUid = sanitizeFirestoreId(params.userId);
  const path = `brandVoices/${safeUid}`;

  const brandName = (params.brandName || 'VisionAI Technologies')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxBrandNameLength);
  const tone = (params.tone || 'Authoritative, Data-Driven & Executive')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxBrandToneLength);
  const targetAudience = (
    params.targetAudience ||
    'B2B SaaS CMOs, VPs of Growth, and Social Media Directors'
  )
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxBrandAudienceLength);
  const keyPillars = (
    params.keyPillars ||
    '1. Fold-Aware Native Previews 2. Multi-Network Attribution 3. Zero-Slop Executive Clarity'
  )
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxBrandPillarsLength);
  const bannedWords = (params.bannedWords || 'synergy, delve, game-changer')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxBrandBannedLength);
  const ctaStyle = (
    params.ctaStyle ||
    'Direct benchmark link with quantifiable ROI proof above the fold'
  )
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxBrandCtaLength);

  try {
    const docRef = doc(db, 'brandVoices', safeUid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        userId: safeUid,
        brandName,
        tone,
        targetAudience,
        keyPillars,
        bannedWords,
        ctaStyle,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        brandName,
        tone,
        targetAudience,
        keyPillars,
        bannedWords,
        ctaStyle,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveWorkspaceItemToFirestore(params: {
  id: string;
  userId: string;
  suite: 'content' | 'cro' | 'crm' | 'segment' | 'project' | 'inbox';
  title: string;
  status: string;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
}): Promise<void> {
  const safeId = sanitizeFirestoreId(params.id);
  const safeUid = sanitizeFirestoreId(params.userId);
  const path = `workspaceItems/${safeId}`;
  const validSuites = ['content', 'cro', 'crm', 'segment', 'project', 'inbox'];
  const suite = validSuites.includes(params.suite) ? params.suite : 'content';

  const title = (params.title || 'Untitled Record')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxWorkspaceTitleLength);
  const status = (params.status || 'active').trim().slice(0, 64);
  const summary = (params.summary || '')
    .trim()
    .slice(0, BLUEPRINT_LIMITS.maxWorkspaceSummaryLength);
  const primaryMetric = Math.max(
    0,
    Math.min(1000000000, Number(params.primaryMetric) || 0)
  );
  const secondaryMetric = Math.max(
    -1000000,
    Math.min(1000000000, Number(params.secondaryMetric) || 0)
  );

  try {
    const docRef = doc(db, 'workspaceItems', safeId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        userId: safeUid,
        suite,
        title,
        status,
        summary,
        primaryMetric,
        secondaryMetric,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        title,
        status,
        summary,
        primaryMetric,
        secondaryMetric,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWorkspaceItemFromFirestore(id: string): Promise<void> {
  const safeId = sanitizeFirestoreId(id);
  const path = `workspaceItems/${safeId}`;
  try {
    await deleteDoc(doc(db, 'workspaceItems', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
