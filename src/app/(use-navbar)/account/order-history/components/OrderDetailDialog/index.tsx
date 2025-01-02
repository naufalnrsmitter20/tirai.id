"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatRupiah } from "@/lib/utils";
import { DialogBaseProps } from "@/types/dialog";
import { OrderWithPayment } from "@/types/order";
import { Package, TruckIcon } from "lucide-react";
import Link from "next/link";
import { FC, useMemo } from "react";
import { ConfirmFinishButton } from "../ConfirmFinishButton";
import { OrderItemCard } from "./OrderItemCard";
import { H3 } from "@/components/ui/text";

export const OrderDetailDialog: FC<
  DialogBaseProps & { order: OrderWithPayment }
> = ({ open, setIsOpen, order }) => {
  const realTotalPrice = useMemo(
    () =>
      order.items.reduce((sum, i) => {
        return (sum +=
          i.quantity * (i.product?.price ?? i.variant?.price ?? 0));
      }, 0),
    [order.items],
  );

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Detail Pesanan #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {order.invoice_link && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Invoice</span>
                    <a
                      href={order.invoice_link}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {order.payment?.transaction_id}
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Order Date</span>
                  <span className="text-sm">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status Order</span>
                  <span className="text-sm">{order.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <TruckIcon className="h-4 w-4" />
                Pengiriman
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Kurir</span>
                <span className="text-sm">
                  {order.shipment?.carrier?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Alamat</span>
                <span className="max-w-[60%] text-right text-sm">
                  {order.shipping_address}
                </span>
              </div>
              {order.shipment?.tracking_id && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">No. Resi</span>
                    <span className="text-sm">
                      {order.shipment.tracking_id}
                    </span>
                  </div>
                  <Link
                    className={buttonVariants({ className: "w-full" })}
                    href={`/cek-resi/${order.id}`}
                  >
                    Cek Resi
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <H3 className="flex items-center gap-2 text-base font-semibold">
                <Package className="h-4 w-4" />
                Barang
              </H3>
            </CardHeader>
            <CardContent className="space-y-8">
              {order.items.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  status={order.status}
                />
              ))}
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div className="flex justify-between text-sm">
                <span>Total Barang ({order.items.length} Barang)</span>
                <span>
                  {order.items.length > 0 &&
                  order.items[0].custom_request === undefined
                    ? formatRupiah(realTotalPrice)
                    : formatRupiah(
                        order.total_price -
                          order.shipping_price -
                          (order.total_price -
                            order.shipping_price -
                            (order.total_price - order.shipping_price) / 1.11),
                      )}
                </span>
              </div>

              {order.items.length > 0 && !order.items[0].custom_request && (
                <div className="flex justify-between text-sm">
                  <span>
                    Diskon (
                    {Math.round(
                      ((realTotalPrice -
                        (order.total_price - order.shipping_price) / 1.11) /
                        realTotalPrice) *
                        100,
                    )}
                    %)
                  </span>
                  <span className="text-red-600">
                    -
                    {formatRupiah(
                      realTotalPrice -
                        (order.total_price - order.shipping_price) / 1.11,
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>PPN (11%)</span>
                <span>
                  {formatRupiah(
                    order.total_price -
                      order.shipping_price -
                      (order.total_price - order.shipping_price) / 1.11,
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Ongkos Kirim</span>
                <span>{formatRupiah(order.shipping_price)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total Pembayaran</span>
                <span className="text-lg">
                  {formatRupiah(order.total_price)}
                </span>
              </div>
            </CardContent>
          </Card>

          {order.shipment?.status === "SHIPPED" &&
            order.status === "SHIPPING" && (
              <ConfirmFinishButton order={order} />
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
