import React from "react";

interface CaseStudy {
  metric: string;
  metricLabel: string;
  timeframe: string;
  company: string;
  industry: string;
  beforeState: string;
  afterState: string;
  quote: string;
  author: string;
  role: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    metric: "+214%",
    metricLabel: "Paid Social ROAS Lift",
    timeframe: "Verified in 60 Days",
    company: "Northwind Consumer",
    industry: "DTC Skincare & Wellness",
    beforeState: "$9,500/mo agency retainer · 12-day wait per ad batch · 0.6% CTR",
    afterState: "40 fold-safe ad variants/wk · 4-minute turnaround · 3.9% CTR",
    quote:
      "We replaced our $9.5k/month creative agency after two weeks on VisionAI. Simply fixing our TikTok and Reels safe-zone collisions dropped our blended CAC by 38% in the first month.",
    author: "Elena Rostova",
    role: "VP of Growth & Acquisition",
  },
  {
    metric: "$1.84M",
    metricLabel: "New Pipeline Captured",
    timeframe: "Past 2 Quarters",
    company: "Aether Cloud Systems",
    industry: "B2B SaaS Infrastructure",
    beforeState: "Missed rival pricing changes · Weeks to launch comparison campaigns",
    afterState: "45-minute automated counter-campaigns · 84 enterprise accounts won",
    quote:
      "When our biggest competitor hiked their enterprise tier prices, VisionAI detected the change and generated our LinkedIn counter-battlecard before noon. That single campaign closed $1.84M in ARR.",
    author: "Marcus Thorne",
    role: "Chief Marketing Officer",
  },
  {
    metric: "118 hrs",
    metricLabel: "Saved Per Month",
    timeframe: "Across 42 Brand Accounts",
    company: "Pulse Scale Media",
    industry: "Performance Growth Agency",
    beforeState: "3 full-time designers manually resizing banners for 5 social networks",
    afterState: "1-click multi-ratio synthesis & auto-dispatch across all client feeds",
    quote:
      "Our media buyers used to spend half their week waiting on designers for 9:16 and 1:1 resizes. Now they generate, preview safe-zones, and schedule 5-network drops themselves in minutes.",
    author: "Samantha Chen",
    role: "Managing Partner",
  },
];

export function CaseStudiesSection() {
  return (
    <section id="proof" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold mb-2.5">
          Audited Customer Receipts
        </div>
        <h2 className="text-[clamp(2rem,4.2vw,3.35rem)] font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.032em] leading-[1.06]">
          Real brands.{" "}
          <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
            Undeniable
          </span>{" "}
          revenue receipts.
        </h2>
        <p className="mt-3.5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-[1.6] max-w-[58ch] mx-auto">
          See what happens when growth teams stop paying for slow manual revisions and switch to autonomous creative execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CASE_STUDIES.map((study, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] hover:border-indigo-500/40 shadow-lg shadow-indigo-500/5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Unboxed Metadata Header */}
              <div className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="font-bold text-slate-900 dark:text-white">{study.company}</span>
                <span aria-hidden="true">·</span>
                <span>{study.industry}</span>
              </div>

              {/* Dominant Metric */}
              <div className="border-b border-slate-100 dark:border-white/10 pb-5">
                <div className="text-4xl sm:text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 tracking-tight tabular-nums">
                  {study.metric}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white mt-1.5">
                  {study.metricLabel}{" "}
                  <span className="text-slate-400 font-mono font-normal text-xs">· {study.timeframe}</span>
                </div>
              </div>

              {/* Before vs After Contrast */}
              <div className="space-y-2.5 text-xs sm:text-[13px]">
                <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 uppercase text-[11px] block mb-0.5">
                    Before VisionAI:
                  </span>
                  {study.beforeState}
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/25 text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase text-[11px] block mb-0.5">
                    With VisionAI:
                  </span>
                  {study.afterState}
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-[1.62] pt-1">
                &ldquo;{study.quote}&rdquo;
              </p>
            </div>

            {/* Author Attribution */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{study.author}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{study.role}</div>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Verified Buyer
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

