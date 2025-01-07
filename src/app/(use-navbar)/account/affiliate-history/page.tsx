import { buttonVariants } from "@/components/ui/button";
import { Body3, H1 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { getServerSession } from "@/lib/next-auth";
import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MapPinHouse, User } from "lucide-react";
import Link from "next/link";
import { AffiliateTable } from "./components/AffiliateTable";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

const paginate = paginator({ perPage: 10 });

export default async function AffiliateHistory({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: paramPage } = await searchParams;
  let page = paramPage ? Number(paramPage) : 1;
  if (page < 0) page = 1;

  const session = await getServerSession();

  const paginatedAffiliateOrders = await paginate<
    Prisma.OrderGetPayload<{
      include: {
        payment: true;
        referal: true;
      };
    }>,
    Prisma.OrderFindManyArgs
  >(
    prisma.order,
    { page },
    {
      where: {
        referal: {
          user_id: session?.user?.id,
        },
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        payment: true,
        referal: true,
      },
    },
  );

  const allFee = await prisma.order.findMany({
    where: {
      referal: {
        user_id: session?.user?.id,
      },
    },
    select: {
      total_price: true,
      referal: { select: { fee_in_percent: true } },
    },
  });

  const { totalFee, totalBrute } = allFee.reduce(
    (sum, i) => {
      const feeCommission =
        (i.total_price * (i.referal?.fee_in_percent ?? 0)) / 100;
      sum.totalFee += feeCommission;
      sum.totalBrute += i.total_price;
      return sum;
    },
    { totalFee: 0, totalBrute: 0 },
  );

  return (
    <>
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
      <H1 className="mb-4 w-full text-black">Daftar Order Referral</H1>
      <Body3 className="mb-12 w-full text-neutral-500">
        Tekan untuk melihat detail dari setiap pesanan
      </Body3>
      <div className="mb-12 flex w-full flex-col gap-3">
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <span className="text-sm text-slate-500">Total Omset</span>
              <Body3 className="text-lg font-semibold">
                {formatRupiah(totalBrute)}
              </Body3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <span className="text-sm text-slate-500">Total Fee</span>
              <Body3 className="text-lg font-semibold">
                {formatRupiah(totalFee)}
              </Body3>
            </div>
          </CardContent>
        </Card>
      </div>
      <AffiliateTable orders={paginatedAffiliateOrders.data} />
      <PageSelector meta={paginatedAffiliateOrders.meta} />
    </>
  );
}
