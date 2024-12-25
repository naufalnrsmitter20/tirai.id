"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Body2, Body3, H2, H4 } from "@/components/ui/text";
import { formatDate, formatRupiah } from "@/lib/utils";
import { DialogBaseProps } from "@/types/dialog";
import { OrderWithPayment } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ConfirmFinishButton } from "./ConfirmFinishButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreditCard, Package, Palette, Ruler } from "lucide-react";

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
                <>
                  <div className="flex w-full items-start justify-between">
                    <Body2>No. Resi</Body2>
                    <Body3 className="text-wrap break-words text-right">
                      {order.shipment?.tracking_id}
                    </Body3>
                  </div>
                  <Link
                    href={`/cek-resi/${order.id}`}
                    className={buttonVariants({
                      variant: "default",
                      className: "mt-2 w-full",
                    })}
                  >
                    Cek Resi
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-[90%] flex-col gap-1 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
              <H2 className="py-0">Barang</H2>
              <div className="flex w-full flex-col gap-2">
                {order.items.map((i) =>
                  i.custom_request ? (
                    <Card
                      className="w-full transition-shadow duration-300 hover:shadow-lg"
                      key={i.custom_request.id}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <H4 className="font-bold text-black">
                              {i.custom_request.id}
                            </H4>
                            <Body3 className="text-neutral-500">
                              Model ({i.custom_request.model})
                            </Body3>
                          </div>
                          <Body2 className="text-neutral-500">
                            Bahan ({i.custom_request.material})
                          </Body2>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-gray-500" />
                            <span>Warna</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded-full border border-gray-200"
                              style={{
                                backgroundColor: i.custom_request.color,
                              }}
                            />
                            <span className="text-sm text-gray-600">
                              {i.custom_request.color}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Ruler className="h-5 w-5 text-gray-500" />
                            <span>Ukuran</span>
                          </div>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <span>{i.custom_request.width}cm</span>
                            <span>×</span>
                            <span>{i.custom_request.height}cm</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                              <span>Harga:</span>
                            </div>
                            <span>{formatRupiah(i.custom_request.price)}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span>Ongkir:</span>
                            </div>
                            <span>
                              {i.custom_request.shipping_price
                                ? formatRupiah(i.custom_request.shipping_price)
                                : "Menunggu konfirmasi"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t pt-2 font-medium">
                            <span>Total:</span>
                            <span className="text-lg">
                              {formatRupiah(
                                i.custom_request.price +
                                  (i.custom_request.shipping_price || 0),
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
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
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-[90%] flex-col gap-1 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
              <H2 className="py-0">Total</H2>
              <div className="flex w-full items-center justify-between">
                <Body2>Total Barang ({order.items.length} Barang)</Body2>
                <Body3>
                  {formatRupiah(order.total_price - order.shipping_price)}
                </Body3>
              </div>
              <div className="flex w-full items-center justify-between">
                <Body2>Ongkos Kirim</Body2>
                <Body3>{formatRupiah(order.shipping_price)}</Body3>
              </div>
              <div className="flex w-full items-center justify-between">
                <Body2>Subtotal</Body2>
                <Body3>{formatRupiah(order.total_price)}</Body3>
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
