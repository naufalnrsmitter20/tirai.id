import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "Verifikasi email anda",
};

export default function ConfirmEmailLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
