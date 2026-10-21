import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/home/landing-nav";
import { HeroInteractiveCanvas } from "@/components/home/hero-interactive-canvas";
import { AdWasteCalculator } from "@/components/home/ad-waste-calculator";
import { InteractiveStudioShowcase } from "@/components/home/interactive-studio-showcase";
import { BentoCapabilities } from "@/components/home/bento-capabilities";
import { CaseStudiesSection } from "@/components/home/case-studies-section";
import { PricingSection } from "@/components/home/pricing-section";
import { LeadCaptureSection } from "@/components/home/lead-capture-section";
import { LandingFooter } from "@/components/home/landing-footer";

export const metadata = {
  title: "VisionAI — Autonomous Brand & Creative Growth Studio",
  description:
    "Engineer fold-safe social ads, ambush competitor campaigns, and scale ROAS 4.4x faster with VisionAI.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* 1. Top Bar Navigation Contract */}
      <LandingNav />

      {/* 2. Architectural Hero + Full-Width Interactive Campaign Synthesizer */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28 px-6 lg:px-12 max-w-7xl mx-auto">
          {/* Signature Royal Cobalt -> Electric Violet -> Orchid Magenta Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[380px] bg-gradient-to-r from-[#1D39C4]/15 via-[#6D28D9]/15 to-[#A824B4]/15 blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Centered Editorial Hero Proposition */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Unboxed Editorial Kicker */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-[13px] font-mono text-indigo-600 dark:text-indigo-400">
              <span className="text-slate-600 dark:text-slate-300 font-sans font-medium tracking-normal">
                Replaces $9,500/mo Agency Retainers
              </span>
            </div>

            {/* Expressive Display Headline with Royal Cobalt -> Violet -> Orchid Gradient */}
            <h1 className="text-[clamp(2.5rem,5.4vw,4.5rem)] font-display font-extrabold tracking-[-0.035em] text-slate-900 dark:text-white leading-[1.04]">
              73% of your ad budget{" "}
              <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
                dies in 1.2 seconds
              </span>{" "}
              of a thumb-scroll.
            </h1>

            {/* Concrete Subheadline (60ch-68ch readable measure) */}
            <p className="text-base sm:text-[19px] text-slate-600 dark:text-slate-300 max-w-[62ch] mx-auto leading-[1.62] font-normal">
              While traditional agencies take 14 days to revise a static banner, your buyers already scrolled past. VisionAI synthesizes{" "}
              <span className="text-slate-900 dark:text-white font-semibold">
                fold-safe social creatives
              </span>
              , ambushes rival pricing moves in real time, and dispatches across 5 networks in 4 minutes.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-semibold tracking-[-0.01em] px-8 h-13 text-[15px] rounded-2xl shadow-xl shadow-indigo-500/25 gap-2.5 cursor-pointer transition-transform hover:scale-[1.02] border-0"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Start 14-Day Risk-Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <a href="#calculator">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-900 dark:text-white px-6 h-13 text-[15px] font-semibold tracking-[-0.01em] rounded-2xl gap-2 cursor-pointer"
                >
                  <Calculator className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Simulate Your ROI Lift</span>
                </Button>
              </a>
            </div>

            {/* Trust & Risk-Reversal Row */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 14-Day 2x Velocity Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero API Key Setup Required
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />{" "}
                <span className="tabular-nums font-semibold text-slate-800 dark:text-white">4.9/5</span>{" "}
                from 1,420+ Growth Teams
              </span>
            </div>
          </div>

          {/* Centerpiece Interactive 3-Column Neural Campaign Synthesizer */}
          <HeroInteractiveCanvas />

          {/* 4-Column Quantified Benchmark Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-[#1D39C4] to-[#6D28D9] dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent tabular-nums">
                4.4x
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                Avg Paid Social ROAS
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fold-safe optical geometry
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-[#6D28D9] to-[#A824B4] dark:from-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent tabular-nums">
                14d → 4m
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                Production Turnaround
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                From brief to 5-network drop
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                -38.4%
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                Blended CAC Reduction
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Zero cropped mobile hooks
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-sm">
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
                $48.2M+
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                Attributed Client Pipeline
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified across 1,400+ brands
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Workflow Compression (14 Days vs 4 Mins) + Competitor Ambush Radar */}
        <InteractiveStudioShowcase />

        {/* 4. Interactive Ad Spend Bleed & ROI Recovery Simulator */}
        <AdWasteCalculator />

        {/* 5. Asymmetric Bento Capabilities Grid */}
        <BentoCapabilities />

        {/* 6. Verified Customer Revenue Receipts (Before vs After) */}
        <CaseStudiesSection />

        {/* 7. High-ROI Pricing + 30-Day Guarantee + Buyer Objection FAQ */}
        <PricingSection />

        {/* 8. Free Custom 3-Ad Teardown Lead Capture */}
        <LeadCaptureSection />
      </main>

      {/* 9. Quiet Professional Footer */}
      <LandingFooter />
    </div>
  );
}
