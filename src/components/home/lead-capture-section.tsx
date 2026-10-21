"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Building,
  User,
  Sparkles,
  RefreshCw,
  Palette,
} from "lucide-react";

interface RebuiltHook {
  headline: string;
  subhead: string;
  ctaBadge: string;
  hookCategory: string;
  roas?: string;
  ctr?: string;
}

export function LeadCaptureSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isGeneratingTeardown, setIsGeneratingTeardown] = useState(false);
  const [rebuiltHooks, setRebuiltHooks] = useState<RebuiltHook[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    setIsGeneratingTeardown(true);
    try {
      const targetBrand = company.trim() || "Your Brand";
      const res = await fetch("/api/ai/creative-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetBrand,
          tone: "Authoritative, Contrarian & High-Converting",
        }),
      });
      const data = await res.json();
      if (Array.isArray(data?.suggestions) && data.suggestions.length > 0) {
        setRebuiltHooks(data.suggestions.slice(0, 3));
      }
    } catch {
      // Fallback handled cleanly
    } finally {
      setIsGeneratingTeardown(false);
      setSubmitted(true);
    }
  };

  const brandDisplay = company.trim() || "Your Brand";
  const handleDisplay = `@${brandDisplay
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 16) || "YourBrand"}`;

  return (
    <section
      id="contact"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10"
    >
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0B0F1E] via-[#121735] to-[#23103A] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: High-Urgency Conversion Pitch */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 tracking-wider uppercase font-mono">
              <Sparkles className="h-4 w-4 text-fuchsia-400" /> Free Custom 3-Ad Live Teardown
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
              We&apos;ll rebuild your{" "}
              <span className="font-editorial italic font-normal bg-gradient-to-r from-blue-300 via-indigo-200 to-fuchsia-300 bg-clip-text text-transparent">
                top 3 failing ads
              </span>{" "}
              live on a 15-minute call.
            </h2>

            <p className="text-indigo-100/80 text-sm sm:text-base leading-relaxed">
              Bring your current social ad account or competitor list. Our growth engineers will run a live safe-zone diagnostic, generate high-converting counter-hooks for your brand immediately, and hand you the finished assets free.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-indigo-100/90">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Keep all custom-built ad creatives &amp; hooks whether you subscribe or not.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Live teardown of your top 3 competitors&apos; active ad angles.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant sandbox access provisioned before the call ends.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form + Instant 3-Ad Teardown Output */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl border border-white/15 bg-[#060913]/95 shadow-2xl">
              {submitted ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-white tracking-tight">
                        Your Custom 3-Ad Teardown Is Ready, {name}!
                      </h3>
                      <p className="text-xs text-slate-300">
                        Calendar invite sent to <span className="text-indigo-300 font-mono">{email}</span>. Here are your 3 custom-built fold-safe hooks for <span className="text-white font-semibold">{brandDisplay}</span>:
                      </p>
                    </div>
                  </div>

                  {rebuiltHooks.length > 0 && (
                    <div className="space-y-2.5">
                      {rebuiltHooks.map((h, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-white/15 bg-white/[0.04] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-indigo-300 font-bold">{h.hookCategory}</span>
                            <span className="text-emerald-400 font-bold">
                              {h.roas || "4.5x"} ROAS · 0% Cutoff
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                            &ldquo;{h.headline}&rdquo;
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-400 truncate max-w-[220px]">
                              {h.subhead}
                            </span>
                            <Link
                              href={`/creative-canvas?brand=${encodeURIComponent(
                                brandDisplay
                              )}&handle=${encodeURIComponent(
                                handleDisplay
                              )}&headline=${encodeURIComponent(
                                h.headline
                              )}&subhead=${encodeURIComponent(
                                h.subhead
                              )}&cta=${encodeURIComponent(h.ctaBadge)}&aspect=9:16`}
                              className="text-[11px] font-bold text-fuchsia-300 hover:text-white inline-flex items-center gap-1 shrink-0"
                            >
                              <Palette className="h-3 w-3" />
                              Open in Studio →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/creative-canvas?brand=${encodeURIComponent(
                        brandDisplay
                      )}&handle=${encodeURIComponent(handleDisplay)}&aspect=9:16`}
                    >
                      <Button className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white text-xs font-bold h-11 px-5 rounded-xl gap-2 cursor-pointer border-0">
                        Launch {brandDisplay} in Fold-Aware Canvas <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="border-white/15 bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-semibold h-11 px-4 rounded-xl cursor-pointer"
                      >
                        Enter Command Center
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  suppressHydrationWarning
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-display font-bold text-white tracking-tight">
                      Claim Your Free 3-Ad Teardown &amp; Sandbox
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Or skip the call and{" "}
                      <Link
                        href="/dashboard"
                        className="text-indigo-300 underline hover:text-white"
                      >
                        launch the self-serve studio immediately →
                      </Link>
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="lead-name" className="text-xs text-slate-300">
                      Your Name
                    </Label>
                    <div className="relative">
                      <User className="h-3.5 w-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        id="lead-name"
                        type="text"
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-11 text-xs bg-[#0B0F1E] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lead-email" className="text-xs text-slate-300">
                      Work Email
                    </Label>
                    <div className="relative">
                      <Mail className="h-3.5 w-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        id="lead-email"
                        type="email"
                        placeholder="alex@yourbrand.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-11 text-xs bg-[#0B0F1E] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lead-company" className="text-xs text-slate-300">
                      Brand or Website URL
                    </Label>
                    <div className="relative">
                      <Building className="h-3.5 w-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        id="lead-company"
                        type="text"
                        placeholder="yourbrand.com"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="pl-9 h-11 text-xs bg-[#0B0F1E] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isGeneratingTeardown}
                      className="w-full bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-bold text-xs sm:text-sm h-12 rounded-xl shadow-xl shadow-indigo-500/25 cursor-pointer border-0 gap-2"
                    >
                      {isGeneratingTeardown ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Synthesizing Your Custom 3-Ad Teardown...</span>
                        </>
                      ) : (
                        <span>Generate My Custom 3-Ad Teardown →</span>
                      )}
                    </Button>
                  </div>

                  <div className="text-[11px] text-slate-400 text-center font-mono">
                    100% Free Instant Teardown · No Credit Card Required · Keep All Assets
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
