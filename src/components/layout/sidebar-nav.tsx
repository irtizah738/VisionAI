
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  Megaphone, // For Campaigns List
  Bot, // For AI Assistant
  BarChartBig, // For Real-Time Analytics / Reports
  Settings2, // For Campaign Builder (general tool icon)
  Users, // For Customer Segmentation
  Share2, // For Social Media Manager
  FileText, // For Reports
  Search, // Fallback for Analytics (if needed, or use BarChartBig)
  Settings, // For user settings dropdown
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

// Updated navItems based on the mockup's implied structure
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/campaigns", icon: Megaphone, label: "Campaigns" }, // Page to list campaigns
  { href: "/real-time-analytics", icon: BarChartBig, label: "Analytics" }, // Mockup: Real-Time Analytics
  { href: "/reports", icon: FileText, label: "Reports" }, // As per Dashboard mockup sidebar
  { type: "separator", label: "Tools" },
  { href: "/ai-assistant", icon: Bot, label: "AI Assistant" },
  { href: "/campaign-builder", icon: Settings2, label: "Campaign Builder" },
  { href: "/customer-segmentation", icon: Users, label: "Segmentation" },
  { href: "/social-media-manager", icon: Share2, label: "Social Manager" },
  // Keeping some existing useful pages, can be pruned later if not needed
  { type: "separator", label: "Other Features" },
  { href: "/email-marketing", icon: Megaphone, label: "Email Marketing" },
  { href: "/seo-tools", icon: Search, label: "SEO Tools" },
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
                  {index !== 0 && <Separator className="my-2" />}
                  {item.label && (
                     <div className="px-3 py-2 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
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
      <SidebarFooter className="p-2 border-t">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>VA</AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@vision.ai</p>
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
