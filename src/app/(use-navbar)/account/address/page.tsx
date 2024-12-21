import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { H1 } from "@/components/ui/text";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { History, User } from "lucide-react";
import Link from "next/link";
import { AddressTable } from "./components/AddressTable";

export default async function Address() {
  const session = await getServerSession();
  const addresses = await prisma.shippingAddress.findMany({
    where: { user_id: session?.user?.id },
  });

  return (
    <PageContainer>
      <SectionContainer id="addresses">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex w-full flex-col items-start justify-start">
            <Link
              href={"/account/order-history"}
              className={buttonVariants({
                variant: "link",
              })}
            >
              <History />
              Riwayat Pesanan
            </Link>
            <Link
              href={"/account"}
              className={buttonVariants({
                variant: "link",
              })}
            >
              <User />
              Akun
            </Link>
          </div>
          <H1 className="mb-12 w-full text-black">Buku Alamat Anda</H1>
          <AddressTable addresses={addresses} />
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
