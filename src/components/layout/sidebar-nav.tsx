"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTheme } from "@/components/theme-provider";
import {
  LayoutDashboard,
  Megaphone,
  Bot,
  BarChartBig,
  Users,
  Share2,
  FileText,
  Search,
  Settings as SettingsIcon,
  MapPin,
  Scaling,
  MailCheck,
  FolderKanban,
  Sparkles,
  KanbanSquare,
  Store,
  PencilLine,
  Lightbulb,
  Palette,
  Workflow,
  Radar,
  Sun,
  Moon,
  LogOut,
  Cloud,
  LogIn,
} from "lucide-react";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { useToast } from "@/hooks/use-toast";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { VisionAILogo } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export const navItems = [
  // Command & Analytics
  { href: "/dashboard", icon: LayoutDashboard, label: "Command Center", category: "Command & Analytics", accent: "indigo" },
  { href: "/campaigns", icon: Megaphone, label: "Omnichannel Campaigns", category: "Command & Analytics", accent: "indigo" },
  { href: "/real-time-analytics", icon: BarChartBig, label: "Real-Time Analytics", category: "Command & Analytics", accent: "cyan" },
  { href: "/competitor-intel", icon: Radar, label: "Competitor Intelligence", category: "Command & Analytics", accent: "rose" },
  { href: "/reports", icon: FileText, label: "Executive Reports", category: "Command & Analytics", accent: "indigo" },

  // Social & Growth Suite
  { type: "separator", label: "Social & Growth Suite" },
  { href: "/social-media-manager", icon: Share2, label: "Social Preview Studio", category: "Social & Growth Suite", accent: "emerald" },
  { href: "/creative-canvas", icon: Palette, label: "AI Creative Canvas", category: "Social & Growth Suite", accent: "violet" },
  { href: "/automation", icon: Workflow, label: "Drip Automation Studio", category: "Social & Growth Suite", accent: "amber" },
  { href: "/social-media-strategy", icon: Lightbulb, label: "Social Strategy & Cadence", category: "Social & Growth Suite", accent: "emerald" },
  { href: "/email-marketing", icon: MailCheck, label: "Email Marketing Studio", category: "Social & Growth Suite", accent: "cyan" },
  { href: "/local-marketing", icon: MapPin, label: "Local & Geo Marketing", category: "Social & Growth Suite", accent: "emerald" },

  // AI & Content Studio
  { type: "separator", label: "AI & Content Studio" },
  { href: "/ai-assistant", icon: Bot, label: "AI Marketing Copilot", category: "AI & Content Studio", accent: "violet" },
  { href: "/ai-content-generation", icon: Sparkles, label: "AI Content Generator", category: "AI & Content Studio", accent: "violet" },
  { href: "/blog-generator", icon: PencilLine, label: "Blog & Long-Form Studio", category: "AI & Content Studio", accent: "indigo" },
  { href: "/content-management", icon: FolderKanban, label: "Content Hub (CMS)", category: "AI & Content Studio", accent: "amber" },

  // SEO, CRO & Audience Intelligence
  { type: "separator", label: "SEO, CRO & Intelligence" },
  { href: "/seo", icon: Search, label: "Unified SEO Suite", category: "SEO, CRO & Intelligence", accent: "cyan" },
  { href: "/customer-segmentation", icon: Users, label: "Audience & CRM Hub", category: "SEO, CRO & Intelligence", accent: "indigo" },
  { href: "/conversion-optimization", icon: Scaling, label: "CRO & CX Optimizer", category: "SEO, CRO & Intelligence", accent: "emerald" },
  { href: "/ecommerce-analytics", icon: Store, label: "E-Commerce Revenue Lab", category: "SEO, CRO & Intelligence", accent: "amber" },

  // Organization & Account
  { type: "separator", label: "Workspace & Channels" },
  { href: "/project-management", icon: KanbanSquare, label: "Project Kanban Planner", category: "Workspace & Channels", accent: "indigo" },
  { href: "/settings", icon: SettingsIcon, label: "Settings & OAuth", category: "Workspace & Channels", accent: "cyan" },
];

