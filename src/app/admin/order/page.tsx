import { H1 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { findOrders } from "@/utils/database/order.query";
import { OrderTable } from "./components/OrderTable";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ page: number }>;
}) {
  const page = (await searchParams).page ?? 1;
  const res = await findOrders(15, page, "latest");

  const orders = res.data;

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Order</H1>
      <div className="mb-2 text-black">
        <OrderTable orders={orders} />
      </div>
      {res.data && res.data.length > 0 && res.meta && (
        <PageSelector meta={res.meta} />
      )}
    </div>
  );
}
