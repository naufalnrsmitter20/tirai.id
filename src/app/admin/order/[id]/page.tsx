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
}: Readonly<{
  params: { id: string };
}>) {
  const order = await findOrderById(params.id);

  if (!order) return notFound();

  return (
    <div className="flex w-full flex-col gap-4 text-black">
      <div className="flex w-full justify-center">
        <div className="w-[35vw] rounded-lg bg-white px-6 py-4 shadow-md">
          <H2 className="mb-4 border-b pb-2">Detail Pesanan</H2>

          <div className="space-y-3">
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
              <Body2>Tanggal Pesanan</Body2>
              <Body3>{formatDate(order.created_at)}</Body3>
            </div>

            <div className="flex w-full items-center justify-between">
              <Body2>Status Pesanan</Body2>
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
      </div>

      {order.status === "PENDING" && order.payment?.status === "COMPLETED" && (
        <div className="flex w-full justify-center">
          <ConfirmButton order={order} />
        </div>
      )}

      <div className="flex w-full justify-center">
        <div className="w-[35vw] rounded-lg bg-white px-6 py-4 shadow-md">
          <H2 className="mb-4 border-b pb-2">Barang Pesanan</H2>

          <div className="flex w-full flex-col gap-4">
            {order.items.map((i) => (
              <figure
                className="flex w-full gap-4 rounded-xl bg-neutral-50 px-4 py-3"
                key={i.id}
              >
                {i.custom_request ? (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between">
                      <H3>Custom Request</H3>
                      <Body3 className="text-right">
                        {formatRupiah(i.custom_request.price)}
                      </Body3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Body2 className="text-gray-600">Bahan</Body2>
                        <Body3>{i.custom_request.material}</Body3>
                      </div>

                      <div>
                        <Body2 className="text-gray-600">Model</Body2>
                        <Body3>{i.custom_request.model}</Body3>
                      </div>

                      <div>
                        <Body2 className="text-gray-600">Warna</Body2>
                        <Body3>{i.custom_request.color}</Body3>
                      </div>

                      <div>
                        <Body2 className="text-gray-600">Ukuran</Body2>
                        <Body3>
                          {i.custom_request.width} x {i.custom_request.height}
                        </Body3>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      alt={i.product?.name || "Product Image"}
                      src={i.product?.photos[0] || "/placeholder.png"}
                      width={125}
                      height={125}
                      unoptimized
                      className="aspect-square w-[125px] rounded-lg object-cover"
                    />
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <H3>{i.product?.name}</H3>
                        {i.variant && (
                          <H5 className="text-gray-500">{i.variant.name}</H5>
                        )}
                      </div>
                      <div className="text-right">
                        <Body3>
                          {i.quantity} x{" "}
                          {formatRupiah(
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            i.variant ? i.variant.price! : i.product?.price!,
                          )}
                        </Body3>
                      </div>
                    </div>
                  </>
                )}
              </figure>
            ))}
          </div>
        </div>
      </div>

      <AWBForm order={order} />
    </div>
  );
}
