"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { VisionAILogo } from "@/components/icons";
import { SessionProvider } from "next-auth/react";
import { FirebaseProvider, useFirebase } from "@/components/firebase/firebase-provider";
import { LanguageSelector } from "@/components/language-selector";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";
import { useAccessibility } from "@/hooks/use-accessibility";
import { Announcer } from "@/components/a11y/announcer";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

function AppHeaderBar() {
  const { ariaLabels } = useAccessibility();
  const { user } = useFirebase();

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-4 md:px-6 backdrop-blur-md"
      role="banner"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger aria-label={ariaLabels.menuButton} className="h-8 w-8 text-muted-foreground hover:text-foreground" />
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="text-foreground font-bold">Dashboard</span>
          <span className="text-muted-foreground/40">/</span>
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-0.5 font-medium">
            {user ? "Cloud Synced" : "Workspace Ready"}
          </Badge>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <VisionAILogo className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-bold text-sm">VisionAI</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/50 border border-border/40 text-xs text-muted-foreground w-60">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1 truncate">Search tools or commands...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border/60 text-[10px] font-mono">⌘K</kbd>
        </div>

        <div className="flex items-center gap-2">
          <KeyboardShortcutsHelp />
          <LanguageSelector />
        </div>
      </div>
    </header>
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
