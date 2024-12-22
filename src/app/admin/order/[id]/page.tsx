import { buttonVariants } from "@/components/ui/button";
import { Body2, Body3, H2, H3, H5 } from "@/components/ui/text";
import { formatDate, formatRupiah } from "@/lib/utils";
import { findOrderById } from "@/utils/database/order.query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AWBForm } from "./components/AWBForm";
import { ConfirmButton } from "./components/ConfirmButton";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await findOrderById(id);

  if (!order) return notFound();

  return (
    <div className="flex w-full flex-col gap-2 text-black">
      <div className="flex w-full justify-center">
        <div className="flex w-[35vw] flex-col gap-1 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
          <H2 className="py-0">Detail</H2>
          <div className="flex w-full items-center justify-between">
            <Body2>Order ID</Body2>
            <Body3>{order.id}</Body3>
          </div>
          {order.invoice_link && (
            <div className="flex w-full items-center justify-between">
              <Body2>Invoice</Body2>
              <Link
                href={order.invoice_link}
                className={buttonVariants({ variant: "link" })}
              >
                {order.payment?.transaction_id}
              </Link>
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <Body2>Order Date</Body2>
            <Body3>{formatDate(order.created_at)}</Body3>
          </div>
          <div className="flex w-full items-center justify-between">
            <Body2>Status Order</Body2>
            <Body3>{order.status}</Body3>
          </div>
          {order.shipment && (
            <div className="flex w-full items-center justify-between">
              <Body2>Status Pengiriman</Body2>
              <Body3>{order.shipment.status}</Body3>
            </div>
          )}
        </div>
      </div>
      {order.status === "PENDING" && order.payment?.status === "COMPLETED" && (
        <div className="flex w-full justify-center">
          <ConfirmButton order={order} />
        </div>
      )}
      <div className="flex w-full justify-center">
        <div className="flex w-[35vw] flex-col gap-1 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
          <H2 className="py-0">Barang</H2>
          <div className="flex w-full flex-col gap-2">
            {order.items.map((i) => (
              <figure
                className="flex w-full gap-3 rounded-xl bg-neutral-50 px-4 py-2"
                key={i.id}
              >
                <Image
                  alt={i.id}
                  src={i.product?.photos[0]!}
                  width={200}
                  height={200}
                  unoptimized
                  className="aspect-square w-[125px] rounded-lg object-cover"
                />
                <div className="flex w-full items-center justify-between">
                  <div>
                    <H3>{i.product?.name}</H3>
                    {i.variant && <H5>{i.variant.name}</H5>}
                  </div>
                  <div>
                    <Body3>
                      {i.quantity} x{" "}
                      {formatRupiah(
                        i.variant ? i.variant.price! : i.product?.price!,
                      )}
                    </Body3>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <AWBForm order={order} />
    </div>
  );
}
