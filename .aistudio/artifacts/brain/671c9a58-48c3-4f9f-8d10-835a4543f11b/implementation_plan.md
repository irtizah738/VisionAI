# VisionAI — Full-Stack Backend & DevOps Architecture Plan

An end-to-end production backend and DevOps engineering blueprint for **VisionAI**, unifying zero-trust **Firebase Firestore RBAC persistence**, an idempotent **Scheduled Post Dispatch & Dead-Letter Retry Queue**, **3P OAuth 2.0 Token Refresh & HMAC Webhook Ingestion**, **OpenTelemetry-structured observability & rate limiting**, and automated **Google Cloud Run container deployment via GitHub Actions CI/CD**.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural choices below incorporate your confirmed selections from Phase 1. Review the plan and click **Proceed** to execute the full backend, API gateway, and DevOps pipeline upgrades.

- **Confirmed Decision 1 — Primary Persistence & Security**: **Firebase Firestore with Strict RBAC/ABAC Security Rules** (`ai-studio-visionai-671c9a58-48c3-4f9f-8d10-835a4543f11b`), enforcing zero-trust schema validation (`hasAll`/`hasOnly`), owner isolation (`request.auth.uid`), and anti-update-gap checks, paired with server-side state synchronization for background workers and webhook handlers.
- **Confirmed Decision 2 — Cloud Infrastructure & CI/CD**: **Google Cloud Run with Multi-Stage Docker & GitHub Actions CI/CD**, building a hardened standalone Node.js container on port `3000` with automated lint, typecheck, security rules validation, Artifact Registry push, and zero-downtime Cloud Run revision rollout.
- **Confirmed Decision 3 — Core Backend Services & Observability**:
  1. **Scheduled Post Dispatch Worker & Retry Queue**: Idempotent multi-network dispatcher across X/Twitter, LinkedIn, Instagram, Facebook, and YouTube with exponential backoff (`1s → 4s → 16s`) and dead-letter queue (DLQ) recovery.
  2. **Live OAuth 2.0 Token Refresh & Webhook Ingestion**: Popup-based 3P OAuth (`postMessage` cross-origin safe) with automatic token expiry detection/refresh and HMAC-SHA256 verified webhook ingestion for HubSpot CRM and Stripe revenue events.
  3. **OpenTelemetry Logging, Health Probes & Rate Limiting**: Structured JSON trace logging with correlation IDs (`x-request-id`), sliding-window IP/route rate limiting (`X-RateLimit-*` headers), and deep liveness/readiness probes.

---

### 1. Overview & Core Concept

- **What It Does**: Elevates VisionAI into a production-hardened SaaS backend and DevOps platform capable of reliably executing scheduled omnichannel broadcasts, refreshing expiring OAuth credentials, ingesting external CRM/revenue webhooks with cryptographic verification, enforcing per-tenant rate limits across Gemini AI endpoints, and deploying reproducibly to Google Cloud Run.
- **Target Audience / Persona**: Marketing Operations Directors, Growth Engineers, and DevOps/SRE teams managing high-velocity omnichannel publishing and AI content pipelines.
- **Key Value**: Eliminates silent publishing failures, expired OAuth tokens, unverified webhook payloads, and manual deployment drift through deterministic background workers, zero-trust Firestore rules, and an interactive **Backend & DevOps Control Plane** inside the workspace.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Backend & DevOps Operations Center**: Operators open the dedicated **System Health, Queue & DevOps** view (accessible from Settings & Monitoring) to inspect live service probes (Firestore latency, Gemini AI proxy status, OAuth provider readiness, and active rate-limit buckets).
  2. **Dispatch Queue & Retry Worker Execution**: When a user schedules or triggers a cross-network broadcast, the job enters the **Dispatch Queue** (`queued → processing → published` or `retrying → dead_letter`). Operators can trigger an immediate dispatch sweep, inspect per-network HTTP response latencies, or replay failed dead-letter jobs with a single click.
  3. **OAuth Token Lifecycle & Webhook Inspector**: Users connect social accounts via the iframe-safe OAuth popup flow, view token expiration countdowns, trigger manual token rotation, and test signed HubSpot/Stripe webhook payloads with live HMAC verification logs.
  4. **CI/CD & Cloud Run Deployment Telemetry**: Operators inspect container build metadata, environment readiness checks, security rule validation status, and structured OpenTelemetry request traces filtered by severity (`INFO`, `WARN`, `ERROR`).

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-Craft B2B SaaS Operational Clarity (following Linear / Vercel / Stripe dashboard precision).
  - *Color Palette & Mood (60-30-10 Discipline)*:
    - **60% Neutral Canvas**: Crisp Alabaster (`--background: 225 33% 98%`) in Light Mode and Carbon Obsidian (`--background: 226 42% 6%`) in Dark Mode.
    - **30% Structural Surfaces**: Pure White (`#FFFFFF`) / Elevated Slate (`#0F172A`) cards with `1px solid` hairline borders (`border-slate-200/90 dark:border-slate-800`).
    - **10% Semantic Status & Accent Budget**: Electric Cobalt-Indigo (`--primary: 245 86% 59%`) for primary actions, Emerald (`#10B981`) for healthy probes and `200 OK` dispatches, Amber (`#F59E0B`) for retry backoff and rate-limit warnings, and Rose (`#F43F5E`) for dead-letter faults or signature failures.
  - *Typography & Hierarchy*: `Plus Jakarta Sans` for UI headers and controls; `JetBrains Mono` with `font-variant-numeric: tabular-nums` for all latency metrics (`ms`), HTTP status codes, rate-limit counters, cron schedules, and trace IDs.
  - *Component Styling & Layout*: Bento-grid operational cards with max 4 data points per card, 16px–24px grid gaps, and zero horizontal overflow.

