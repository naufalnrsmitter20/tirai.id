import { ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";

export default function UseNavbarLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PageContainer className="pt-[5.375rem]">{children}</PageContainer>
    </>
  );
}
