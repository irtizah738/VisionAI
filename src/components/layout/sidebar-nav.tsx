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
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
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
import { Badge } from "@/components/ui/badge";
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

const navItems = [
  // Command & Analytics
  { href: "/dashboard", icon: LayoutDashboard, label: "Command Center" },
  { href: "/campaigns", icon: Megaphone, label: "Omnichannel Campaigns" },
  { href: "/real-time-analytics", icon: BarChartBig, label: "Real-Time Analytics" },
  { href: "/competitor-intel", icon: Radar, label: "Competitor Intelligence", badge: "NEW" },
  { href: "/reports", icon: FileText, label: "Executive Reports" },

  // Social & Growth Suite
  { type: "separator", label: "Social & Growth Suite" },
  { href: "/social-media-manager", icon: Share2, label: "Social Preview Studio" },
  { href: "/creative-canvas", icon: Palette, label: "AI Creative Canvas", badge: "NEW" },
  { href: "/automation", icon: Workflow, label: "Drip Automation Studio", badge: "NEW" },
  { href: "/social-media-strategy", icon: Lightbulb, label: "Social Strategy & Cadence" },
  { href: "/email-marketing", icon: MailCheck, label: "Email Marketing Studio" },
  { href: "/local-marketing", icon: MapPin, label: "Local & Geo Marketing" },

  // AI & Content Studio
  { type: "separator", label: "AI & Content Studio" },
  { href: "/ai-assistant", icon: Bot, label: "AI Marketing Copilot" },
  { href: "/ai-content-generation", icon: Sparkles, label: "AI Content Generator" },
  { href: "/blog-generator", icon: PencilLine, label: "Blog & Long-Form Studio" },
  { href: "/content-management", icon: FolderKanban, label: "Content Hub (CMS)" },

  // SEO, CRO & Audience Intelligence
  { type: "separator", label: "SEO, CRO & Intelligence" },
  { href: "/seo", icon: Search, label: "Unified SEO Suite" },
  { href: "/customer-segmentation", icon: Users, label: "Audience & CRM Hub" },
  { href: "/conversion-optimization", icon: Scaling, label: "CRO & CX Optimizer" },
  { href: "/ecommerce-analytics", icon: Store, label: "E-Commerce Revenue Lab" },

  // Organization & Account
  { type: "separator", label: "Workspace & Channels" },
  { href: "/project-management", icon: KanbanSquare, label: "Project Kanban Planner" },
  { href: "/settings", icon: SettingsIcon, label: "Settings & OAuth" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter();
  const { user, signInWithGoogle, signOutFirebase, syncWorkspaceToFirestore } =
    useFirebase();
  const { toast } = useToast();
  const { toggleSidebar, state } = useSidebar();

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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-background transition-all">
      <SidebarHeader className="p-3 border-b border-sidebar-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 text-indigo-400 shadow-sm shrink-0">
            <VisionAILogo className="h-5 w-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-sidebar-foreground leading-tight tracking-tight truncate">
                  VisionAI
                </h1>
                <Badge variant="outline" className="text-[9px] py-0 px-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono">
                  v2.5
                </Badge>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-1 no-scrollbar">
        <SidebarMenu>
          {navItems.map((item, index) => {
            if (item.type === "separator") {
              return (
                <React.Fragment key={`separator-${index}`}>
                  {index !== 0 && (
                    <Separator className="my-2 bg-sidebar-border/60" />
                  )}
                  {item.label && !isCollapsed && (
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
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

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-950/40 border border-indigo-400/40"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                  tooltip={{
                    children: item.label,
                    className:
                      "bg-background border shadow-lg rounded-md px-2 py-1 text-xs font-medium",
                  }}
                >
                  <Link href={item.href!} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.icon && (
                        <item.icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive ? "text-white" : "text-sidebar-foreground/70"
                          }`}
                        />
                      )}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border/60">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2.5 w-full p-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-xl border border-sidebar-border/40"
            >
              <Avatar className="h-8 w-8 ring-2 ring-indigo-500/40 shrink-0">
                {avatarSrc ? (
                  <AvatarImage
                    src={avatarSrc}
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-left overflow-hidden flex-1">
                  <p className="text-xs font-bold text-sidebar-foreground leading-tight truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-sidebar-foreground/60 truncate">
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
            className="w-60 bg-slate-900 text-slate-100 border-slate-800 shadow-2xl z-[100] opacity-100 p-2"
          >
            <DropdownMenuLabel className="text-xs font-bold">Workspace Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-sidebar-border" />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="text-xs cursor-pointer focus:bg-sidebar-accent"
            >
              <SettingsIcon className="mr-2 h-3.5 w-3.5 text-indigo-400" />
              Workspace & OAuth Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCloudSync}
              className="text-xs cursor-pointer focus:bg-sidebar-accent"
            >
              <Cloud className="mr-2 h-3.5 w-3.5 text-emerald-400" />
              Sync Firestore Cloud Data
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-sidebar-border" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs focus:bg-sidebar-accent">
                <Sun className="mr-2 h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-400" />
                <Moon className="absolute mr-2 h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
                Theme Mode
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-48 bg-slate-900 text-slate-100 border-slate-800 shadow-2xl z-[110] opacity-100 p-1.5">
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="text-xs cursor-pointer focus:bg-sidebar-accent"
                  >
                    <Sun className="mr-2 h-3.5 w-3.5 text-amber-500" /> Light Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="text-xs cursor-pointer focus:bg-sidebar-accent"
                  >
                    <Moon className="mr-2 h-3.5 w-3.5 text-indigo-400" /> Dark Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="text-xs cursor-pointer focus:bg-sidebar-accent"
                  >
                    System Preference
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator className="bg-sidebar-border" />
            {user ? (
              <DropdownMenuItem
                onClick={signOutFirebase}
                className="text-xs text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleGoogleSignIn}
                className="text-xs text-indigo-400 focus:bg-indigo-500/10 cursor-pointer"
              >
                <LogIn className="mr-2 h-3.5 w-3.5" />
                Sign In with Google
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
