import { buttonVariants } from "@/components/ui/button";
import { H1 } from "@/components/ui/text";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { History, MapPinHouse } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditAccountForm } from "./components/EditAccountForm";

export default async function Account() {
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  if (!user) return notFound();

  return (
    <>
      <div className="mb-6 flex w-full flex-col items-start justify-start">
        {session?.user?.role !== "AFFILIATE" && (
          <>
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
          </>
        )}
        {session?.user?.role === "AFFILIATE" && (
          <Link
            href={"/account/affiliate-history"}
            className={buttonVariants({
              variant: "link",
              className: "px-0",
            })}
          >
            <History />
            Riwayat Refferal
          </Link>
        )}
      </div>
      <H1 className="mb-12 w-full text-black">Pengaturan Akun Anda</H1>
      <EditAccountForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
        }}
      />
    </>
  );
}
