"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dark flex h-screen w-full overflow-hidden bg-slate-50">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="m-2" />
          <div
            id="main-content"
            className="relative mt-[90px] min-h-full w-full overflow-y-auto py-4 lg:mt-0"
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