const ICON_ACCENT_CLASSES: Record<string, string> = {
  indigo: "text-indigo-600 dark:text-indigo-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
  cyan: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

export function SidebarNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, signInWithGoogle, signOutFirebase, syncWorkspaceToFirestore } =
    useFirebase();
  const { toast } = useToast();
  const { state } = useSidebar();

  const handleGoogleSignIn = async () => {
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        toast({
          title: "Signed in with Google",
          description: `Connected as ${signedInUser.email}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Google Sign-In failed",
        description:
          error?.message || "Could not complete Google authentication.",
        variant: "destructive",
      });
    }
  };

  const handleCloudSync = async () => {
    try {
      const count = await syncWorkspaceToFirestore();
      toast({
        title: "Synced to Firebase Firestore",
        description: `Backed up ${count} workspace records to Firestore.`,
      });
    } catch (error: any) {
      toast({
        title: "Cloud Sync Notice",
        description:
          error?.message || "Sign in with Google in Settings to sync.",
        variant: "destructive",
      });
    }
  };

  const displayName = user?.displayName || "Alex Morgan";
  const displayEmail = user?.email || "admin@vision.ai";
  const avatarSrc = user?.photoURL || "";
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-950 transition-all"
    >
      <SidebarHeader className="h-14 px-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-row items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center shrink-0">
            <VisionAILogo className="h-7 w-7" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap truncate">
              VisionAI
            </span>
          )}
        </Link>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Switch Light / Dark Mode"
            aria-label="Switch Light / Dark Mode"
            className="h-7 w-7 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
          </button>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2.5 space-y-0.5 no-scrollbar">
        <SidebarMenu>
          {navItems.map((item, index) => {
            if (item.type === "separator") {
              return (
                <React.Fragment key={`separator-${index}`}>
                  {index !== 0 && (
                    <Separator className="my-2.5 bg-slate-200/70 dark:bg-slate-800/70" />
                  )}
                  {item.label && !isCollapsed && (
                    <div className="px-2.5 py-1 text-[11px] font-semibold tracking-tight text-slate-400 dark:text-slate-500">
                      {item.label}
                    </div>
                  )}
                </React.Fragment>
              );
            }

            const isSeoActive =
              item.href === "/seo" &&
              (pathname === "/seo" ||
                pathname.startsWith("/seo-tools") ||
                pathname.startsWith("/seo-enhancement"));
            const isSocialActive =
              item.href === "/social-media-manager" &&
              (pathname.startsWith("/social-media-manager") ||
                pathname.startsWith("/social-media-management") ||
                pathname.startsWith("/social-media-generator"));
            const isCrmActive =
              item.href === "/customer-segmentation" &&
              (pathname.startsWith("/customer-segmentation") ||
                pathname.startsWith("/crm-integration"));
            const isCroActive =
              item.href === "/conversion-optimization" &&
              (pathname.startsWith("/conversion-optimization") ||
                pathname.startsWith("/customer-experience"));

            const isActive =
              pathname === item.href ||
              isSeoActive ||
              isSocialActive ||
              isCrmActive ||
              isCroActive ||
              (pathname.startsWith(item.href!) &&
                item.href !== "/dashboard" &&
                item.href !== "/");

            const iconColorClass = isActive
              ? "text-white"
              : ICON_ACCENT_CLASSES[item.accent || "indigo"] ||
                "text-slate-500 dark:text-slate-400";

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  tooltip={{
                    children: item.label,
                    className:
                      "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-lg rounded-md px-2.5 py-1 text-xs font-medium",
                  }}
                >
                  <Link href={item.href!} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.icon && (
                        <item.icon
                          className={`h-4 w-4 shrink-0 transition-colors ${iconColorClass}`}
                        />
                      )}
                      {!isCollapsed && (
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2.5 w-full p-2 h-auto text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 cursor-pointer"
            >
              <Avatar className="h-7 w-7 shrink-0">
                {avatarSrc ? (
                  <AvatarImage
                    src={avatarSrc}
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="bg-indigo-600 text-white text-[11px] font-bold">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-left overflow-hidden flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {displayEmail}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-60 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 shadow-2xl z-[100] opacity-100 p-2"
          >
            <DropdownMenuLabel className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Workspace Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="text-xs cursor-pointer"
            >
              <SettingsIcon className="mr-2 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Workspace &amp; OAuth Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCloudSync}
              className="text-xs cursor-pointer"
            >
              <Cloud className="mr-2 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Sync Firestore Cloud Data
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs">
                <Sun className="mr-2 h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                <Moon className="absolute mr-2 h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
                Theme Mode
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-48 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 shadow-2xl z-[110] opacity-100 p-1.5">
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="text-xs cursor-pointer"
                  >
                    <Sun className="mr-2 h-3.5 w-3.5 text-amber-500" /> Light Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="text-xs cursor-pointer"
                  >
                    <Moon className="mr-2 h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" /> Dark Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="text-xs cursor-pointer"
                  >
                    System Preference
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            {!user && (
              <DropdownMenuItem
                onClick={handleGoogleSignIn}
                className="text-xs text-indigo-600 dark:text-indigo-400 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 cursor-pointer"
              >
                <LogIn className="mr-2 h-3.5 w-3.5" />
                Connect Google Cloud Sync
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={async () => {
                if (typeof window !== "undefined") {
                  window.localStorage.removeItem("visionai_workspace_authenticated");
                  window.localStorage.removeItem("visionai_workspace_user_email");
                  document.cookie = "visionai_auth=; path=/; max-age=0; SameSite=Lax";
                }
                if (user) {
                  await signOutFirebase();
                }
                router.push("/login");
              }}
              className="text-xs text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign Out of Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
