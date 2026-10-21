"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Copy,
  Check,
  Layers,
  Eye,
  Wand2,
  Share2,
} from "lucide-react";

interface HookVariant {
  id: string;
  angleName: string;
  headline: string;
  subcopy: string;
  ctr: string;
  roas: string;
  thumbScore: string;
}

interface BrandCampaignPreset {
  id: string;
  brand: string;
  category: string;
  handle: string;
  ctaLabel: string;
  badHeadline: string;
  badCtr: string;
  badRoas: string;
  posterGradient: string;
  accentBadge: string;
  hooks: HookVariant[];
}

const CAMPAIGNS: BrandCampaignPreset[] = [
  {
    id: "aura",
    brand: "Aura Botanicals",
    category: "Luxury DTC Skincare",
    handle: "@AuraBotanicals",
    ctaLabel: "Claim Your 30-Sec Skin Audit →",
    badHeadline: "Introducing our new Vitamin C Hydrating Serum — 10% off spring sale",
    badCtr: "0.41%",
    badRoas: "0.9x",
    posterGradient: "from-[#1B3BB6] via-[#5B21B6] to-[#9D24B2]",
    accentBadge: "Cold-Pressed Clinical Formula",
    hooks: [
      {
        id: "contrarian",
        angleName: "01. Contrarian Pattern-Interrupt",
        headline: "Stop putting $90 oxidized water on your face every morning.",
        subcopy:
          "Why 84% of shelf serums lose potency before you open the dropper — and the cold-pressed cellular formula replacing them.",
        ctr: "3.94%",
        roas: "4.4x",
        thumbScore: "96/100",
      },
      {
        id: "receipt",
        angleName: "02. Quantified Clinical Proof",
        headline: "14,200 women ditched their 6-step routine for this single 12-second drop.",
        subcopy:
          "Clinically measured +68% dermal hydration in 14 days without pore-clogging silicones or synthetic fragrance.",
        ctr: "3.68%",
        roas: "4.1x",
        thumbScore: "94/100",
      },
      {
        id: "competitor",
        angleName: "03. Competitor Counter-Wedge",
        headline: "Why luxury department store serums cost $180 but contain 92% filler.",
        subcopy:
          "We stripped out the celebrity retail markup and put 100% of the budget into active bio-peptides.",
        ctr: "4.12%",
        roas: "4.7x",
        thumbScore: "98/100",
      },
    ],
  },
  {
    id: "vertex",
    brand: "Vertex Cloud",
    category: "Enterprise AI SaaS",
    handle: "@VertexCloud_IO",
    ctaLabel: "Run Free Infrastructure Audit →",
    badHeadline: "All-in-one cloud workflow platform for modern engineering teams",
    badCtr: "0.28%",
    badRoas: "0.7x",
    posterGradient: "from-[#0F172A] via-[#1E3A8A] to-[#581C87]",
    accentBadge: "Zero-Latency Cloud Engine",
    hooks: [
      {
        id: "contrarian",
        angleName: "01. Contrarian Pattern-Interrupt",
        headline: "Your senior engineers spend 19 hours a week babysitting broken YAML scripts.",
        subcopy:
          "We replaced 6 brittle DevOps tools with one autonomous deployment pipeline — cutting cloud spend by $142k/yr.",
        ctr: "3.52%",
        roas: "5.1x",
        thumbScore: "95/100",
      },
      {
        id: "receipt",
        angleName: "02. Quantified CFO Receipt",
        headline: "How Aether Systems cut AWS & deployment overhead by 64% in one afternoon.",
        subcopy:
          "Zero migration downtime. Instant SOC-2 compliance guardrails out of the box.",
        ctr: "3.38%",
        roas: "4.8x",
        thumbScore: "93/100",
      },
      {
        id: "competitor",
        angleName: "03. Competitor Counter-Wedge",
        headline: "Before you renew that $60k legacy cloud contract, read this 2-minute teardown.",
        subcopy:
          "Why 412 scaling CTOs migrated off per-seat pricing traps this quarter.",
        ctr: "3.89%",
        roas: "5.4x",
        thumbScore: "97/100",
      },
    ],
  },
  {
    id: "kinetic",
    brand: "Kinetic Audio",
    category: "Spatial Hardware",
    handle: "@KineticSound",
    ctaLabel: "Experience Studio Acoustics →",
    badHeadline: "Shop our new wireless noise-canceling headphones with 30-hour battery",
    badCtr: "0.51%",
    badRoas: "1.1x",
    posterGradient: "from-[#1E1B4B] via-[#4C1D95] to-[#86198F]",
    accentBadge: "Lossless Planar Magnetic",
    hooks: [
      {
        id: "contrarian",
        angleName: "01. Contrarian Pattern-Interrupt",
        headline: "Plastic bluetooth headphones are compressing 70% of the music you pay for.",
        subcopy:
          "Engineered with studio-grade planar magnetic drivers so you hear the breath between every note.",
        ctr: "4.05%",
        roas: "4.6x",
        thumbScore: "96/100",
      },
      {
        id: "receipt",
        angleName: "02. Grammy Producer Proof",
        headline: "Why 340+ mastering engineers use Kinetic when they leave the studio.",
        subcopy:
          "Zero frequency distortion at 110dB. Machined anodized aluminum built to last a decade.",
        ctr: "3.79%",
        roas: "4.3x",
        thumbScore: "94/100",
      },
      {
        id: "competitor",
        angleName: "03. Competitor Counter-Wedge",
        headline: "We tore down the $549 market leader. Inside was $28 of stamped plastic.",
        subcopy:
          "See the side-by-side acoustic spectrum test that shocked audiophiles.",
        ctr: "4.41%",
        roas: "5.0x",
        thumbScore: "99/100",
      },
    ],
  },
];

