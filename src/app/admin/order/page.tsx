import { H1 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { findOrders } from "@/utils/database/order.query";
import { OrderTable } from "./components/OrderTable";
import { Prisma } from "@prisma/client";
import { getServerSession } from "@/lib/next-auth";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ page: number }>;
}) {
  const page = (await searchParams).page ?? 1;
  const session = await getServerSession();

  const statusMap: { [key: string]: Prisma.OrderWhereInput } = {
    ADMIN: { OR: [{ status: "PENDING" }, { status: "PACKING" }] }, // Admin approve n input resi
    SUPERADMIN: {}, // Superadmin can see all orders
    PRODUCTION: { status: "APPROVED" }, // Production can confirm if the status is already approved by admin
    PACKAGING: { status: "PRODUCING" }, // Packaging can confir if the status is already confirmed by production
  };

  const res = await findOrders(
    15,
    page,
    "latest",
    statusMap[session!.user!.role],
  );

  const orders = res.data;

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Order</H1>
      <div className="mb-2 text-black">
        <OrderTable orders={orders} role={session!.user!.role} />
      </div>
      {res.data && res.data.length > 0 && res.meta && (
        <PageSelector meta={res.meta} />
      )}
    </div>
  );
}
