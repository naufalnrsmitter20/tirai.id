import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reset kata sandi anda",
};

export default function ResetPasswordLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return <>{children}</>;
}
