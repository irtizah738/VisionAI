
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  Megaphone,
  Bot,
  BarChartBig,
  Settings2, // For Campaign Builder
  Users, // For Customer Segmentation & Social Strategy (can be more specific)
  Share2, // For Social Manager
  FileText, // For Reports
  Search, // General SEO
  Settings, // For user settings dropdown
  MapPin, // Local Marketing
  Scaling, // Conversion Optimization
  SearchCode, // SEO Enhancement / Advanced SEO
  SmilePlus, // Customer Experience
  MessageSquareQuote, // Social Media Guidance
  MailCheck, // Email Marketing
  FolderKanban, // Content Management
  Sparkles, // AI Content Generation
  UserCog, // CRM Integration
  SearchCheck, // SEO Tools
  KanbanSquare, // Project Management
  Store, // E-commerce Analytics
  PencilLine, // Blog Generator
  Lightbulb, // For AI-driven suggestions or strategy
  UsersRound, // For Social Hub / Audience Management
} from "lucide-react";

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
];

export function SidebarNav() {
  const pathname = usePathname();

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
                    isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
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
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
