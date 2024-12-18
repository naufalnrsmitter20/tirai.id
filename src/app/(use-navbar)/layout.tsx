import { PageContainer } from "@/components/layout/PageContainer";
import { ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ChatProvider } from "@/components/provider/ChatProvider";
import { getServerSession } from "@/lib/next-auth";

export default async function UseNavbarLayout({
  children,
}: {
  children?: ReactNode;
}) {
  const session = await getServerSession();
  return (
    <>
      <Navbar />
      <PageContainer className="relative pt-[5.375rem]">
        {children}
        {session && session.user && <ChatProvider session={session} />}
      </PageContainer>
      <Footer />
    </>
  );
}
