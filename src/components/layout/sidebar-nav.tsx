
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Search,
  FileText,
  MessageCircle,
  Settings,
  Users,
  MapPin,
  Share2,
  Scaling,
  SearchCode,
  SmilePlus,
  MessageSquareQuote,
  BarChartBig, // New Icon
  MailCheck, // New Icon
  UsersRound, // New Icon
  FolderKanban, // New Icon
  Sparkles, // New Icon
  UsersCog, // New Icon
  SearchCheck, // New Icon
  KanbanSquare, // New Icon
  Store, // New Icon
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
  SidebarTrigger,
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
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/seo", icon: Search, label: "SEO Overview" }, // Renamed for clarity
  { href: "/blog-generator", icon: FileText, label: "Blog Generator" },
  { href: "/chat-assistant", icon: MessageCircle, label: "Chat Assistant" },
  { type: "separator", label: "Core AI Capabilities" },
  { href: "/local-marketing", icon: MapPin, label: "Local Marketing" },
  { href: "/social-media-strategy", icon: Share2, label: "Social Strategy" },
  { href: "/conversion-optimization", icon: Scaling, label: "CRO" },
  { href: "/seo-enhancement", icon: SearchCode, label: "SEO Enhancement" },
  { href: "/customer-experience", icon: SmilePlus, label: "Customer Experience" },
  { href: "/social-media-guidance", icon: MessageSquareQuote, label: "Social Guidance" },
  { type: "separator", label: "Platform Features" },
  { href: "/advanced-analytics", icon: BarChartBig, label: "Adv. Analytics" },
  { href: "/email-marketing", icon: MailCheck, label: "Email Marketing" },
  { href: "/social-media-management", icon: UsersRound, label: "Social Mgmt" },
  { href: "/content-management", icon: FolderKanban, label: "Content Mgmt" },
  { href: "/ai-content-generation", icon: Sparkles, label: "AI Content Gen" },
  { href: "/crm-integration", icon: UsersCog, label: "CRM Integration" },
  { href: "/seo-tools", icon: SearchCheck, label: "SEO Tools" },
  { href: "/project-management", icon: KanbanSquare, label: "Project Mgmt" },
  { href: "/ecommerce-analytics", icon: Store, label: "Ecom Analytics" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <VisionAILogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">VisionAI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
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
