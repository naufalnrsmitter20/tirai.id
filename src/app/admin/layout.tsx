import { Metadata } from "next";
import AdminLayout from "./components/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