- **Interactive Feedback & Motion**:
  - Live spinner and optimistic state transition when running dispatch worker sweeps, rotating OAuth tokens, or firing test webhooks.
  - Toast notifications reporting exact execution duration (`ms`), trace IDs, and Firestore synchronization counts.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Zero-Trust Firestore Persistence + Server-Side Operational Mirror**
  - *Chosen Approach*: Client-side authenticated mutations write directly to Firebase Firestore (`ai-studio-visionai-671c9a58-48c3-4f9f-8d10-835a4543f11b`) governed by strict `firestore.rules`, while server-side API routes, webhook receivers, and the dispatch worker maintain a synchronized server store with atomic write-through.
  - *Why*: Ensures real-time multi-device reactivity via Firestore `onSnapshot` listeners while allowing background cron workers and external webhooks (which execute without a browser session) to process jobs deterministically.
  - *Alternatives Considered*: Client-only localStorage (rejected—cannot support server webhooks or scheduled background workers).

- **Decision 2: Idempotent Dispatch Queue with Exponential Backoff & Dead-Letter Queue (DLQ)**
  - *Chosen Approach*: Every scheduled social post is assigned a deterministic idempotency key (`hash(userId + network + content + scheduledTime)`) and processed through a state machine (`queued → processing → published | retrying → dead_letter`) with up to 3 attempts before moving to the DLQ for manual replay.
  - *Why*: Prevents duplicate social broadcasts when network timeouts occur on X, LinkedIn, Instagram, Facebook, or YouTube APIs, and gives marketing teams visibility into rate-limited or rejected posts.
  - *Alternatives Considered*: Fire-and-forget synchronous publishing (rejected—drops posts silently on transient 5xx or 429 provider responses).

- **Decision 3: Multi-Stage Standalone Docker Image & GitHub Actions Cloud Run Pipeline**
  - *Chosen Approach*: Package the Next.js application using standalone output tracing (`output: "standalone"`), non-root `nextjs` user (`UID 1001`), built-in `HEALTHCHECK` against `/api/health`, and an automated GitHub Actions pipeline that runs linting, TypeScript verification, Firestore security rule validation, container image build, and Cloud Run deployment.
  - *Why*: Reduces container image size by over 70%, enforces least-privilege container execution, and prevents broken builds or insecure Firestore rules from reaching production.
  - *Alternatives Considered*: Unstaged full-repo container builds (rejected—bloated image size and slow Cloud Run cold starts).

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

#### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                        VISIONAI CLIENT WORKSPACE (Next.js App Router)                │
│  ┌─────────────────────┐  ┌──────────────────────┐  ┌─────────────────────────────┐  │
│  │ Command Center &    │  │ Multi-Modal Gemini   │  │ Backend, Queue & DevOps     │  │
│  │ Social Preview UI   │  │ Studio (Chat/Img/Vid)│  │ Operations Control Plane    │  │
│  └─────────┬───────────┘  └──────────┬───────────┘  └──────────────┬──────────────┘  │
└────────────┼─────────────────────────┼─────────────────────────────┼─────────────────┘
             │                         │                             │
             ▼                         ▼                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                   API GATEWAY, MIDDLEWARE & OBSERVABILITY LAYER                      │
│  • Sliding-Window Rate Limiter (X-RateLimit-Limit / Remaining / Reset)               │
│  • OpenTelemetry Structured Logger & Request Trace Correlation (x-request-id)        │
│  • Deep Health & Readiness Probe (/api/health: Liveness, Firestore, AI, OAuth, Queue)│
└──────┬───────────────────────┬──────────────────────────┬─────────────────────┬──────┘
       │                       │                          │                     │
       ▼                       ▼                          ▼                     ▼
