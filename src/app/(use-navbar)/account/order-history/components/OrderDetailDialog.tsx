"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Body2, Body3, H2, H3, H5 } from "@/components/ui/text";
import { formatDate, formatRupiah } from "@/lib/utils";
import { DialogBaseProps } from "@/types/dialog";
import { OrderWithPayment } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ConfirmFinishButton } from "./ConfirmFinishButton";

export const OrderDetailDialog: FC<
  DialogBaseProps & { order: OrderWithPayment }
> = ({ open, setIsOpen, order }) => {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-2 text-black">
          <div className="flex w-full justify-center">
            <div className="flex w-[90%] flex-col gap-1 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
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
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-[90%] flex-col gap-3 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
              <H2 className="py-0">Pengiriman</H2>
              <div className="flex w-full items-center justify-between">
                <Body2>Kurir Pilihan</Body2>
                <Body3>{order.shipment?.carrier!.toUpperCase()}</Body3>
              </div>
              <div className="flex w-full items-start justify-between">
                <Body2>Alamat Pengiriman</Body2>
                <Body3 className="max-w-[50%] text-wrap break-words text-right">
                  {order.shipping_address}
                </Body3>
              </div>
              {order.shipment && order.shipment.tracking_id && (
                <div className="flex w-full items-start justify-between">
                  <Body2>No. Resi</Body2>
                  <Body3 className="text-wrap break-words text-right">
                    {order.shipment?.tracking_id}
                  </Body3>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-[90%] flex-col gap-1 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
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
                        <Body2>{i.product?.name}</Body2>
                        {i.variant && <Body3>{i.variant.name}</Body3>}
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
          {order.shipment &&
            order.shipment.status === "DELIVERED" &&
            order.status === "DELIVERED" && (
              <div className="flex w-full justify-center">
                <ConfirmFinishButton order={order} />
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
