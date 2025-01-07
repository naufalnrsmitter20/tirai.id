"use client";

import { Body3, H5 } from "@/components/ui/text";
import { formatDate, formatRupiah } from "@/lib/utils";
import { OrderWithAffiliatePayment } from "@/types/order";
import { FC } from "react";

export const AffiliateTable: FC<{
  orders: OrderWithAffiliatePayment[];
}> = ({ orders }) => {
  return (
    <>
      <div className="grid grid-cols-4 border-b border-neutral-500 pb-4 text-neutral-500">
        <H5>ID</H5>
        <H5>Tanggal</H5>
        <H5>Harga</H5>
        <H5>Fee</H5>
      </div>
      <div className="mb-5 flex flex-col gap-y-4 divide-y divide-neutral-200">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => {
              // setSelectedOrder(order);
              // setDialogOpen(true);
            }}
            className="grid grid-cols-4 justify-between gap-x-2 py-6 text-start text-neutral-500"
          >
            <Body3>{order.id}</Body3>
            <Body3>{formatDate(order.created_at)}</Body3>
            <Body3>{formatRupiah(order.total_price)}</Body3>
            <Body3>
              {formatRupiah(
                (order.total_price * (order.referal?.fee_in_percent ?? 0)) /
                  100,
              )}
            </Body3>
          </button>
        ))}
      </div>
    </>
  );
};
