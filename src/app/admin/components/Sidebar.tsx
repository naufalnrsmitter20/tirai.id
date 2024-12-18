import {
  CircleGauge,
  Home,
  MessageCircleMore,
  Newspaper,
  ShoppingCart,
  User2,
} from "lucide-react";
import { SidebarMainContent } from "./SidebarMainContent";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: true,
  },
  {
    title: "User",
    url: "/admin/user",
    icon: User2,
    isActive: true,
  },
  {
    title: "Shop",
    url: "/admin/shop",
    icon: ShoppingCart,
    isActive: true,
    children: [
      {
        title: "Category",
        url: "/admin/shop/category",
      },
      {
        title: "Product",
        url: "/admin/shop/product",
      },
    ],
  },
  {
    title: "Articles",
    url: "/admin/article",
    icon: Newspaper,
    isActive: true,
    children: [
      {
        title: "All Articles",
        url: "/admin/article",
      },
      {
        title: "Add Article",
        url: "/admin/article/add",
      },
    ],
  },
  {
    title: "Chat",
    url: "/admin/chat",
    icon: MessageCircleMore,
    isActive: true,
    children: [
      {
        title: "Chats",
        url: "/admin/chat",
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <CircleGauge className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Panel Admin Tirai.id
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainContent items={SIDEBAR_ITEMS} />
      </SidebarContent>
    </Sidebar>
  );
}
