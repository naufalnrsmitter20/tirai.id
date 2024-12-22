import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/next-auth";
import { paginator } from "@/lib/paginator";
import { Prisma } from "@prisma/client";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPinHouse, User } from "lucide-react";
import { Body3, H1 } from "@/components/ui/text";
import { OrderTable } from "./components/OrderTable";
import { PageSelector } from "@/components/widget/PageSelector";

const paginate = paginator({ perPage: 10 });

export default async function OrderHistory({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: paramPage } = await searchParams;
  let page = paramPage ? Number(paramPage) : 1;
  if (page < 0) page = 1;

  const session = await getServerSession();

  const paginatedOrders = await paginate<
    Prisma.OrderGetPayload<{
      include: {
        payment: true;
        shipment: true;
        items: {
          include: {
            product: true;
            variant: true;
          };
        };
      };
    }>,
    Prisma.OrderFindManyArgs
  >(
    prisma.order,
    { page },
    {
      where: {
        user_id: session?.user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        payment: true,
        shipment: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    },
  );

  return (
    <PageContainer>
      <SectionContainer id="orders">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex w-full flex-col items-start justify-start">
            <Link
              href={"/account/address"}
              className={buttonVariants({
                variant: "link",
              })}
            >
              <MapPinHouse />
              Alamat
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
          <H1 className="mb-2 w-full text-black">Riwayat Pesanan Anda</H1>
          <Body3 className="mb-12 w-full text-neutral-500">
            Tekan untuk melihat detail dari setiap pesanan
          </Body3>
          <OrderTable orders={paginatedOrders.data} />
          <PageSelector meta={paginatedOrders.meta} />
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
