import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BentoCapabilities() {
  return (
    <section id="capabilities" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold mb-2.5">
          Brand DNA &amp; Creative Architecture
        </div>
        <h2 className="text-[clamp(2rem,4.2vw,3.35rem)] font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.032em] leading-[1.06]">
          Built to replace{" "}
          <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
            five disconnected tools
          </span>{" "}
          and a slow agency retainer.
        </h2>
        <p className="mt-3.5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-[1.6] max-w-[58ch] mx-auto">
          Every studio is engineered around a single goal: turning passive scrollers into high-intent buyers with zero creative bottlenecks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bento 1: Large (col-span-2) Fold-Aware Studio */}
        <div className="md:col-span-2 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] hover:border-indigo-500/40 shadow-lg shadow-indigo-500/5 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">01. Optical Safe-Zone Engineering</span>
              <span className="text-slate-400">9:16 Reels · 1:1 Feed · 16:9 Wide</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-[-0.028em] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              Never Lose a Sale to a Covered Headline Again
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-[15px] sm:text-base leading-[1.62] max-w-[62ch]">
              Native TikTok, Reels, and Shorts interfaces cover 28% of the screen with mute buttons, author handles, and caption drawers. Our Fold-Aware Canvas mathematically locks your hook and CTA inside the high-conversion optical zone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10">
                <div className="text-xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">0% Cutoffs</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Live Overlay Masks</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Preview exact app UI obstructions before exporting.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10">
                <div className="text-xl font-display font-extrabold text-fuchsia-600 dark:text-fuchsia-400 tabular-nums">4.4x ROAS</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Pattern-Interrupt Hooks</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Trained on $48M+ of top-performing social campaigns.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10">
                <div className="text-xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">4 Seconds</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Multi-Ratio Adaptation</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">1 click adapts layout across Story, Square, and Wide.</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/studios/fold-aware-canvas"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 inline-flex items-center gap-1.5 transition-opacity"
            >
              Explore Fold-Aware Canvas Architecture <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bento 2: Regular (col-span-1) Brand Voice DNA */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] hover:border-indigo-500/40 shadow-lg shadow-indigo-500/5 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono">
              <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold">02. Brand Voice Memory</span>
              <span className="text-slate-400">Zero Slop</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold tracking-[-0.026em] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              Sounds Like Your Best Copywriter, Never a Robot
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-[1.6]">
              Lock in your brand&apos;s exact vocabulary, forbidden buzzwords, customer proof points, and tone so every post reads like an executive wrote it.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10 space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white">Anti-Cliché Guardrails</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Strips generic AI filler and enforces concrete, high-converting claims.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/studios/brand-voice"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 inline-flex items-center gap-1.5 transition-opacity"
            >
              Explore Brand Voice &amp; Guardrails <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bento 3: Regular (col-span-1) Competitor Radar */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] hover:border-indigo-500/40 shadow-lg shadow-indigo-500/5 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">03. Market Radar</span>
              <span className="text-slate-400">24/7 Watch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold tracking-[-0.026em] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              Turn Competitor Blind Spots Into Your Pipeline
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-[1.6]">
              The moment a rival changes pricing or floods ad auctions, VisionAI drafts the exact counter-narrative to intercept their buyers.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10 space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Counter-Battlecards</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-mono tabular-nums">+44% Win Rate</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Instant side-by-side comparison hooks ready to publish.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/studios/competitor-radar"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 inline-flex items-center gap-1.5 transition-opacity"
            >
              Explore Competitor Ambush Radar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bento 4: Large (col-span-2) Multi-Channel Dispatch & Attribution */}
        <div className="md:col-span-2 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] hover:border-indigo-500/40 shadow-lg shadow-indigo-500/5 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">04. Autonomous 5-Network Dispatch</span>
              <span className="text-slate-400">LinkedIn · X · Instagram · TikTok · YouTube</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-[-0.028em] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              Command Your Entire Acquisition Calendar From One Cockpit
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-[15px] sm:text-base leading-[1.62] max-w-[62ch]">
              Approve a campaign once and let VisionAI handle peak-window scheduling, platform-native caption formatting, and live revenue attribution across every social channel.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Peak-Traffic Timing</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Dispatches when your exact buyer segment is active.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Guaranteed Delivery</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Auto-retry protection ensures zero missed product drops.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/70 dark:border-white/10">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Closed-Loop Attribution</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">See which exact hook and visual drove pipeline revenue.</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/studios/command-center"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 inline-flex items-center gap-1.5 transition-opacity"
            >
              Explore Command Center Architecture <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

