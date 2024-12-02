import { Newspaper, User2, UserCog } from "lucide-react";
import { SidebarMainContent } from "./SidebarMainContent";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "User",
      url: "/admin/user",
      icon: User2,
      isActive: true,
      items: [
        {
          title: "All Users",
          url: "/admin/user",
        },
        {
          title: "Add User",
          url: "/admin/user/add",
        },
      ],
    },
    {
      title: "Articles",
      url: "/admin/article",
      icon: Newspaper,
      isActive: true,
      items: [
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
  ],
};

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
                <UserCog className="size-4" />
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
        <SidebarMainContent items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
