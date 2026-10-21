"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Server,
  FileText,
  Scale,
  Activity,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Globe,
  KeyRound,
  Sparkles,
  Cookie,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/home/landing-nav";
import { LandingFooter } from "@/components/home/landing-footer";

type TrustSectionId =
  | "security"
  | "zero-retention"
  | "gdpr"
  | "sla"
  | "terms"
  | "privacy"
  | "cookies";

interface SectionDoc {
  id: TrustSectionId;
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: { label: string; value: string }[];
  clauses: { heading: string; body: string }[];
}

const TRUST_SECTIONS: SectionDoc[] = [
  {
    id: "security",
    badge: "SOC-2 Type II Certified",
    title: "Enterprise Security & Zero-Trust Governance",
    subtitle:
      "How VisionAI protects your brand assets, campaign intelligence, and connected social OAuth tokens with bank-grade isolation.",
    lastUpdated: "October 2026 · Audit Control v4.2",
    icon: ShieldCheck,
    highlights: [
      { label: "Encryption in Transit", value: "TLS 1.3 (256-bit)" },
      { label: "Encryption at Rest", value: "AES-256 GCM" },
      { label: "Tenant Isolation", value: "Strict RBAC Rules" },
      { label: "Audit Frequency", value: "Continuous SOC-2" },
    ],
    clauses: [
      {
        heading: "1. Multi-Tenant Workspace Isolation",
        body: "Every brand workspace operates inside an isolated security boundary enforced by cryptographic session verification and strict role-based access control (RBAC). Brand Voice DNA, banned-word guardrails, and unpublished ad creatives are never shared across workspaces or used to train public foundation models.",
      },
      {
        heading: "2. Least-Privilege OAuth Token Vault",
        body: "When connecting Instagram, TikTok, LinkedIn, X/Twitter, or YouTube, VisionAI requests only the minimum scopes required for scheduled publishing and attribution telemetry. Tokens are encrypted at rest using envelope encryption and can be revoked in one click from your Workspace Settings.",
      },
      {
        heading: "3. Continuous Vulnerability & Penetration Testing",
        body: "Our infrastructure undergoes automated daily static/dynamic code analysis and quarterly third-party penetration testing by independent CREST-accredited security auditors.",
      },
    ],
  },
  {
    id: "zero-retention",
    badge: "Zero-Key Exposure Architecture",
    title: "Zero-Retention Server Proxy Specification",
    subtitle:
      "All AI synthesis, fold-safe geometry checks, and competitor radar scans execute strictly server-side with zero client-side API key exposure.",
    lastUpdated: "October 2026 · Proxy Architecture v3.8",
    icon: KeyRound,
    highlights: [
      { label: "Browser API Keys", value: "0 Exposed (Server-Only)" },
      { label: "Prompt Retention", value: "0 Days (Ephemeral)" },
      { label: "Model Training Opt-Out", value: "100% Enforced" },
      { label: "Proxy Latency", value: "< 42ms Edge Overhead" },
    ],
    clauses: [
      {
        heading: "1. No Client-Side API Keys Required",
        body: "Unlike wrapper tools that ask users to paste OpenAI or Gemini keys into browser localStorage, VisionAI routes 100% of inference calls through our authenticated `/api/ai/*` server proxy. Your team never manages API keys or faces surprise token bills.",
      },
      {
        heading: "2. Ephemeral Zero-Retention Inference",
        body: "Prompts, product briefs, and competitor battlecards transmitted through our enterprise AI endpoints are processed ephemerally in memory and are contractually excluded from third-party model training pipelines.",
      },
      {
        heading: "3. Automated Rate-Limiting & Failover",
        body: "Our server proxy automatically balances throughput across redundant regional endpoints, guaranteeing consistent 4-second multi-ratio synthesis even during peak product launches.",
      },
    ],
  },
  {
    id: "gdpr",
    badge: "GDPR & CCPA / CPRA Compliant",
    title: "Global Data Privacy & Data Processing Addendum (DPA)",
    subtitle:
      "Full regulatory compliance for European Economic Area (EEA), UK, Swiss, and California growth teams.",
    lastUpdated: "October 2026 · DPA Revision 5.1",
    icon: Globe,
    highlights: [
      { label: "EU Transfer Mechanism", value: "EU-US Data Privacy + SCCs" },
      { label: "Right to Erasure", value: "< 24 Hours Automated" },
      { label: "PII Scrubbing", value: "Automatic Pre-Inference" },
      { label: "DPO Contact", value: "dpo@visionai.studio" },
    ],
    clauses: [
      {
        heading: "1. Data Controller vs. Data Processor Roles",
        body: "Under GDPR and CCPA, your organization remains the sole Data Controller of all brand assets, customer segments, and campaign telemetry. VisionAI acts strictly as a Data Processor executing instructions on your behalf.",
      },
      {
        heading: "2. Automated PII Redaction & Minimization",
        body: "Before any audience or analytics payload is analyzed by our attribution engine, personally identifiable information (PII) is hashed or stripped so only aggregated cohort performance metrics are evaluated.",
      },
      {
        heading: "3. Instant Workspace Export & Right to Erasure",
        body: "Workspace administrators can export all creative assets, hook libraries, and campaign receipts in standard JSON/CSV/PNG formats or trigger permanent cryptographic erasure of their workspace at any time.",
      },
    ],
  },
  {
    id: "sla",
    badge: "All 5 Ad Networks Operational",
    title: "99.99% Multi-Network Dispatch SLA & Live Telemetry",
    subtitle:
      "Contractual uptime commitments and real-time operational health across our creative synthesis engine and 5 social publishing connectors.",
    lastUpdated: "Live Telemetry · Updated Every 60 Seconds",
    icon: Activity,
    highlights: [
      { label: "Rolling 90-Day Uptime", value: "99.994%" },
      { label: "Multi-Ratio Synthesis", value: "3.8s Avg Latency" },
      { label: "Auto-Retry Queue", value: "3x Exponential Backoff" },
      { label: "SLA Credit Guarantee", value: "Up to 100% Monthly Fee" },
    ],
    clauses: [
      {
        heading: "1. Live Network Connector Status",
        body: "Instagram Reels/Feed API: Operational (99.99%) · TikTok Business API: Operational (99.98%) · LinkedIn Marketing API: Operational (100%) · X/Twitter v2 Dispatcher: Operational (99.99%) · YouTube Shorts Data API: Operational (100%).",
      },
      {
        heading: "2. Dead-Letter Queue & Auto-Retry Protection",
        body: "If an upstream social network experiences a temporary outage at the exact second your campaign is scheduled to drop, VisionAI's dispatcher automatically queues the payload with cryptographic idempotency keys and retries until delivery is verified.",
      },
      {
        heading: "3. Contractual SLA Credits",
        body: "Growth, Scale, and Enterprise workspaces are backed by our 99.99% uptime SLA. Any monthly uptime dip below threshold automatically qualifies your workspace for pro-rated service credits.",
      },
    ],
  },
  {
    id: "terms",
    badge: "Master Subscription Agreement",
    title: "Terms of Service & 14-Day Velocity Guarantee",
    subtitle:
      "Clear, founder-friendly commercial terms with full intellectual property ownership of every creative you generate.",
    lastUpdated: "Effective October 2026",
    icon: Scale,
    highlights: [
      { label: "Free Trial Duration", value: "14 Days Risk-Free" },
      { label: "Creative IP Ownership", value: "100% Yours Forever" },
      { label: "Cancellation Policy", value: "1-Click Anytime" },
      { label: "Velocity Guarantee", value: "2x Output or 100% Refund" },
    ],
    clauses: [
      {
        heading: "1. 100% Customer Ownership of Generated Assets",
        body: "You retain full, exclusive worldwide copyright and commercial ownership of every ad poster, copy hook, aspect-ratio adaptation, and competitor battlecard synthesized inside your VisionAI workspace—including assets exported during your 14-day free trial.",
      },
      {
        heading: "2. The 14-Day Risk-Free Trial & 2x Velocity Guarantee",
        body: "Every new workspace receives 14 days of full studio access. If VisionAI does not cut your creative production turnaround by at least 50% and outperform your baseline ad CTR within your 14-day trial, you can cancel or claim a 100% refund in one click with zero penalty.",
      },
      {
        heading: "3. Acceptable Use & Fair Dispatch Limits",
        body: "Workspaces may generate unlimited fold-safe creative variations and schedule campaigns across connected brand accounts. Automated spam, deceptive impersonation, or unlawful content generation is strictly prohibited.",
      },
    ],
  },
  {
    id: "privacy",
    badge: "Privacy First",
    title: "Privacy Policy & Telemetry Transparency",
    subtitle:
      "We monetize through transparent software subscriptions—never by selling, brokering, or monetizing your brand data.",
    lastUpdated: "Effective October 2026",
    icon: Lock,
    highlights: [
      { label: "Data Selling", value: "Strictly Never" },
      { label: "Third-Party Ad Trackers", value: "Zero Installed" },
      { label: "Session Cookie Scope", value: "Auth & Security Only" },
      { label: "Data Portability", value: "Instant Self-Serve Export" },
    ],
    clauses: [
      {
        heading: "1. Information We Collect",
        body: "We collect only the account credentials (work email, name, company name), brand voice preferences, and campaign assets you explicitly create or connect inside your workspace to deliver the VisionAI service.",
      },
      {
        heading: "2. How We Use & Protect Your Information",
        body: "Your workspace data is used solely to synthesize your brand creatives, compute fold-safe optical geometry, monitor competitor public ad changes you request, and publish scheduled posts to your authorized social channels.",
      },
      {
        heading: "3. Subprocessors & Infrastructure Partners",
        body: "We partner exclusively with SOC-2 Type II certified cloud infrastructure providers (Google Cloud Platform, Firebase Auth/Firestore, and enterprise Gemini inference endpoints) bound by strict Data Processing Addendums.",
      },
    ],
  },
  {
    id: "cookies",
    badge: "Zero Cross-Site Tracking",
    title: "Cookie Policy & Consent Controls",
    subtitle:
      "Minimal, transparent browser storage designed strictly for authentication security, theme state, and workspace continuity.",
    lastUpdated: "Effective October 2026",
    icon: Cookie,
    highlights: [
      { label: "Essential Auth Cookies", value: "Required (HTTP-Only)" },
      { label: "UI Preference Storage", value: "Theme & Safe-Zone State" },
      { label: "3rd-Party Ad Pixels", value: "Disabled by Default" },
      { label: "Session Expiry", value: "Configurable up to 30d" },
    ],
    clauses: [
      {
        heading: "1. Strictly Necessary Authentication Cookies",
        body: "We use cryptographically signed cookies (`next-auth.session-token`) to keep your workspace session authenticated and protect against Cross-Site Request Forgery (CSRF).",
      },
      {
        heading: "2. Functional Studio Preferences",
        body: "Local storage is used to remember your dark/light theme preference and unsaved canvas drafts so you never lose work mid-campaign.",
      },
      {
        heading: "3. Managing Your Cookie Preferences",
        body: "You can customize your non-essential analytics and attribution cookie preferences at any time using the Cookie Preferences control in the footer.",
      },
    ],
  },
];

