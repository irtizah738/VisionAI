"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdWasteCalculator() {
  const [monthlySpend, setMonthlySpend] = useState<number>(35000);
  const [creativesPerMonth, setCreativesPerMonth] = useState<number>(16);
  const [teamModel, setTeamModel] = useState<"agency" | "inhouse" | "solo">("agency");

  const wastedSpendRecovered = Math.round(monthlySpend * 0.27);
  const agencyFeePerCreative = teamModel === "agency" ? 420 : teamModel === "inhouse" ? 240 : 150;
  const productionSavings = Math.round(creativesPerMonth * agencyFeePerCreative);
  const projectedRevenueLift = Math.round(monthlySpend * 1.85 + productionSavings);
  const hoursSaved = Math.round(creativesPerMonth * 4.5);

  return (
    <section id="calculator" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Framing & Sliders */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3.5">
            <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold">
              Interactive Profit &amp; Spend Simulator
            </div>
            <h2 className="text-[clamp(2rem,4.2vw,3.35rem)] font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.032em] leading-[1.06]">
              See how much ad budget you{" "}
              <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
                reclaim
              </span>{" "}
              in 30 days.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-[1.6] max-w-[56ch]">
              Creative fatigue and mobile UI collisions silently drain 27% of paid social budgets. Drag the sliders below to simulate your monthly recovery with VisionAI.
            </p>
          </div>

          {/* Interactive Sliders Box */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] shadow-xl shadow-indigo-500/5 space-y-7">
            {/* Slider 1: Monthly Ad Spend */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="spend-slider" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  1. Monthly Paid Social &amp; Ad Spend
                </label>
                <span className="text-xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  ${monthlySpend.toLocaleString()}/mo
                </span>
              </div>
              <input
                id="spend-slider"
                type="range"
                min={5000}
                max={200000}
                step={5000}
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 tabular-nums">
                <span>$5,000/mo</span>
                <span>$50,000/mo</span>
                <span>$100,000/mo</span>
                <span>$200,000/mo</span>
              </div>
            </div>

            {/* Slider 2: Creative Variations Needed Per Month */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="creatives-slider" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  2. Ad Variations Launched Per Month
                </label>
                <span className="text-xl font-mono font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {creativesPerMonth} creatives/mo
                </span>
              </div>
              <input
                id="creatives-slider"
                type="range"
                min={4}
                max={80}
                step={4}
                value={creativesPerMonth}
                onChange={(e) => setCreativesPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 tabular-nums">
                <span>4 / mo</span>
                <span>24 / mo</span>
                <span>48 / mo</span>
                <span>80 / mo</span>
              </div>
            </div>

            {/* Selector 3: Current Production Setup */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                3. Current Creative Production Setup
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "agency", label: "External Agency" },
                  { id: "inhouse", label: "In-House Team" },
                  { id: "solo", label: "Founder / Solo" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTeamModel(item.id as "agency" | "inhouse" | "solo")}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      teamModel === item.id
                        ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Impact Financial Receipt */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0B0F1E] via-[#11162F] to-[#1D1033] text-white p-8 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.12em] text-indigo-300 font-bold">
                  30-Day VisionAI Impact Projection
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Calibrated across 1,400+ active brand portfolios
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-fuchsia-400 shrink-0" />
            </div>

            {/* Primary Giant Output */}
            <div className="p-6 rounded-2xl bg-[#060913]/90 border border-white/10 space-y-1">
              <div className="text-xs font-mono uppercase tracking-[0.1em] text-indigo-300">
                Projected Monthly Pipeline &amp; Savings Lift
              </div>
              <div className="text-4xl sm:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-fuchsia-300 tabular-nums tracking-tight">
                +${projectedRevenueLift.toLocaleString()}
                <span className="text-lg text-slate-400 font-sans font-normal">/mo</span>
              </div>
              <div className="text-sm text-emerald-400 font-semibold pt-1 tabular-nums">
                +${(projectedRevenueLift * 12).toLocaleString()} annualized impact
              </div>
            </div>

            {/* 3 Breakdown Receipts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-xs text-slate-300 font-medium">Ad Waste Recovered</div>
                <div className="text-xl font-mono font-bold text-indigo-300 tabular-nums mt-1">
                  ${wastedSpendRecovered.toLocaleString()}/mo
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Zero fold-cutoffs</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-xs text-slate-300 font-medium">Retainer Saved</div>
                <div className="text-xl font-mono font-bold text-fuchsia-300 tabular-nums mt-1">
                  ${productionSavings.toLocaleString()}/mo
                </div>
                <div className="text-xs text-slate-400 mt-0.5">In-house autonomy</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-xs text-slate-300 font-medium">Turnaround Saved</div>
                <div className="text-xl font-mono font-bold text-emerald-400 tabular-nums mt-1">
                  {hoursSaved} hrs/mo
                </div>
                <div className="text-xs text-slate-400 mt-0.5">14 days → 4 mins</div>
              </div>
            </div>

            {/* Direct Personalized CTA */}
            <div className="pt-2 space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full h-13 bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-500/25 gap-2 cursor-pointer border-0">
                  <span>Unlock +${projectedRevenueLift.toLocaleString()}/Mo — Start 14-Day Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="text-center text-[11px] text-slate-400 font-mono">
                14-Day 2x Creative Velocity Trial · Cancel anytime in 1 click
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
