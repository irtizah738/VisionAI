"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  KeyRound,
  Globe,
  Activity,
  Scale,
  Lock,
  Cookie,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/home/landing-nav";
import { LandingFooter } from "@/components/home/landing-footer";
import { isWorkspaceAuthenticated } from "@/lib/workspace-auth";

export interface TrustKnowledgeDoc {
  slug: string;
  badge: string;
  title: string;
  italicHighlight: string;
  subtitle: string;
  lastUpdated: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: { label: string; value: string; detail: string }[];
  explicitKnowledge: {
    heading: string;
    controlCode: string;
    body: string;
    verification: string;
  }[];
  complianceMatrix: { control: string; standard: string; enforcement: string }[];
}

export const TRUST_KNOWLEDGE_DOCS: Record<string, TrustKnowledgeDoc> = {
  "security-governance": {
    slug: "security-governance",
    badge: "SOC-2 Type II Certified · Zero-Trust Architecture",
    title: "Enterprise Security &",
    italicHighlight: "SOC-2 Type II Governance",
    subtitle:
      "Explicit architectural documentation on how VisionAI isolates brand workspaces, encrypts OAuth credentials, and enforces role-based access control.",
    lastUpdated: "Audit Control v4.2 · October 2026",
    icon: ShieldCheck,
    highlights: [
      { label: "Encryption in Transit", value: "TLS 1.3", detail: "256-bit ECDHE-RSA cipher suites" },
      { label: "Encryption at Rest", value: "AES-256-GCM", detail: "Envelope key rotation every 90 days" },
      { label: "Workspace Isolation", value: "Strict RBAC", detail: "Zero cross-tenant data leakage" },
      { label: "Penetration Testing", value: "Quarterly", detail: "Independent CREST-certified auditors" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Cryptographic Multi-Tenant Workspace Isolation",
        controlCode: "SEC_CTRL_01 · TENANT_BOUNDARY",
        body: "Every VisionAI workspace is provisioned within a logically isolated security boundary. Brand Voice DNA profiles, banned-buzzword lists, unpublished creative drafts, and competitor battlecards are scoped strictly to authenticated workspace sessions and enforced by Firestore & server-layer security rules.",
        verification: "Verified via automated CI/CD security rule unit testing on every deployment.",
      },
      {
        heading: "2. Least-Privilege OAuth 2.0 Token Vaulting",
        controlCode: "SEC_CTRL_02 · OAUTH_VAULT",
        body: "When authorizing Instagram, TikTok, LinkedIn, X/Twitter, or YouTube connectors, VisionAI requests only the granular scopes required to publish scheduled drops and retrieve post-level attribution telemetry. Access and refresh tokens are encrypted using AES-256-GCM envelope encryption and are never readable in client browser memory.",
        verification: "1-click instant token revocation available inside Workspace Settings.",
      },
      {
        heading: "3. Continuous Vulnerability Scanning & Incident Response",
        controlCode: "SEC_CTRL_03 · SOC2_MONITORING",
        body: "Our runtime containers, dependencies, and API endpoints are continuously monitored with automated SAST/DAST scanning, immutable audit logging, and a 24/7 security operations center (SOC) with a <15-minute critical incident response SLA.",
        verification: "Full SOC-2 Type II attestation report available to Enterprise & Scale customers.",
      },
    ],
    complianceMatrix: [
      {
        control: "Authentication & Session Gate",
        standard: "OWASP ASVS Level 2 / Zero-Trust",
        enforcement: "Unauthenticated visitors are blocked from all /(app) studio routes",
      },
      {
        control: "Database Security Rules",
        standard: "Principle of Least Privilege",
        enforcement: "Explicit owner/role verification on every document read and write",
      },
      {
        control: "Model Training Isolation",
        standard: "Enterprise AI Privacy Standard",
        enforcement: "Customer brand assets and prompts never train public foundation models",
      },
    ],
  },
  "zero-key-architecture": {
    slug: "zero-key-architecture",
    badge: "Zero-Retention Server Proxy · No Browser Keys",
    title: "Zero Client API Key",
    italicHighlight: "Storage Specification",
    subtitle:
      "Why exposing AI API keys in the browser is a critical enterprise vulnerability—and how VisionAI executes 100% of inference through our zero-retention server proxy.",
    lastUpdated: "Proxy Specification v3.8 · October 2026",
    icon: KeyRound,
    highlights: [
      { label: "Client-Side API Keys", value: "0 Stored", detail: "Never requested or stored in localStorage" },
      { label: "Inference Routing", value: "100% Server-Side", detail: "Protected /api/ai/* proxy routes" },
      { label: "Prompt Retention", value: "0 Days", detail: "Ephemeral in-memory execution only" },
      { label: "Surprise Token Bills", value: "$0.00", detail: "All AI inference included in subscription" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Elimination of Client-Side Key Exposure",
        controlCode: "PROXY_CTRL_01 · ZERO_BROWSER_SECRETS",
        body: "Many AI marketing wrappers force users to paste their own OpenAI or Gemini API keys into browser settings—exposing credentials to XSS attacks, browser extensions, and network inspection. VisionAI never asks for client API keys and never bundles secret keys into client-side JavaScript.",
        verification: "Audited via automated build-time secret scanning across all client bundles.",
      },
      {
        heading: "2. Ephemeral Zero-Retention Server Proxy (/api/ai/*)",
        controlCode: "PROXY_CTRL_02 · EPHEMERAL_INFERENCE",
        body: "When you generate fold-safe hooks, synthesize background visuals, or run a Competitor Ambush scan, your request is transmitted over TLS 1.3 to our internal Next.js server proxy (/api/ai/creative-hooks, /api/ai/competitor-intel). Payloads are processed in volatile memory and immediately discarded upon response.",
        verification: "Zero payload logging in production application access logs.",
      },
      {
        heading: "3. Structured Schema Validation & Guardrail Injection",
        controlCode: "PROXY_CTRL_03 · DETERMINISTIC_JSON",
        body: "Our server proxy automatically injects your workspace's Brand Voice DNA and banned-word blocklist into every outbound model call and validates the response against strict TypeScript JSON schemas before returning results to the studio.",
        verification: "Guarantees sub-4-second deterministic outputs with zero malformed responses.",
      },
    ],
    complianceMatrix: [
      {
        control: "Secret Variable Scope",
        standard: "Server-Only Environment Isolation",
        enforcement: "GEMINI_API_KEY restricted strictly to Node.js server runtime",
      },
      {
        control: "Third-Party Model Retention",
        standard: "Zero Data Retention (ZDR) Agreement",
        enforcement: "Prompts and brand briefs are contractually excluded from model training",
      },
      {
        control: "Rate-Limit & Cost Protection",
        standard: "Included Enterprise Quota",
        enforcement: "Zero variable token billing or unexpected usage overages",
      },
    ],
  },
  "gdpr-ccpa-compliance": {
    slug: "gdpr-ccpa-compliance",
    badge: "GDPR · UK GDPR · CCPA / CPRA Compliant",
    title: "Global Data Privacy &",
    italicHighlight: "Data Processing Addendum (DPA)",
    subtitle:
      "Comprehensive regulatory compliance, automated PII minimization, and binding Data Processing Addendum commitments for global growth teams.",
    lastUpdated: "DPA Revision 5.1 · October 2026",
    icon: Globe,
    highlights: [
      { label: "Cross-Border Transfers", value: "EU-US DPF + SCCs", detail: "Module 2 & 3 Standard Contractual Clauses" },
      { label: "Right to Erasure", value: "< 24 Hours", detail: "Automated cryptographic workspace purge" },
      { label: "PII Redaction", value: "Pre-Inference", detail: "Automatic hashing before AI processing" },
      { label: "Data Selling", value: "Strictly 0%", detail: "Certified under CCPA/CPRA non-sale rules" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Clear Data Controller vs. Data Processor Boundaries",
        controlCode: "PRIV_CTRL_01 · GDPR_ART_28",
        body: "Under GDPR Article 28 and the California Consumer Privacy Act (CCPA/CPRA), your organization remains the exclusive Data Controller of all customer segments, brand assets, and campaign telemetry. VisionAI acts strictly as a bound Data Processor executing your explicit workspace instructions.",
        verification: "Pre-signed Data Processing Addendum (DPA) included for all workspaces.",
      },
      {
        heading: "2. Automated PII Scrubbing & Cohort Aggregation",
        controlCode: "PRIV_CTRL_02 · DATA_MINIMIZATION",
        body: "Before any CRM segment or ecommerce analytics dataset is evaluated by our attribution or segmentation studios, direct personal identifiers (emails, phone numbers, IP addresses) are stripped or salted-SHA256 hashed so AI inference operates exclusively on anonymized cohort trends.",
        verification: "Enforces privacy-by-design across all 8 production studios.",
      },
      {
        heading: "3. Self-Serve Data Portability & Cryptographic Erasure",
        controlCode: "PRIV_CTRL_03 · GDPR_ART_17_20",
        body: "Workspace administrators can export 100% of their creative assets, campaign ledgers, and brand configurations in machine-readable JSON/CSV formats or trigger an immediate, irreversible cryptographic deletion of all workspace records.",
        verification: "Completes full primary and replica purge within 24 hours.",
      },
    ],
    complianceMatrix: [
      {
        control: "EU / EEA & UK Data Transfers",
        standard: "GDPR Chapter V & UK IDTA",
        enforcement: "EU-US Data Privacy Framework + Standard Contractual Clauses (SCCs)",
      },
      {
        control: "California Consumer Rights",
        standard: "CCPA / CPRA § 1798.100",
        enforcement: "Zero sale or cross-context behavioral sharing of personal information",
      },
      {
        control: "Subprocessor Governance",
        standard: "SOC-2 & ISO-27001 Vetted",
        enforcement: "30-day advance notice prior to any material subprocessor change",
      },
    ],
  },
  "dispatch-sla": {
    slug: "dispatch-sla",
    badge: "All 5 Ad Networks Operational · 99.99% Uptime",
    title: "99.99% Multi-Network",
    italicHighlight: "Dispatch SLA & Live Telemetry",
    subtitle:
      "Real-time operational status across our creative synthesis engine and 5 social publishing connectors, backed by contractual service credits.",
    lastUpdated: "Live Telemetry · Verified October 2026",
    icon: Activity,
    highlights: [
      { label: "Rolling 90-Day Uptime", value: "99.994%", detail: "Exceeds contractual 99.99% SLA commitment" },
      { label: "Multi-Ratio Synthesis", value: "3.8s Avg", detail: "Simultaneous 9:16, 1:1 & 16:9 rendering" },
      { label: "Auto-Retry Resilience", value: "3x Backoff", detail: "Idempotent dead-letter recovery queue" },
      { label: "Max SLA Credit", value: "100% Fee", detail: "Automatic credit if monthly uptime dips" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Live 5-Network Connector Telemetry",
        controlCode: "SLA_CTRL_01 · CONNECTOR_HEALTH",
        body: "VisionAI maintains dedicated, health-checked publishing pipelines to Instagram Graph API (99.99% uptime), TikTok Business API (99.98% uptime), LinkedIn Marketing Developer Platform (100% uptime), X/Twitter API v2 (99.99% uptime), and YouTube Data API v3 (100% uptime).",
        verification: "Synthetic heartbeat probes execute every 60 seconds across 3 global regions.",
      },
      {
        heading: "2. Idempotent Dead-Letter Queue & Auto-Retry Engine",
        controlCode: "SLA_CTRL_02 · ZERO_DROPPED_POSTS",
        body: "If an upstream social network experiences a momentary API brownout at your scheduled launch minute, VisionAI's dispatcher captures the payload in a durable dead-letter queue with cryptographic idempotency tokens and automatically retries with exponential backoff.",
        verification: "Prevents both silent publishing failures and duplicate social posts.",
      },
      {
        heading: "3. Contractual SLA Service Credit Schedule",
        controlCode: "SLA_CTRL_03 · FINANCIAL_BACKSTOP",
        body: "We back our reliability with financial skin in the game: monthly uptime between 99.90%–99.99% earns a 15% service credit; 99.00%–99.90% earns a 30% service credit; below 99.00% earns a 100% monthly credit.",
        verification: "Automatically applied to your next billing cycle without red tape.",
      },
    ],
    complianceMatrix: [
      {
        control: "Instagram & TikTok Reels Pipeline",
        standard: "99.99% Availability Target",
        enforcement: "Operational · 142ms average dispatch handshake",
      },
      {
        control: "LinkedIn & X/Twitter B2B Pipeline",
        standard: "99.99% Availability Target",
        enforcement: "Operational · 98ms average dispatch handshake",
      },
      {
        control: "YouTube Shorts & AI Synthesis Engine",
        standard: "99.99% Availability Target",
        enforcement: "Operational · 3.8s multi-ratio creative generation",
      },
    ],
  },
  "terms-of-service": {
    slug: "terms-of-service",
    badge: "Master Subscription Agreement · 100% Customer IP",
    title: "Terms of Service &",
    italicHighlight: "100% Creative IP Ownership",
    subtitle:
      "Transparent, founder-friendly commercial terms governing the 14-Day Risk-Free Trial, intellectual property ownership, and 1-click cancellation.",
    lastUpdated: "Effective October 2026",
    icon: Scale,
    highlights: [
      { label: "Free Trial Period", value: "14 Days", detail: "Full access to all 8 production studios" },
      { label: "Creative IP Ownership", value: "100% Yours", detail: "Full commercial copyright on all exports" },
      { label: "Velocity Guarantee", value: "2x or $0", detail: "100% refund if velocity doesn't double" },
      { label: "Lock-In Contracts", value: "None", detail: "Cancel or downgrade in 1 click anytime" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Unconditional 100% Customer Ownership of Generated Assets",
        controlCode: "MSA_CLAUSE_01 · IP_ASSIGNMENT",
        body: "You retain 100% worldwide right, title, copyright, and commercial ownership of every ad poster, multi-ratio variation, psychological copy hook, and competitor battlecard synthesized inside your VisionAI workspace—including all assets exported during your 14-day free trial.",
        verification: "Zero royalty obligations or attribution watermarks on exported creatives.",
      },
      {
        heading: "2. The 14-Day '2x Creative Velocity' Risk-Free Trial",
        controlCode: "MSA_CLAUSE_02 · 14_DAY_TRIAL",
        body: "Every new workspace begins with a 14-day risk-free trial. If VisionAI does not cut your creative production turnaround by at least 50% and outperform your baseline social ad CTR within 14 days, cancel in one click or claim a 100% refund—and keep every creative you exported.",
        verification: "Self-serve cancellation inside Workspace Settings with zero retention dark patterns.",
      },
      {
        heading: "3. Fair Use, Authorized Channels & Account Governance",
        controlCode: "MSA_CLAUSE_03 · ACCEPTABLE_USE",
        body: "Workspaces may connect authorized brand social accounts and synthesize unlimited fold-safe campaigns in accordance with your selected plan tier. Users warrant they hold publishing rights for connected brand handles and agree not to generate unlawful or deceptive content.",
        verification: "Protected by automated workspace audit logs and role-based permissions.",
      },
    ],
    complianceMatrix: [
      {
        control: "Trial Duration & Billing",
        standard: "14-Day Risk-Free Trial",
        enforcement: "Full studio access for 14 days; 1-click self-serve cancellation",
      },
      {
        control: "Intellectual Property Rights",
        standard: "Full Customer Assignment",
        enforcement: "Customer owns 100% of input brand DNA and output creative assets",
      },
      {
        control: "Liability & Indemnification",
        standard: "Enterprise Commercial Standard",
        enforcement: "Includes IP indemnity protection for enterprise workspaces",
      },
    ],
  },
  "privacy-policy": {
    slug: "privacy-policy",
    badge: "Zero Ad Trackers · Zero Data Brokering",
    title: "Privacy Policy &",
    italicHighlight: "Telemetry Transparency",
    subtitle:
      "Explicit disclosure of what data we collect, how it powers your workspace studios, and why we never sell or broker customer information.",
    lastUpdated: "Effective October 2026",
    icon: Lock,
    highlights: [
      { label: "Third-Party Ad Pixels", value: "0 Installed", detail: "No cross-site behavioral retargeting" },
      { label: "Data Monetization", value: "Never Sold", detail: "100% software subscription business model" },
      { label: "Data Export", value: "Instant", detail: "Self-serve JSON/CSV/PNG portability" },
      { label: "Encryption Standard", value: "End-to-End", detail: "TLS 1.3 + AES-256-GCM storage" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Minimal Account & Workspace Data Collection",
        controlCode: "PRIV_POL_01 · COLLECTION_SCOPE",
        body: "We collect only the information required to provision and operate your workspace: your work email, name, company name, explicitly configured Brand Voice DNA, and the campaign creatives and social channels you choose to manage inside VisionAI.",
        verification: "No background scraping of personal contacts or unrelated browser history.",
      },
      {
        heading: "2. Strict Purpose Limitation",
        controlCode: "PRIV_POL_02 · PURPOSE_LIMITATION",
        body: "Your workspace data is processed strictly to render fold-safe creatives, compute optical safe-zone geometry, generate competitor battlecards you request, and dispatch scheduled posts to your connected social networks.",
        verification: "Never shared with advertisers, data brokers, or competing brands.",
      },
      {
        heading: "3. Audited Cloud Infrastructure & Subprocessors",
        controlCode: "PRIV_POL_03 · SUBPROCESSORS",
        body: "VisionAI runs on SOC-2 Type II and ISO-27001 certified infrastructure (Google Cloud Platform, Firebase Authentication/Firestore, and enterprise Gemini inference endpoints) governed by strict confidentiality and zero-retention agreements.",
        verification: "Complete subprocessor list and security contacts available 24/7.",
      },
    ],
    complianceMatrix: [
      {
        control: "Account Credentials",
        standard: "Zero-Trust Auth & SSO",
        enforcement: "Used strictly for workspace authentication and security alerts",
      },
      {
        control: "Brand & Campaign Assets",
        standard: "Confidential Customer Property",
        enforcement: "Isolated per workspace; never used for external model training",
      },
      {
        control: "Telemetry & Logs",
        standard: "Anonymized Operational Health",
        enforcement: "Used solely to maintain our 99.99% multi-network dispatch SLA",
      },
    ],
  },
  "cookie-policy": {
    slug: "cookie-policy",
    badge: "Minimal Storage · Zero Cross-Site Surveillance",
    title: "Cookie Policy &",
    italicHighlight: "Browser Storage Specification",
    subtitle:
      "Complete inventory of every cookie and localStorage key used by VisionAI to authenticate your workspace and preserve studio state.",
    lastUpdated: "Effective October 2026",
    icon: Cookie,
    highlights: [
      { label: "Auth Session Cookie", value: "First-Party", detail: "visionai_auth & next-auth session token" },
      { label: "Third-Party Ad Cookies", value: "0 Active", detail: "Zero invasive cross-domain trackers" },
      { label: "Canvas Draft Storage", value: "Local-First", detail: "Prevents losing unsaved studio work" },
      { label: "User Control", value: "1-Click Toggle", detail: "Manage preferences anytime in footer" },
    ],
    explicitKnowledge: [
      {
        heading: "1. Strictly Necessary Authentication Cookies",
        controlCode: "COOKIE_SPEC_01 · ESSENTIAL_AUTH",
        body: "VisionAI sets first-party authentication tokens (`visionai_auth` and `next-auth.session-token`) when you sign in or activate your 14-day trial. These tokens verify your identity across protected studio routes and expire automatically upon sign-out or after your 14-day trial window.",
        verification: "Required for Zero-Trust Workspace Gate operation.",
      },
      {
        heading: "2. Functional Studio & Theme State Storage",
        controlCode: "COOKIE_SPEC_02 · STUDIO_STATE",
        body: "We use browser `localStorage` to persist your dark/light theme preference, active safe-zone mask selection (TikTok/Reels/Shorts), and unsaved canvas drafts so your creative work is never lost if you refresh the tab.",
        verification: "Remains strictly inside your local browser until cleared.",
      },
      {
        heading: "3. Granular Consent & Instant Revocation",
        controlCode: "COOKIE_SPEC_03 · USER_CONTROL",
        body: "You can inspect, toggle, or revoke optional studio performance and first-party ROAS attribution storage at any time via the Cookie Settings drawer in the footer or by signing out of your workspace.",
        verification: "Zero degradation to core security when optional preferences are disabled.",
      },
    ],
    complianceMatrix: [
      {
        control: "visionai_auth / next-auth.session-token",
        standard: "Strictly Necessary (First-Party)",
        enforcement: "Authenticates access to /(app) production studios; cleared on Sign Out",
      },
      {
        control: "theme / canvas_safe_zone_prefs",
        standard: "Functional UI Preference",
        enforcement: "Remembers dark/light mode and 9:16 mask overlays",
      },
      {
        control: "Third-Party Ad Network Pixels",
        standard: "Prohibited by Default",
        enforcement: "Zero third-party behavioral tracking cookies deployed",
      },
    ],
  },
};

