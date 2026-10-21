"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RivalEvent {
  id: string;
  competitor: string;
  eventTitle: string;
  detectedAgo: string;
  vulnerablePoint: string;
  counterHook: string;
  counterBody: string;
  winLift: string;
}

const RIVAL_EVENTS: RivalEvent[] = [
  {
    id: "pricing",
    competitor: "Competitor A · Pricing Shift",
    eventTitle: "Rival Quietly Hikes Enterprise Tier by 28%",
    detectedAgo: "Detected 14 mins ago via Pricing Monitor",
    vulnerablePoint:
      "Existing mid-market customers feel locked-in and overcharged. Strike immediately with a transparent migration offer.",
    counterHook: "Why Legacy Platforms Penalize Your Growth With Surprise Renewal Hikes.",
    counterBody:
      "Scaling your team shouldn't trigger a 28% tax on your software renewal. Switch to VisionAI's flat-rate autonomous studio in 15 minutes — and lock in your rate for 24 months.",
    winLift: "+44% Switching Conversion",
  },
  {
    id: "launch",
    competitor: "Competitor B · Ad Blitz",
    eventTitle: "Rival Launches 18 New Meta & LinkedIn Comparison Ads",
    detectedAgo: "Detected 32 mins ago via Ad Library Radar",
    vulnerablePoint:
      "Their ads rely on static stock templates with headlines clipped on mobile Reels. Counter with side-by-side speed and ROAS receipts.",
    counterHook: "Anyone Can Buy Comparison Ads. Only One Platform Ships Fold-Safe Campaigns in 4 Minutes.",
    counterBody:
      "Don't settle for stitched-together point tools. See why 1,400+ growth teams replaced $9.5k/mo agency retainers with VisionAI's unified creative and dispatch engine.",
    winLift: "+3.2x CTR Outperformance",
  },
  {
    id: "outage",
    competitor: "Competitor C · Feature Gap",
    eventTitle: "Rival Drops Native TikTok & Shorts Safe-Zone Support",
    detectedAgo: "Detected 1 hr ago via Changelog & User Reviews",
    vulnerablePoint:
      "Media buyers are complaining about cropped captions on vertical video. Highlight 100% optical safe-zone verification.",
    counterHook: "Stop Guessing Where TikTok and Reels Buttons Will Cover Your Copy.",
    counterBody:
      "VisionAI mathematically locks your headline and CTA inside the 100% visible optical zone across 9:16, 1:1, and 16:9 — zero manual resizing required.",
    winLift: "-38% Blended CAC",
  },
];

