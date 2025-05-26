
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Megaphone,
  Bot,
  BarChartBig,
  Settings2,
  Users,
  Share2,
  FileText,
  Search,
  Settings as SettingsIcon, 
  MapPin,
  Scaling,
  SearchCode,
  SmilePlus,
  MessageSquareQuote,
  MailCheck,
  FolderKanban,
  Sparkles,
  UserCog,
  SearchCheck,
  KanbanSquare,
  Store,
  PencilLine,
  Lightbulb,
  UsersRound,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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

const navItems = [
  // Main Navigation
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/real-time-analytics", icon: BarChartBig, label: "Analytics" },
  { href: "/reports", icon: FileText, label: "Reports" },

  // AI & Content
  { type: "separator", label: "AI & Content" },
  { href: "/ai-assistant", icon: Bot, label: "AI Assistant" },
  { href: "/ai-content-generation", icon: Sparkles, label: "AI Content Gen" },
  { href: "/blog-generator", icon: PencilLine, label: "Blog Generator" },
  { href: "/content-management", icon: FolderKanban, label: "Content Hub" },

  // Marketing Tools
  { type: "separator", label: "Marketing Tools" },
  { href: "/campaign-builder", icon: Settings2, label: "Campaign Builder" },
  { href: "/email-marketing", icon: MailCheck, label: "Email Marketing" },
  { href: "/local-marketing", icon: MapPin, label: "Local Marketing" },

  // Social Suite
  { type: "separator", label: "Social Suite" },
  { href: "/social-media-management", icon: UsersRound, label: "Social Hub" },
  { href: "/social-media-manager", icon: Share2, label: "Social Manager" },
  { href: "/social-media-strategy", icon: Lightbulb, label: "Social Strategy" },
  { href: "/social-media-guidance", icon: MessageSquareQuote, label: "Social Guidance" },
  
  // Optimization & Insights
  { type: "separator", label: "Optimization & Insights" },
  { href: "/customer-segmentation", icon: Users, label: "Segmentation" },
  { href: "/conversion-optimization", icon: Scaling, label: "CRO Tools" },
  { href: "/customer-experience", icon: SmilePlus, label: "CX Optimization" },
  { href: "/crm-integration", icon: UserCog, label: "CRM Integration" },
  { href: "/ecommerce-analytics", icon: Store, label: "E-commerce Insights" },

  // SEO Suite
  { type: "separator", label: "SEO Suite" },
  { href: "/seo", icon: Search, label: "SEO Dashboard" },
  { href: "/seo-tools", icon: SearchCheck, label: "SEO Toolkit" },
  { href: "/seo-enhancement", icon: SearchCode, label: "Advanced SEO" },

  // Organization
  { type: "separator", label: "Organization" },
  { href: "/project-management", icon: KanbanSquare, label: "Project Planner" },

  // Account
  { type: "separator", label: "Account" },
  { href: "/settings", icon: SettingsIcon, label: "Settings" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter(); 

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <VisionAILogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">VisionAI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 no-scrollbar">
        <SidebarMenu>
          {navItems.map((item, index) => {
            if (item.type === "separator") {
              return (
                <React.Fragment key={`separator-${index}`}>
                  {index !== 0 && <Separator className="my-2 bg-sidebar-border" />}
                  {item.label && (
                     <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                       {item.label}
                     </div>
                  )}
                </React.Fragment>
              );
            }
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/')} 
                    tooltip={{ children: item.label, className:"bg-background border shadow-lg rounded-md px-2 py-1 text-xs"}}
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>VA</AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-sidebar-foreground/70">admin@vision.ai</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Users className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/login')}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
