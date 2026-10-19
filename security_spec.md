# VisionAI Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Global Default-Deny Gate**: Any path not explicitly matched is strictly denied (`allow read, write: if false;`).
2. **Verified Identity Enforcement**: Every write operation (`create`, `update`, `delete`) requires `request.auth != null` and `request.auth.token.email_verified == true`.
3. **Path Variable Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) validates its path ID parameter using `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
4. **PII Split-Collection Isolation**: User email addresses and private preferences live exclusively in `/users/{userId}/private/{docId}`, where `read` and `write` are strictly limited to `request.auth.uid == userId` and `exists(/databases/$(database)/documents/users/$(userId))`.
5. **Relational Parent Existence (Master Gate)**:
   - Creating a `/users/{userId}/private/{docId}` document requires the parent `/users/{userId}` document to exist (`exists(/databases/$(database)/documents/users/$(userId))`).
   - Creating a `/posts/{postId}`, `/socialAccounts/{accountId}`, or `/campaigns/{campaignId}` document requires the owner's `/users/{userId}` profile to exist (`exists(/databases/$(database)/documents/users/$(request.auth.uid))`).
6. **Immutable Ownership & Creation Timestamps**:
   - `uid` / `userId` and `createdAt` can never be mutated during an `update`.
   - On `create`, `createdAt == request.time && updatedAt == request.time`.
   - On `update`, `updatedAt == request.time`.
7. **Terminal State Locking**:
   - Once a `SocialPost` reaches `status == 'published'`, it is locked from further updates (`existing().status != 'published'`).
   - Once a `Campaign` reaches `status == 'completed'`, it is locked from further updates (`existing().status != 'completed'`).
8. **Secure List Queries (Query Enforcer)**:
   - Every `allow list` rule enforces ownership directly on `resource.data` (`resource.data.userId == request.auth.uid`) without any `get()` or `exists()` calls inside `list`.

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 — Identity Spoofing on Post Creation**:
   Authenticated as `user_alpha`, attempts `create` on `/posts/post_1` with `userId: "user_victim"`.
2. **Payload 2 — Unverified Email Write**:
   Authenticated as `user_alpha` with `email_verified: false`, attempts `create` on `/users/user_alpha`.
3. **Payload 3 — Shadow Field Injection on Post Update**:
   Authenticated as `user_alpha`, attempts `update` on `/posts/post_1` adding `isVerifiedAdmin: true`.
4. **Payload 4 — PII Cross-User Snooping**:
   Authenticated as `user_attacker`, attempts `get` on `/users/user_alpha/private/settings`.
5. **Payload 5 — Blanket List Scraping on Posts**:
   Authenticated as `user_attacker`, attempts `list` on `/posts` without filtering `where('userId', '==', 'user_attacker')`.
6. **Payload 6 — Terminal State Reversal on Published Post**:
   Authenticated as `user_alpha`, attempts `update` on `/posts/published_post_1` where `existing().status == 'published'` back to `status: 'draft'`.
7. **Payload 7 — Terminal State Mutation on Completed Campaign**:
   Authenticated as `user_alpha`, attempts `update` on `/campaigns/camp_completed` where `existing().status == 'completed'` to increase `budget`.
8. **Payload 8 — Forged Client Timestamp (`createdAt`)**:
   Authenticated as `user_alpha`, attempts `create` on `/posts/post_2` with a backdated `createdAt` timestamp instead of `request.time`.
9. **Payload 9 — Immortal Field Mutation (`createdAt` / `userId`)**:
   Authenticated as `user_alpha`, attempts `update` on `/campaigns/camp_1` changing `userId` to `"user_beta"`.
10. **Payload 10 — Value Poisoning / Oversized Content**:
    Authenticated as `user_alpha`, attempts `create` on `/posts/post_3` with a `content` string of length `6000` (exceeding `maxLength: 5000`).
11. **Payload 11 — Path Variable ID Poisoning**:
    Authenticated as `user_alpha`, attempts `create` on `/posts/invalid$id!with*special` failing `^[a-zA-Z0-9_\-]+$`.
12. **Payload 12 — Orphaned Record Creation Without Parent Profile**:
    Authenticated as `user_no_profile` (who has no `/users/user_no_profile` document), attempts `create` on `/posts/post_orphan`.

---

## 3. The Test Runner (`firestore.rules.test.ts`)

See `/firestore.rules.test.ts` for the complete test suite verifying that all 12 Dirty Dozen payloads return `PERMISSION_DENIED`.
