"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();

  return (
    <main className="flex h-screen w-full overflow-hidden bg-white">
      <SidebarProvider>
        <AppSidebar session={session.data} />
        <SidebarInset>
          <SidebarTrigger className="m-2" />
          <div
            id="main-content"
            className="relative mt-[12px] min-h-full w-full overflow-y-auto py-4 sm:mt-[90px] lg:mt-0"
          >
            <main className="pb-16">
              <div className="min-h-fit overflow-y-auto px-4 pt-4">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
