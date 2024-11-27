import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Verifikasi email anda",
};

export default function ConfirmEmailLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return <>{children}</>;
}
