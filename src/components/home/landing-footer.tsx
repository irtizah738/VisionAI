"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VisionAILogo } from "@/components/icons";
import {
  ArrowUpRight,
  ArrowUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Mail,
  Cookie,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LandingFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true,
    analytics: true,
    attribution: true,
  });
  const [cookieSaved, setCookieSaved] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  };

  const handleSaveCookies = () => {
    setCookieSaved(true);
    setTimeout(() => {
      setCookieSaved(false);
      setShowCookieModal(false);
    }, 900);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-slate-200/90 dark:border-white/10 bg-slate-50/70 dark:bg-[#060812] text-slate-600 dark:text-slate-400 overflow-hidden">
      {/* Subtle Ambient Top Border Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[820px] h-[180px] bg-gradient-to-r from-[#1D39C4]/10 via-[#6D28D9]/10 to-[#A824B4]/10 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12 relative z-10">
        {/* Top Executive Bar: Weekly 3-Ad Fold-Safe Teardown + Direct Trial CTA */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm mb-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Weekly Fold-Safe Teardown Briefing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.025em]">
              Get 3 deconstructed high-ROAS social ads every Tuesday.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.6]">
              Read by 14,800+ CMOs, creative directors, and paid social buyers. Zero fluff—just live hook geometry, thumb-stop benchmarks, and rival battlecards.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    Subscribed <strong className="font-mono">{newsletterEmail}</strong> to the Tuesday Teardown!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubscribed(false);
                    setNewsletterEmail("");
                  }}
                  className="text-xs font-mono underline hover:opacity-80 cursor-pointer shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    aria-label="Work email for Weekly Teardown"
                    className="pl-10 h-11 text-sm rounded-xl bg-slate-50 dark:bg-[#060913] border-slate-200 dark:border-white/15"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 px-5 text-sm font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white rounded-xl border-0 shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
                >
                  Subscribe Free <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Main 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-200/80 dark:border-white/10 items-start">
          {/* Group 1 (Span 4): Brand Identity */}
          <div className="md:col-span-12 lg:col-span-4 space-y-4 lg:pr-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <VisionAILogo className="h-9 w-9 transition-transform group-hover:scale-105 shrink-0" />
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent tracking-tight leading-none">
                  VisionAI
                </span>
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mt-1">
                  Autonomous Growth Studio
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.65] max-w-sm">
              The autonomous creative &amp; competitive growth studio for brands that refuse to lose 73% of their ad spend to mobile scroll fatigue.
            </p>
          </div>

          {/* Group 2 (Span 4): Production Studios -> Dedicated Explicit Knowledge Pages (/studios/[slug]) */}
          <div className="md:col-span-6 lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em] font-mono flex items-center gap-2 pb-2.5 border-b border-slate-200/70 dark:border-white/10">
              <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Production Studios</span>
            </div>
            <ul className="space-y-2.5 text-[13.5px] leading-snug">
              <li>
                <Link
                  href="/studios/command-center"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Executive Command Center</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/fold-aware-canvas"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Fold-Aware Creative Canvas</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/competitor-radar"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Competitor Ambush Radar</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/social-dispatcher"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>5-Network Social Dispatcher</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/campaign-builder"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Autonomous Campaign Builder</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/campaign-attribution"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Multi-Touch ROAS Attribution</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/ai-copilot"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>AI Strategy &amp; Copy Copilot</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/studios/brand-voice"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Brand Voice &amp; Guardrails</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 3 (Span 4): Enterprise Trust, Legal & Account -> Dedicated Explicit Knowledge Pages (/trust/[slug]) */}
          <div className="md:col-span-6 lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em] font-mono flex items-center gap-2 pb-2.5 border-b border-slate-200/70 dark:border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Enterprise Trust &amp; Access</span>
            </div>
            <ul className="space-y-2.5 text-[13.5px] leading-snug">
              <li>
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Sign In to Workspace</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/security-governance"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Security &amp; SOC-2 Governance</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/zero-key-architecture"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Zero Client API Key Storage</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/gdpr-ccpa-compliance"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>GDPR &amp; CCPA Compliance (DPA)</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/dispatch-sla"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>99.99% Dispatch SLA &amp; Status</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/terms-of-service"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Terms of Service &amp; IP Ownership</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/privacy-policy"
                  className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all shrink-0" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Cookie Preferences Drawer (when toggled) */}
        {showCookieModal && (
          <div className="mt-8 p-6 rounded-2xl border border-indigo-500/30 bg-white dark:bg-[#0B0F1E] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Cookie className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Workspace Cookie &amp; Telemetry Preferences</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCookieModal(false)}
                aria-label="Close cookie preferences"
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Strictly Necessary</div>
                  <div className="text-[11px] text-slate-500">Zero-trust auth &amp; CSRF security</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Always On
                </span>
              </div>
              <label className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Studio Performance</div>
                  <div className="text-[11px] text-slate-500">Canvas safe-zone &amp; theme state</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.analytics}
                  onChange={(e) =>
                    setCookiePrefs((p) => ({ ...p, analytics: e.target.checked }))
                  }
                  className="h-4 w-4 accent-indigo-600 cursor-pointer"
                />
              </label>
              <label className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">ROAS Attribution</div>
                  <div className="text-[11px] text-slate-500">First-party campaign lift receipts</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.attribution}
                  onChange={(e) =>
                    setCookiePrefs((p) => ({ ...p, attribution: e.target.checked }))
                  }
                  className="h-4 w-4 accent-indigo-600 cursor-pointer"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link
                href="/trust/cookie-policy"
                className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Read full Cookie &amp; Storage Specification →
              </Link>
              <Button
                type="button"
                onClick={handleSaveCookies}
                className="h-9 px-4 text-xs font-bold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white rounded-xl border-0 cursor-pointer"
              >
                {cookieSaved ? "Preferences Saved ✓" : "Save Preferences"}
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Legal, Social & Back-to-Top Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>&copy; {new Date().getFullYear()} VisionAI Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href="/trust/security-governance"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Security
            </Link>
            <Link
              href="/trust/dispatch-sla"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              System Status
            </Link>
            <Link
              href="/trust/cookie-policy"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Cookie Policy
            </Link>
            <button
              type="button"
              onClick={() => setShowCookieModal((prev) => !prev)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Preferences
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer pl-2 border-l border-slate-200 dark:border-white/10"
            >
              <span>Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