export function InteractiveStudioShowcase() {
  const [selectedEvent, setSelectedEvent] = useState<RivalEvent>(RIVAL_EVENTS[0]);
  const [workflowView, setWorkflowView] = useState<"visionai" | "agency">("visionai");

  return (
    <section id="studios" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Part 1: The Old Agency Way vs The VisionAI Way */}
      <div className="mb-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold mb-2.5">
            Workflow Compression
          </div>
          <h2 className="text-[clamp(2rem,4.2vw,3.35rem)] font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.032em] leading-[1.06]">
            Why wait{" "}
            <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
              14 business days
            </span>{" "}
            for what takes 4 minutes?
          </h2>
          <p className="mt-3.5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-[1.6] max-w-[58ch] mx-auto">
            Toggle below to compare a traditional $9,500/mo creative retainer against VisionAI&apos;s autonomous pipeline.
          </p>

          {/* Toggle Switch */}
          <div className="mt-7 inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => setWorkflowView("visionai")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                workflowView === "visionai"
                  ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>VisionAI Autonomous Flow (4 Mins)</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkflowView("agency")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                workflowView === "agency"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Traditional Agency Retainer (14 Days)</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {workflowView === "visionai" ? (
            <motion.div
              key="visionai-flow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-5"
            >
              {[
                {
                  step: "Minute 01",
                  title: "Drop Your URL or Goal",
                  desc: "VisionAI extracts your brand palette, tone guardrails, and core value proposition automatically.",
                },
                {
                  step: "Minute 02",
                  title: "3 Psychological Hooks",
                  desc: "Generates contrarian, proof-receipt, and competitor-wedge hooks scored for thumb-stop power.",
                },
                {
                  step: "Minute 03",
                  title: "Fold-Safe Visual Synthesis",
                  desc: "Renders 9:16, 1:1, and 16:9 ad posters with mathematical safe-zones so zero text is clipped.",
                },
                {
                  step: "Minute 04",
                  title: "5-Network Auto-Dispatch",
                  desc: "Publishes or schedules across Instagram, TikTok, LinkedIn, X, and YouTube with live ROAS tracking.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0B0F1E] border border-indigo-500/20 shadow-lg shadow-indigo-500/5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-[13px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {item.step}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-display font-bold tracking-[-0.022em] text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-[1.6]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="agency-flow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-5"
            >
              {[
                {
                  step: "Days 01 – 04",
                  title: "Briefing & Kickoff Calls",
                  desc: "Write a 6-page Google Doc brief and wait four days for the account manager to assign a copywriter.",
                },
                {
                  step: "Days 05 – 09",
                  title: "Polite, Generic Drafts",
                  desc: "Receive safe, forgettable copy that sounds like every other brand in your industry.",
                },
                {
                  step: "Days 10 – 12",
                  title: "Figma Resize Bottleneck",
                  desc: "Pay extra billable hours to resize 1:1 banners into 9:16 Stories — with text still covered by TikTok icons.",
                },
                {
                  step: "Days 13 – 14",
                  title: "Manual CSV Scheduling",
                  desc: "By the time your campaign goes live, the market trend or competitor window has already closed.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/15 border border-rose-500/30 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-[13px] font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                        {item.step}
                      </span>
                      <XCircle className="h-4 w-4 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-display font-bold tracking-[-0.022em] text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-[1.6]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Part 2: Live Competitor Ambush Radar */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B0F1E] via-[#0F1429] to-[#1A1033] text-white p-8 sm:p-12 border border-indigo-500/25 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-300 font-semibold flex items-center gap-2">
              <Radar className="h-4 w-4 text-fuchsia-400" />
              <span>24/7 Competitive Intelligence</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight leading-[1.1]">
              Ambush rival campaigns before their ads even peak.
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Click a live competitor event below to see how VisionAI detects rival vulnerability and generates a ready-to-launch counter-campaign:
            </p>

            <div className="space-y-2.5">
              {RIVAL_EVENTS.map((ev) => {
                const active = ev.id === selectedEvent.id;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#1D39C4]/40 via-[#6D28D9]/40 to-[#A824B4]/30 border-indigo-400 shadow-lg"
                        : "bg-white/[0.04] border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{ev.eventTitle}</div>
                    <div className="text-[11px] font-mono text-indigo-300 mt-1">{ev.detectedAgo}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#060913]/90 border border-white/15 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono text-fuchsia-400 uppercase tracking-wider block">
                    {selectedEvent.competitor}
                  </span>
                  <h4 className="text-lg font-display font-bold text-white mt-0.5">
                    {selectedEvent.eventTitle}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
                  {selectedEvent.winLift}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-indigo-300">Strategic Vulnerability:</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedEvent.vulnerablePoint}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1D39C4]/20 via-[#6D28D9]/20 to-[#A824B4]/20 border border-indigo-400/30 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                  Auto-Generated Counter-Campaign Copy:
                </div>
                <div className="text-base font-display font-bold text-white">
                  &ldquo;{selectedEvent.counterHook}&rdquo;
                </div>
                <p className="text-xs text-indigo-100/90 leading-relaxed">
                  {selectedEvent.counterBody}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <Link
                  href={`/creative-canvas?brand=${encodeURIComponent(
                    selectedEvent.competitor
                  )}&handle=${encodeURIComponent(
                    "@VisionAI_HQ"
                  )}&headline=${encodeURIComponent(
                    selectedEvent.counterHook
                  )}&subhead=${encodeURIComponent(
                    selectedEvent.counterBody
                  )}&aspect=9:16`}
                >
                  <Button
                    variant="outline"
                    className="border-indigo-400/40 bg-white/[0.05] hover:bg-white/[0.12] text-white text-xs font-semibold rounded-xl px-4 h-10 cursor-pointer"
                  >
                    Open Counter-Ad in Canvas
                  </Button>
                </Link>
                <Link href={`/competitor-intel?ambush=${selectedEvent.id}`}>
                  <Button className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white text-xs font-bold rounded-xl px-5 h-10 gap-2 cursor-pointer border-0">
                    <span>Deploy Counter-Campaign in Radar</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