┌──────────────────┐  ┌────────────────────┐  ┌──────────────────────┐  ┌──────────────┐
│ GEMINI AI PROXY  │  │ DISPATCH WORKER &  │  │ OAUTH 2.0 & WEBHOOK  │  │ FIREBASE     │
│ (@google/genai)  │  │ RETRY QUEUE ENGINE │  │ INGESTION ENGINE     │  │ FIRESTORE    │
│ • gemini-4-argon │  │ • Idempotency Keys │  │ • Popup postMessage  │  │ • Zero-Trust │
│ • 3.8-flash+Srch │  │ • Exp Backoff (3x) │  │ • Token Auto-Refresh │  │   ABAC Rules │
│ • nano-banana-2.1│  │ • Dead-Letter Queue│  │ • HMAC-SHA256 Verify │  │ • Real-Time  │
│ • veo-3.1 / lyria│  │ • 5 Social APIs    │  │   (HubSpot & Stripe) │  │   onSnapshot │
└──────────────────┘  └────────────────────┘  └──────────────────────┘  └──────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                  DEVOPS & CLOUD RUN CI/CD PIPELINE (GitHub Actions)                  │
│  [1. Lint & Typecheck] ──► [2. Audit Firestore Rules] ──► [3. Docker Multi-Stage]    │
│  ──► [4. Push to Google Artifact Registry] ──► [5. Deploy to Google Cloud Run :3000] │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### Data Model & State

1. **Firestore Zero-Trust Collections (`firestore.rules` & `firebase-blueprint.json`)**:
   - `/users/{userId}` & `/users_private/{userId}`: Authenticated user profile and private locale/timezone settings (`isOwner(userId)`).
   - `/posts/{postId}`: Omnichannel social posts (`draft`, `scheduled`, `published`) with strict character bounds (`1..5000`), network enum validation, and immutable `userId`/`createdAt`.
   - `/socialAccounts/{accountId}`: Connected 3P OAuth channel metadata (`twitter`, `linkedin`, `instagram`, `facebook`, `youtube`), connection status, and sync timestamps.
   - `/campaigns/{campaignId}`: Omnichannel campaign budgets, attribution metrics, and lifecycle statuses.
   - `/brandVoices/{userId}`: Persistent AI Brand Voice Memory automatically injected into all server-side Gemini prompts.
   - `/workspaceItems/{itemId}`: Unified suite records (`content`, `cro`, `crm`, `segment`, `project`, `inbox`).

2. **Server-Side Queue, Webhook & Telemetry Store**:
   - **Dispatch Queue Jobs**: `{ id, postId, network, handle, status: 'queued' | 'processing' | 'published' | 'retrying' | 'dead_letter', attempts, maxAttempts, nextRetryAt, idempotencyKey, lastError, externalUrl, latencyMs }`.
   - **Webhook Event Ledger**: `{ id, provider: 'hubspot' | 'stripe', eventType, signatureVerified: boolean, payloadSummary, processedAt, status }`.
   - **OpenTelemetry Trace Ring Buffer**: `{ traceId, spanId, timestamp, level, route, method, statusCode, durationMs, message, metadata }`.

#### Interactive Component & State Mapping

- **Dispatch Worker Controls**:
  - *Run Queue Sweep*: Triggers `POST /api/social/publish` or worker sweep endpoint to process all due `scheduled` posts, updating job attempt counts, computing backoff timestamps on failure, and transitioning completed posts to `published` across both the server store and Firestore.
  - *Replay Dead-Letter Job*: Resets a failed job's attempt counter and immediately re-executes `dispatchToSocialNetwork()`.
- **OAuth 2.0 Token Refresh & Connection Manager**:
  - *Popup Authorization*: Calls `GET /api/oauth/[provider]/url`, opens the provider's OAuth screen directly, receives the `OAUTH_AUTH_SUCCESS` `postMessage` from `/api/oauth/callback`, and persists the connected account.
  - *Token Refresh Action*: Calls the token refresh handler to rotate expiring access tokens and update `lastSynced` timestamps.
- **Webhook Simulator & Signature Verifier**:
  - *Test Signed Webhook*: Dispatches a signed payload to `/api/webhooks/hubspot` or `/api/webhooks/stripe` using HMAC-SHA256 verification, appending the verified event to the CRM/Revenue attribution ledger and live telemetry stream.
- **Deep Health & Observability Inspector**:
  - *Live Probe Refresh*: Polls `GET /api/health` and `/api/telemetry` to display real-time subsystem statuses, memory/uptime metrics, rate-limit bucket utilization, and filterable OpenTelemetry trace logs.

#### Key Sequences & Integrations

1. **OAuth 2.0 Callback Sequence (Iframe-Safe)**:
   - User clicks **Connect Channel** → Client requests `/api/oauth/[provider]/url?redirectUri=...` → Opens provider URL in popup → Provider redirects to `/api/oauth/callback` → Server exchanges code for tokens, stores credentials in `SameSite=None; Secure; HttpOnly` cookies + store, and returns minimal HTML firing `window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*')`.
2. **Google Cloud Run & Docker Deployment Sequence**:
   - Push to `main` triggers GitHub Actions workflow → Runs `npm run lint` and `npx tsc --noEmit` → Validates `firestore.rules` syntax → Builds multi-stage production Docker image with `HEALTHCHECK` polling `http://localhost:3000/api/health` → Deploys revision to Google Cloud Run (`--port 3000 --allow-unauthenticated --min-instances 0 --max-instances 10`).
