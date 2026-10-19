/**
 * Firestore Security Rules Verification Suite (Dirty Dozen Red-Team Payloads)
 * Verifies that all 12 adversarial payloads in security_spec.md are rejected.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email_verified: boolean } | null;
  docId: string;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Identity Spoofing on Post Creation',
    collection: 'posts',
    operation: 'create',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'post_1',
    payload: {
      userId: 'user_victim',
      network: 'twitter',
      handle: '@VisionAI_HQ',
      content: 'Spoofed post',
      status: 'scheduled',
      scheduledTime: 'Tomorrow, 9:00 AM',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Write',
    collection: 'users',
    operation: 'create',
    auth: { uid: 'user_alpha', email_verified: false },
    docId: 'user_alpha',
    payload: {
      uid: 'user_alpha',
      displayName: 'Unverified User',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Post Update',
    collection: 'posts',
    operation: 'update',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'post_1',
    payload: {
      content: 'Updated content',
      isVerifiedAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'PII Cross-User Snooping',
    collection: 'users/user_alpha/private',
    operation: 'get',
    auth: { uid: 'user_attacker', email_verified: true },
    docId: 'settings',
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Blanket List Scraping on Posts',
    collection: 'posts',
    operation: 'list',
    auth: { uid: 'user_attacker', email_verified: true },
    docId: '*',
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Terminal State Reversal on Published Post',
    collection: 'posts',
    operation: 'update',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'published_post_1',
    payload: {
      status: 'draft',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Terminal State Mutation on Completed Campaign',
    collection: 'campaigns',
    operation: 'update',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'camp_completed',
    payload: {
      budget: 999999,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Forged Client Timestamp on Create',
    collection: 'posts',
    operation: 'create',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'post_2',
    payload: {
      userId: 'user_alpha',
      network: 'linkedin',
      handle: 'VisionAI',
      content: 'Backdated post',
      status: 'draft',
      scheduledTime: '2020-01-01',
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Immortal Field Mutation (userId)',
    collection: 'campaigns',
    operation: 'update',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'camp_1',
    payload: {
      userId: 'user_beta',
      name: 'Transferred Campaign',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Value Poisoning / Oversized Post Content (>5000 chars)',
    collection: 'posts',
    operation: 'create',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'post_3',
    payload: {
      userId: 'user_alpha',
      network: 'twitter',
      handle: '@VisionAI_HQ',
      content: 'A'.repeat(6000),
      status: 'draft',
      scheduledTime: 'Tomorrow',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Path Variable ID Poisoning',
    collection: 'posts',
    operation: 'create',
    auth: { uid: 'user_alpha', email_verified: true },
    docId: 'invalid$id!with*special',
    payload: {
      userId: 'user_alpha',
      network: 'twitter',
      handle: '@VisionAI_HQ',
      content: 'Valid content',
      status: 'draft',
      scheduledTime: 'Tomorrow',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Orphaned Record Creation Without Parent Profile',
    collection: 'posts',
    operation: 'create',
    auth: { uid: 'user_no_profile', email_verified: true },
    docId: 'post_orphan',
    payload: {
      userId: 'user_no_profile',
      network: 'twitter',
      handle: '@VisionAI_HQ',
      content: 'Orphan post without user profile doc',
      status: 'draft',
      scheduledTime: 'Tomorrow',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];
