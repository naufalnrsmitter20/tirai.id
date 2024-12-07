import { PageContainer } from "@/components/layout/PageContainer";
import { ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export default function UseNavbarLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PageContainer className="pt-[5.375rem]">{children}</PageContainer>
      <Footer />
    </>
  );
}