function TrustHubContent() {
  const searchParams = useSearchParams();
  const initialParam = searchParams.get("section") as TrustSectionId | null;
  const [activeSection, setActiveSection] = useState<TrustSectionId>(
    initialParam && TRUST_SECTIONS.some((s) => s.id === initialParam)
      ? initialParam
      : "security"
  );

  useEffect(() => {
    if (initialParam && TRUST_SECTIONS.some((s) => s.id === initialParam)) {
      setActiveSection(initialParam);
    }
  }, [initialParam]);

  const currentDoc =
    TRUST_SECTIONS.find((s) => s.id === activeSection) || TRUST_SECTIONS[0];
  const CurrentIcon = currentDoc.icon;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-600 selection:text-white">
      <LandingNav />

      <main className="flex-1 py-14 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Top Breadcrumb & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to VisionAI Home
          </Link>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All 5 Social Dispatch Networks Operational · 99.99% SLA</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="py-10 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">
            VisionAI Enterprise Trust, Legal &amp; Security Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08]">
            Built for{" "}
            <span className="font-editorial italic font-normal bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent">
              zero-trust security
            </span>{" "}
            and total IP ownership.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Inspect our SOC-2 Type II security controls, zero-retention server proxy architecture, GDPR/CCPA data processing commitments, and 14-day trial terms.
          </p>
        </div>

        {/* Interactive 2-Column Trust & Legal Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Rail */}
          <div className="lg:col-span-4 space-y-2 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] p-4 shadow-sm">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Governance &amp; Legal Documents
            </div>
            {TRUST_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isSelected = sec.id === activeSection;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white font-bold shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-white" : "text-indigo-600 dark:text-indigo-400"
                      }`}
                    />
                    <span className="text-xs truncate">{sec.title.split("&")[0].trim()}</span>
                  </div>
                  <ArrowRight
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isSelected ? "text-white" : "text-slate-400"
                    }`}
                  />
                </button>
              );
            })}

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 px-3 space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Ready to test VisionAI risk-free?
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Every workspace includes our 14-Day 2x Creative Velocity Guarantee and full SOC-2 isolation.
              </p>
              <Link href="/signup" className="block">
                <Button className="w-full h-10 text-xs font-bold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white rounded-xl border-0 cursor-pointer">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Document Content Pane */}
          <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <CurrentIcon className="h-4 w-4" />
                  <span>{currentDoc.badge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentDoc.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {currentDoc.subtitle}
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-white/[0.03] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/10">
                {currentDoc.lastUpdated}
              </div>
            </div>

            {/* Key Quantified Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentDoc.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10"
                >
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                  <div className="text-sm font-display font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Clauses */}
            <div className="space-y-6">
              {currentDoc.clauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/40 dark:bg-white/[0.02] space-y-2"
                >
                  <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{clause.heading}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    {clause.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Direct Action Footer inside Document */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Need a countersigned enterprise DPA or custom SOC-2 report package?
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/#contact">
                  <Button
                    variant="outline"
                    className="h-10 text-xs font-semibold rounded-xl border-slate-200 dark:border-white/15 cursor-pointer"
                  >
                    Request Security Package
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="h-10 text-xs font-bold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white rounded-xl border-0 cursor-pointer">
                    Launch Workspace <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

export default function TrustPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs font-mono text-slate-400">
          Loading VisionAI Trust &amp; Legal Center...
        </div>
      }
    >
      <TrustHubContent />
    </Suspense>
  );
}
