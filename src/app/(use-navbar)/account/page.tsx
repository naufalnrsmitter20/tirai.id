import prisma from "@/lib/prisma";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { H1 } from "@/components/ui/text";
import { EditAccountForm } from "./components/EditAccountForm";
import { getServerSession } from "@/lib/next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { History, MapPinHouse } from "lucide-react";

export default async function Account() {
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  if (!user) return notFound();

  return (
    <PageContainer>
      <SectionContainer id="account">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex w-full flex-col items-start justify-start">
            <Link
              href={"/account/order-history"}
              className={buttonVariants({
                variant: "link",
                className: "px-0",
              })}
            >
              <History />
              Riwayat Pesanan
            </Link>
            <Link
              href={"/account/address"}
              className={buttonVariants({
                variant: "link",
                className: "px-0",
              })}
            >
              <MapPinHouse />
              Alamat
            </Link>
          </div>
          <H1 className="mb-12 w-full text-black">Pengaturan Akun Anda</H1>
          <EditAccountForm
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
            }}
          />
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
