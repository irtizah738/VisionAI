"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, navItems } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { VisionAILogo } from "@/components/icons";
import { SessionProvider } from "next-auth/react";
import { FirebaseProvider } from "@/components/firebase/firebase-provider";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { useAccessibility } from "@/hooks/use-accessibility";
import { Announcer } from "@/components/a11y/announcer";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, ArrowRight } from "lucide-react";

const TOP_NAV_LINKS = [
  { href: "/dashboard", label: "Command Center" },
  { href: "/social-media-manager", label: "Social Studio" },
  { href: "/creative-canvas", label: "Creative Canvas" },
  { href: "/competitor-intel", label: "Competitor Radar" },
  { href: "/ai-assistant", label: "AI Copilot" },
];

function AppHeaderBar() {
  const { ariaLabels } = useAccessibility();
  const pathname = usePathname();
  const router = useRouter();

  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigableItems = navItems.filter((item) => item.href && item.label);
  const activeNavItem = navigableItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href!))
  );
  const currentCategory = activeNavItem?.category || "Workspace";
  const currentBreadcrumb = activeNavItem?.label || "Command Center";

  const filteredCommands = navigableItems.filter((item) => {
    const q = commandQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.label!.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <header
        className="sticky top-0 z-20 flex h-14 items-center justify-between gap-8 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 md:px-6"
        role="banner"
      >
        {/* Zone 1: Sidebar Trigger & Contextual Breadcrumb Trail */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <SidebarTrigger
            aria-label={ariaLabels.menuButton}
            className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 shrink-0"
          />
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-2 text-xs whitespace-nowrap"
          >
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {currentCategory}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              /
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">
              {currentBreadcrumb}
            </span>
          </nav>
          <div className="flex sm:hidden items-center gap-2">
            <VisionAILogo
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              aria-hidden="true"
            />
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
              VisionAI
            </span>
          </div>
        </div>

        {/* Zone 2: Clean Single-Line Studio Navigation Links */}
        <nav
          aria-label="Primary Studios"
          className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          {TOP_NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold underline decoration-indigo-600 dark:decoration-indigo-400 decoration-2 underline-offset-[18px]"
                    : "hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Quick Command & Module Search (⌘K) */}
        <div className="flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex items-center justify-between gap-3 w-44 sm:w-64 px-3 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">Search workspace...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      {/* Interactive Command Palette Modal (⌘K) */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
          <DialogHeader className="p-4 pb-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <DialogTitle className="text-sm font-semibold">
              Workspace Command Launcher
            </DialogTitle>
            <DialogDescription className="text-xs">
              Search and navigate directly to any marketing studio or analytics module.
            </DialogDescription>
            <div className="relative pt-2">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 mt-1" />
              <Input
                autoFocus
                placeholder="Type a module name (e.g. Creative Canvas, SEO, Campaigns)..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching modules found for &ldquo;{commandQuery}&rdquo;.
              </div>
            ) : (
              filteredCommands.map((item) => {
                const Icon = item.icon;
                const isCurrent = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setCommandOpen(false);
                      setCommandQuery("");
                      router.push(item.href!);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {Icon && (
                        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.label}
                        </div>
                        {item.category && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.category}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-400">
                      {isCurrent && (
                        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                          Current
                        </span>
                      )}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <FirebaseProvider>
        <SidebarProvider>
          <SkipToContent />
          <SidebarNav />
          <SidebarInset className="relative bg-background min-h-screen">
            <AppHeaderBar />

            <main
              id="main-content"
              className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto max-w-7xl mx-auto w-full"
              tabIndex={-1}
              role="main"
            >
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Announcer message="" />
      </FirebaseProvider>
    </SessionProvider>
  );
}
