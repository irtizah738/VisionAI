"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { VisionAILogo } from "@/components/icons";
import { SessionProvider } from "next-auth/react";
import { LanguageSelector } from "@/components/language-selector";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";
import { useAccessibility } from "@/hooks/use-accessibility";
import { Announcer } from "@/components/a11y/announcer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ariaLabels } = useAccessibility();

  return (
    <SessionProvider>
      <SidebarProvider>
        <SkipToContent />
        <SidebarNav />
        <SidebarInset>
          <header 
            className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 md:hidden"
            role="banner"
          >
            <SidebarTrigger aria-label={ariaLabels.menuButton} />
            <div className="flex items-center gap-2">
              <VisionAILogo className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="font-semibold">VisionAI</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <KeyboardShortcutsHelp />
              <LanguageSelector />
            </div>
          </header>
          <main 
            id="main-content" 
            className="flex-1 p-4 md:p-8 overflow-auto"
            tabIndex={-1}
            role="main"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Announcer message="" />
    </SessionProvider>
  );
}