export function HeroInteractiveCanvas() {
  const [selectedCampaign, setSelectedCampaign] = useState<BrandCampaignPreset>(CAMPAIGNS[0]);
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);
  const [compareBroken, setCompareBroken] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeHook = selectedCampaign.hooks[selectedHookIndex] || selectedCampaign.hooks[0];

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${activeHook.headline}\n\n${activeHook.subcopy}`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="synthesizer" className="w-full max-w-6xl mx-auto mt-12">
      {/* Outer Luminous Neural Frame */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#1D39C4]/50 via-[#6D28D9]/50 to-[#A824B4]/50 shadow-[0_30px_90px_-20px_rgba(91,33,182,0.35)]">
        <div className="rounded-[23px] bg-[#080B16] text-white p-5 sm:p-8 space-y-6">
          {/* Top Bar of the Studio Stage: Brand Selector + X-Ray Toggle */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-indigo-300 uppercase tracking-wider mr-2 flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-fuchsia-400" />
                <span>1. Select Brand Brief:</span>
              </span>
              {CAMPAIGNS.map((c) => {
                const active = c.id === selectedCampaign.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCampaign(c);
                      setSelectedHookIndex(0);
                      setCompareBroken(false);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white shadow-md shadow-indigo-500/25"
                        : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/10"
                    }`}
                  >
                    {c.brand} <span className="opacity-70 font-normal">· {c.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Before vs After X-Ray Switch */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#04060D] border border-white/10 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setCompareBroken(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !compareBroken
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                <span>VisionAI Engineered</span>
              </button>
              <button
                type="button"
                onClick={() => setCompareBroken(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  compareBroken
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Compare Generic Ad</span>
              </button>
            </div>
          </div>

          {/* 3-Column Interactive Studio Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* COLUMN 1 (4 cols): Live Visual Ad Poster */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCampaign.id}-${activeHook.id}-${compareBroken}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`relative h-full min-h-[360px] rounded-2xl p-6 flex flex-col justify-between overflow-hidden border transition-all ${
                    compareBroken
                      ? "bg-slate-900 border-rose-500/50"
                      : `bg-gradient-to-br ${selectedCampaign.posterGradient} border-white/20 shadow-2xl`
                  }`}
                >
                  {/* Safe Zone Guide Overlay */}
                  {!compareBroken ? (
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-semibold">
                        {selectedCampaign.accentBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                        Fold-Safe 9:16
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">{selectedCampaign.handle}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold">
                        UI Collision Detected
                      </span>
                    </div>
                  )}

                  {/* Poster Center Typography */}
                  <div className="my-auto py-6 space-y-3">
                    {!compareBroken ? (
                      <>
                        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-[1.15] tracking-tight">
                          {activeHook.headline}
                        </h3>
                        <p className="text-xs text-indigo-100/90 leading-relaxed">
                          {activeHook.subcopy}
                        </p>
                      </>
                    ) : (
                      <div className="p-3 rounded-xl border border-dashed border-rose-500/60 bg-rose-950/30 space-y-2">
                        <span className="text-[10px] font-mono text-rose-300 block">
                          ✗ Weak generic claim · Clipped by right-side app icons
                        </span>
                        <h3 className="font-sans font-medium text-base text-slate-300">
                          {selectedCampaign.badHeadline}
                        </h3>
                      </div>
                    )}
                  </div>

                  {/* Poster Bottom CTA */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    {!compareBroken ? (
                      <span className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg">
                        {selectedCampaign.ctaLabel}
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 text-xs">
                        Learn More (Obscured by Caption)
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-white/70">
                      {selectedCampaign.handle}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* COLUMN 2 (5 cols): Interactive Psychological Hook Switcher */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-mono text-indigo-300 uppercase tracking-wider mb-1">
                  2. Click a Hook Angle to Test Live:
                </div>
                <p className="text-xs text-slate-400">
                  VisionAI generates 3 psychological angles for every campaign. Click any card below to update the live ad poster:
                </p>
              </div>

              <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                {selectedCampaign.hooks.map((h, idx) => {
                  const isSelected = idx === selectedHookIndex && !compareBroken;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setSelectedHookIndex(idx);
                        setCompareBroken(false);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#1D39C4]/25 via-[#6D28D9]/25 to-[#A824B4]/20 border-indigo-400/60 shadow-lg"
                          : "bg-white/[0.03] border-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-300">
                          {h.angleName}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {h.roas} ROAS · {h.ctr} CTR
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white leading-snug">
                        &ldquo;{h.headline}&rdquo;
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied Hook!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Winning Hook</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  Trained on $48M+ verified social spend
                </span>
              </div>
            </div>

            {/* COLUMN 3 (3 cols): Live Performance Telemetry & Studio Launch */}
            <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-2xl bg-[#04060D] border border-white/10 space-y-5">
              <div className="space-y-4">
                <div className="text-xs font-mono text-indigo-300 uppercase tracking-wider">
                  3. Predicted Impact
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] text-slate-400">Projected Ad ROAS</div>
                    <div
                      className={`text-2xl sm:text-3xl font-display font-extrabold font-mono tabular-nums mt-0.5 ${
                        compareBroken ? "text-rose-400" : "text-white"
                      }`}
                    >
                      {compareBroken ? selectedCampaign.badRoas : activeHook.roas}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      {compareBroken ? "Losing ad spend" : "+310% vs generic baseline"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] text-slate-400">Thumb-Stop CTR</div>
                    <div
                      className={`text-2xl font-display font-extrabold font-mono tabular-nums mt-0.5 ${
                        compareBroken ? "text-rose-400" : "text-indigo-300"
                      }`}
                    >
                      {compareBroken ? selectedCampaign.badCtr : activeHook.ctr}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Score: {compareBroken ? "31/100" : activeHook.thumbScore}
                    </div>
                  </div>
                </div>

                {/* Synced Channels */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Ready for 5-Network Dispatch:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-white/[0.06]">IG Reels</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.06]">TikTok</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.06]">LinkedIn</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.06]">X</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.06]">YT Shorts</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/creative-canvas?brand=${encodeURIComponent(
                    selectedCampaign.brand
                  )}&handle=${encodeURIComponent(
                    selectedCampaign.handle
                  )}&headline=${encodeURIComponent(
                    activeHook.headline
                  )}&subhead=${encodeURIComponent(
                    activeHook.subcopy
                  )}&cta=${encodeURIComponent(
                    selectedCampaign.ctaLabel
                  )}&aspect=9:16`}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <span>Edit {selectedCampaign.brand} in Studio</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
