"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "Will the ads and posts look or sound like generic AI templates?",
    a: "Never. Generic AI fails because it ignores mobile safe-zones and uses cliché buzzwords. VisionAI locks in your brand's exact tone, enforces banned-word guardrails, and mathematically positions typography inside high-converting optical zones.",
  },
  {
    q: "How fast can we launch our first multi-channel campaign?",
    a: "Under 6 minutes from signup. Connect your social channels or start immediately in the Fold-Aware Creative Canvas, generate your 9:16, 1:1, and 16:9 variations in one click, and schedule your drop.",
  },
  {
    q: "Do we need to bring our own OpenAI or Gemini API keys?",
    a: "No. All enterprise AI inference, image synthesis, and competitor radar scans are included in your plan and executed through our zero-trust server proxy — meaning zero surprise API bills and zero exposed keys.",
  },
  {
    q: "What if VisionAI doesn't double our creative velocity in 14 days?",
    a: "You get a 100% refund with one click — and you keep every creative asset, hook library, and competitor battlecard you generated during your 14-day trial.",
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: "Growth Studio",
      badge: "Replaces $4,500/mo Freelancers",
      description: "For founders and fast-moving marketing teams scaling high-converting social ads.",
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        "5 Connected Social Channels (IG, TikTok, LinkedIn, X, YT)",
        "Unlimited Fold-Aware Creative Canvas Exports (9:16, 1:1, 16:9)",
        "Psychological Hook & Pattern-Interrupt Copy Engine",
        "Live Competitor Radar (Track up to 5 Direct Rivals)",
        "Automated Multi-Channel Scheduling Queue",
        "All Server-Side AI Inference Included (Zero API Bills)",
      ],
      ctaText: "Start 14-Day Risk-Free Trial",
      href: "/login",
      popular: false,
    },
    {
      name: "Scale Agency & Brand",
      badge: "Replaces $12,000/mo Agency Retainer",
      description: "For high-spend brands and agencies dominating multiple verticals simultaneously.",
      monthlyPrice: 399,
      annualPrice: 319,
      features: [
        "Unlimited Connected Social Channels & Brand Workspaces",
        "Real-Time Competitor Ambush Radar & Instant Battlecards",
        "Batch Multi-Ratio Ad Synthesis + Safe-Zone Verification",
        "Custom Brand Voice DNA & Banned-Buzzword Guardrails",
        "Auto-Retry Dispatch Protection & Revenue Attribution",
        "Role-Based Team Permissions & Client Approval Flows",
        "Priority Solutions Engineering Onboarding",
      ],
      ctaText: "Claim Scale Workspace Now",
      href: "/login",
      popular: true,
    },
    {
      name: "Enterprise Custom",
      badge: "Dedicated Infrastructure",
      description: "For global portfolios requiring private cloud isolation and custom SLAs.",
      custom: true,
      features: [
        "Custom Fine-Tuned Brand Models on Historical Winning Ads",
        "Dedicated Multi-Tenant Isolation & Private VPC",
        "Custom Firestore RBAC Governance & Audit Logs",
        "99.99% Contractual Uptime & Dispatch SLA",
        "Dedicated Growth Strategist & Quarterly Creative Audits",
        "Custom Webhook & Bi-Directional CRM Integrations",
      ],
      ctaText: "Book Executive Architecture Call",
      href: "#contact",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400 font-bold mb-2.5">
          Transparent Investment
        </div>
        <h2 className="text-[clamp(2rem,4.2vw,3.35rem)] font-display font-extrabold text-slate-900 dark:text-white tracking-[-0.032em] leading-[1.06]">
          Pay less than{" "}
          <span className="font-editorial italic font-semibold bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] dark:from-blue-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent pr-1">
            one single banner
          </span>{" "}
          from a traditional agency.
        </h2>
        <p className="mt-3.5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-[1.6] max-w-[58ch] mx-auto">
          All AI creative generation, competitor tracking, and multi-network publishing included. Zero surprise usage fees.
        </p>

        {/* Interactive Billing Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-200/80 dark:bg-[#0B0F1E] border border-slate-300/60 dark:border-white/10">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[11px] font-mono font-bold text-indigo-100 uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => {
          const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={idx}
              className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                plan.popular
                  ? "border-indigo-500/70 bg-gradient-to-b from-[#0B0F1E] via-[#10162E] to-[#1A1033] text-white shadow-2xl shadow-indigo-500/20 relative"
                  : "border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] text-slate-900 dark:text-white hover:border-indigo-500/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg">
                  Most Popular · Highest ROAS
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-display font-extrabold tracking-[-0.025em]">
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mt-1.5 leading-[1.58] ${
                      plan.popular ? "text-indigo-100/85" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div
                  className={`border-b pb-5 ${
                    plan.popular ? "border-white/15" : "border-slate-100 dark:border-white/10"
                  }`}
                >
                  {plan.custom ? (
                    <div className="text-4xl font-display font-extrabold tracking-tight">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight tabular-nums">
                        ${price}
                      </span>
                      <span
                        className={`text-sm font-mono ${
                          plan.popular ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        /mo.
                      </span>
                    </div>
                  )}
                  <div
                    className={`text-xs mt-1.5 font-mono tabular-nums ${
                      plan.popular ? "text-indigo-200/75" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {plan.custom
                      ? "Tailored enterprise agreement"
                      : billingCycle === "annual"
                      ? `Billed annually ($${(price! * 12).toLocaleString("en-US")}/yr)`
                      : "Billed monthly · Cancel in 1 click"}
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={`text-xs sm:text-[13px] font-bold ${
                      plan.popular ? "text-white" : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    Everything included:
                  </div>
                  <ul
                    className={`space-y-2.5 text-xs sm:text-[13.5px] leading-snug ${
                      plan.popular ? "text-indigo-100/90" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link href={plan.href}>
                  <Button
                    className={`w-full text-sm font-semibold h-12 rounded-xl cursor-pointer transition-transform hover:scale-[1.01] ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white shadow-xl shadow-indigo-500/30 border-0"
                        : "bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white border border-transparent dark:border-white/15"
                    }`}
                  >
                    {plan.ctaText} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ironclad 14-Day Trial Guarantee Strip */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-fuchsia-50/60 dark:from-[#0B0F1E] dark:via-[#121631] dark:to-[#1B1033] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1D39C4] to-[#A824B4] flex items-center justify-center text-white shrink-0 shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
              The 14-Day &ldquo;2x Creative Velocity&rdquo; Risk-Free Trial Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Launch campaigns with VisionAI during your 14-day trial. If you don&apos;t cut creative production turnaround by at least 50% and outperform your baseline ad CTR, cancel or claim a 100% refund in one click — and keep every creative you exported.
            </p>
          </div>
        </div>
        <Link href="/login" className="shrink-0">
          <Button className="bg-gradient-to-r from-[#1D39C4] via-[#6D28D9] to-[#A824B4] hover:opacity-95 text-white font-bold text-xs h-11 px-6 rounded-xl cursor-pointer border-0 shadow-md">
            Start 14-Day Free Trial →
          </Button>
        </Link>
      </div>

      {/* Buyer Objection Crusher FAQ */}
      <div id="faq" className="mt-20 max-w-3xl mx-auto scroll-mt-24">
        <div className="text-center mb-10">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
            Frequently Asked Questions
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Everything Buyers Ask Before Switching
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B0F1E] overflow-hidden"
              >
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
