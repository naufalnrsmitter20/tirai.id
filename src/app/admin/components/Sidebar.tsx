import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Role } from "@prisma/client";
import {
  BookKey,
  Building,
  Calculator,
  CircleGauge,
  Home,
  LogOut,
  MessageCircleMore,
  Newspaper,
  Receipt,
  ShoppingCart,
  SquarePen,
  User2,
  type LucideIcon,
} from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useMemo } from "react";
import MenuItem from "./MenuItem";

export type SidebarItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  requiredRole?: (Role | "ALL")[];
  children?: {
    title: string;
    url: string;
  }[];
};

const BASE_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: false,
    requiredRole: ["ALL"],
  },
  {
    title: "Order",
    url: "/admin/order",
    icon: Receipt,
    isActive: true,
    requiredRole: ["ADMIN", "SALES", "SUPERADMIN", "PRODUCTION", "PACKAGING"],
  },
  {
    title: "Shop",
    url: "/admin/shop",
    icon: ShoppingCart,
    isActive: false,
    requiredRole: ["ADMIN", "SALES", "SUPERADMIN"],
    children: [
      { title: "Category", url: "/admin/shop/category" },
      { title: "Product", url: "/admin/shop/product" },
      { title: "Discount", url: "/admin/shop/discount" },
    ],
  },
  {
    title: "Articles",
    url: "/admin/article",
    icon: Newspaper,
    isActive: false,
    requiredRole: ["SUPERADMIN", "CONTENTWRITER"],
    children: [
      { title: "All Articles", url: "/admin/article" },
      { title: "Add Article", url: "/admin/article/add" },
    ],
  },
  {
    title: "Produk Kustom",
    url: "/admin",
    icon: SquarePen,
    isActive: false,
    requiredRole: ["SALES", "ADMIN", "SUPERADMIN"],
    children: [
      { title: "Request", url: "/admin/custom-products" },
      { title: "Bahan", url: "/admin/material" },
      { title: "Model", url: "/admin/model" },
    ],
  },
  {
    title: "SEO",
    url: "/admin/seo",
    icon: Building,
    isActive: false,
    requiredRole: ["SUPERADMIN", "CONTENTWRITER"],
  },
  {
    title: "Chat",
    url: "/admin/chat",
    icon: MessageCircleMore,
    isActive: false,
    requiredRole: ["SALES"],
  },
  {
    title: "User",
    url: "/admin/user",
    icon: User2,
    isActive: false,
    requiredRole: ["SUPERADMIN"],
  },
  {
    title: "Referal",
    url: "/admin/referal",
    icon: BookKey,
    isActive: false,
    requiredRole: ["SUPERADMIN", "ADMIN"],
  },
  {
    title: "Kalkulator Harga",
    url: "/admin/calculator",
    icon: Calculator,
    isActive: false,
    requiredRole: ["ALL"],
  },
];

export function AdminSidebar({ session }: { session: Session | null }) {
  const sidebarItems = useMemo(() => {
    if (session?.user) {
      const userRole = session?.user?.role;
      return BASE_SIDEBAR_ITEMS.filter(
        (item) =>
          item.requiredRole?.includes("ALL") ||
          item.requiredRole?.includes(userRole),
      );
    } else {
      return [];
    }
  }, [session?.user]);

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
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
            <SidebarMenuItem className="mt-3 text-red-500">
              <SidebarMenuButton onClick={() => signOut()}>
                <LogOut />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
