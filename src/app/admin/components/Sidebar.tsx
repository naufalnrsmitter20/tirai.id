import { Newspaper, UserCog } from "lucide-react";
import { NavMain } from "./nav-main";

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
      title: "Articles",
      url: "/admin/articles",
      icon: Newspaper,
      isActive: true,
      items: [
        {
          title: "All Articles",
          url: "/admin/articles",
        },
        {
          title: "Add Article",
          url: "/admin/articles/add",
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <UserCog className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