export default function TrustDetailKnowledgePage() {
  const params = useParams();
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "security-governance";
  const doc = TRUST_KNOWLEDGE_DOCS[rawSlug] || TRUST_KNOWLEDGE_DOCS["security-governance"];
  const Icon = doc.icon;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isWorkspaceAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-600 selection:text-white">
      <LandingNav />

      <main className="flex-1">
        {/* Top Hero & Document Switcher */}
        <section className="relative overflow-hidden pt-12 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[340px] bg-gradient-to-r from-[#1D39C4]/15 via-[#6D28D9]/15 to-[#A824B4]/15 blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to VisionAI Home
            </Link>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>{doc.lastUpdated}</span>
            </div>
          </div>

          {/* Dedicated Page Switcher Pills for All Enterprise Trust & Legal Pages */}
          <div className="pt-6 flex flex-wrap items-center gap-2">
            {Object.values(TRUST_KNOWLEDGE_DOCS).map((item) => {
              const active = item.slug === doc.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/trust/${item.slug}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white font-bold shadow-sm"
                      : "bg-white dark:bg-[#0B0F1E] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40"
                  }`}
                >
                  {item.title.replace("&", "").trim()} {item.italicHighlight.split(" ")[0]}
                </Link>
              );
            })}
          </div>

          {/* Document Headline & Highlights */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold">
                <Icon className="h-4 w-4" />
                <span>{doc.badge}</span>
              </div>

              <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold tracking-[-0.033em] text-slate-900 dark:text-white leading-[1.06]">
                {doc.title}{" "}
                <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
                  {doc.italicHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-[1.64] max-w-[62ch]">
                {doc.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-semibold px-7 h-12 text-sm rounded-2xl shadow-xl shadow-indigo-500/25 gap-2 cursor-pointer border-0"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isLoggedIn ? "Enter Authenticated Workspace" : "Sign In to Workspace"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-sm font-semibold rounded-2xl border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] cursor-pointer"
                  >
                    Start 14-Day Free Trial
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {doc.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm"
                >
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {h.label}
                  </div>
                  <div className="text-2xl font-display font-extrabold tracking-tight bg-gradient-to-r from-[#1D39C4] to-[#A824B4] dark:from-blue-400 dark:to-fuchsia-400 bg-clip-text text-transparent tabular-nums mt-1">
                    {h.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {h.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explicit Clauses & Architectural Proof */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="max-w-3xl mb-10">
            <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold mb-2">
              Explicit Specification &amp; Audit Controls
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.03em]">
              Verifiable Architecture &amp; Binding Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doc.explicitKnowledge.map((clause, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">
                    {clause.controlCode}
                  </div>
                  <h3 className="text-xl font-display font-extrabold tracking-[-0.024em] text-slate-900 dark:text-white">
                    {clause.heading}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-[1.64]">
                    {clause.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-start gap-2 text-xs sm:text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{clause.verification}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance Control Matrix */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-white/10">
              <div className="text-xs font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold">
                Compliance Control Matrix
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 tracking-[-0.025em]">
                Control Standard &amp; Runtime Enforcement
              </h3>
            </div>
            <div className="divide-y divide-slate-200/70 dark:divide-white/10">
              {doc.complianceMatrix.map((row, i) => (
                <div
                  key={i}
                  className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-sm"
                >
                  <div className="md:col-span-4 font-mono font-bold text-slate-900 dark:text-white">
                    {row.control}
                  </div>
                  <div className="md:col-span-4 font-mono text-indigo-600 dark:text-indigo-400">
                    {row.standard}
                  </div>
                  <div className="md:col-span-4 text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{row.enforcement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
