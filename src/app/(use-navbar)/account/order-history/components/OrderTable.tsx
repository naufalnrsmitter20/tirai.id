"use client";

import { FC, useState } from "react";
import { Prisma } from "@prisma/client";
import { OrderWithPayment } from "@/types/order";
import { Body3, H5 } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah } from "@/lib/utils";
import { OrderDetailDialog } from "./OrderDetailDialog";

export const OrderTable: FC<{
  orders: OrderWithPayment[];
}> = ({ orders }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment>();

  return (
    <>
      <div className="grid grid-cols-4 border-b border-neutral-500 pb-4 text-neutral-500">
        <H5>ID</H5>
        <H5>Tanggal</H5>
        <H5>Harga</H5>
        <H5>Status</H5>
      </div>
      <div className="mb-5 flex flex-col gap-y-4 divide-y divide-neutral-200">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => {
              setSelectedOrder(order);
              setDialogOpen(true);
            }}
            className="grid grid-cols-4 justify-between gap-x-2 py-6 text-start text-neutral-500"
          >
            <Body3>{order.id}</Body3>
            <Body3>{formatDate(order.created_at)}</Body3>
            <Body3>{formatRupiah(order.total_price)}</Body3>
            <Body3>{order.status}</Body3>
          </button>
        ))}
      </div>
      {selectedOrder && (
        <OrderDetailDialog
          open={dialogOpen}
          setIsOpen={setDialogOpen}
          order={selectedOrder!}
        />
      )}
    </>
  );
};
