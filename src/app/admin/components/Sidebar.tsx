import {
  CircleGauge,
  Home,
  MessageCircleMore,
  Newspaper,
  ShoppingCart,
  SquarePen,
  User2,
  Building,
  Receipt,
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
import { Session } from "next-auth";
import { useEffect } from "react";

const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: false,
  },
  {
    title: "User",
    url: "/admin/user",
    icon: User2,
    isActive: false,
  },
  {
    title: "Shop",
    url: "/admin/shop",
    icon: ShoppingCart,
    isActive: false,
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
    isActive: false,
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
    title: "Produk Kustom",
    url: "/admin",
    icon: SquarePen,
    isActive: false,
    children: [
      {
        title: "Request",
        url: "/admin/custom-products",
      },
      {
        title: "Bahan",
        url: "/admin/material",
      },
      {
        title: "Model",
        url: "/admin/model",
      },
    ],
  },
  {
    title: "SEO",
    url: "/admin/seo",
    icon: Building,
    isActive: false,
  },
  {
    title: "Order",
    url: "/admin/order",
    icon: Receipt,
    isActive: true,
  },
];

export function AppSidebar({ session }: { session: Session | null }) {
  useEffect(() => {
    if (session?.user?.role === "SALES")
      SIDEBAR_ITEMS.push({
        title: "Chat",
        url: "/admin/chat",
        icon: MessageCircleMore,
        isActive: false,
      });
  }, []);

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
