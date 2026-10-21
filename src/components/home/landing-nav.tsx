"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-8 border-b border-indigo-500/10 bg-white/85 dark:bg-[#070913]/85 backdrop-blur-xl px-6 lg:px-12 transition-colors">
      {/* Zone 1: Single element brand wordmark with seamless Sora V logo */}
      <Link href="/" className="flex items-center gap-3 whitespace-nowrap shrink-0 group">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white overflow-hidden shrink-0 shadow-xs ring-1 ring-indigo-500/15">
          <Image
            src="/assets/aistudio/Vision_AI_Sora_logo_61952a5b.webp"
            alt="VisionAI"
            width={64}
            height={64}
            loading="eager"
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain scale-110"
          />
        </span>
        <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent">
          VisionAI
        </span>
      </Link>

      {/* Zone 2: 4–5 single-line clean navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a
          href="#synthesizer"
          className="hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Live Studio
        </a>
        <a
          href="#capabilities"
          className="hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Brand DNA
        </a>
        <a
          href="#calculator"
          className="hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          ROI Simulator
        </a>
        <a
          href="#proof"
          className="hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Case Studies
        </a>
        <a
          href="#pricing"
          className="hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Pricing
        </a>
      </nav>

      {/* Zone 3: 1 single primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/login" className="hidden sm:inline-flex">
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-semibold whitespace-nowrap shrink-0 gap-2 shadow-md shadow-indigo-500/20 border-0 rounded-xl px-4 h-9 cursor-pointer"
          >
            Launch Workspace <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 dark:text-slate-200 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-[#070913] border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 md:hidden shadow-2xl">
          <a
            href="#synthesizer"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 dark:text-slate-200 py-2 text-sm font-medium"
          >
            Live Studio
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 dark:text-slate-200 py-2 text-sm font-medium"
          >
            Brand DNA
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 dark:text-slate-200 py-2 text-sm font-medium"
          >
            ROI Simulator
          </a>
          <a
            href="#proof"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 dark:text-slate-200 py-2 text-sm font-medium"
          >
            Case Studies
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 dark:text-slate-200 py-2 text-sm font-medium"
          >
            Pricing
          </a>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white font-semibold mt-2 rounded-xl">
              Launch Workspace
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
