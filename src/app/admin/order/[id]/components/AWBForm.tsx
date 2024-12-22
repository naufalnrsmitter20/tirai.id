"use client";

import { AddResi, UpdateResi } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body2, Body3, H2 } from "@/components/ui/text";
import { OrderWithItemsPaymentShipment } from "@/types/entityRelations";
import { useState } from "react";
import { toast } from "sonner";

export const AWBForm = ({
  order,
}: {
  order: OrderWithItemsPaymentShipment;
}) => {
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState(order.shipment?.tracking_id);

  const handleUpsert = async () => {
    setLoading(true);
    const loadingId = toast.loading("Mengedit resi...");

    if (!trackingId || trackingId === "") {
      setLoading(false);
      return toast.error("tracking id must be filled", {
        id: loadingId,
      });
    }

    if (order.shipment) {
      await UpdateResi(order.id, trackingId);
      setLoading(false);
      return toast.success("Berhasil mengupdate resi", {
        id: loadingId,
      });
    }

    await AddResi(order.id, order.desired_carrier_name, trackingId);
    setLoading(false);
    return toast.success("Berhasil menambahkan resi", {
      id: loadingId,
    });
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[35vw] flex-col gap-3 rounded-lg bg-white px-3 py-4 shadow-black drop-shadow">
        <H2 className="py-0">Pengiriman</H2>
        <div className="flex w-full items-center justify-between">
          <Body2>Kurir Pilihan</Body2>
          <Body3>{order.desired_carrier_name}</Body3>
        </div>
        <div className="flex w-full items-start justify-between">
          <Body2>Alamat Pengiriman</Body2>
          <Body3 className="max-w-[50%] text-wrap break-words">
            {order.shipping_address}
          </Body3>
        </div>
        {order.status !== "UNPAID" && (
          <div className="flex w-full flex-col items-start">
            <Body2>No. Resi</Body2>
            <Input
              defaultValue={trackingId ?? ""}
              onChange={(e) => {
                e.preventDefault();
                setTrackingId(e.target.value);
              }}
              placeholder="Input Resi"
            />
            <Button
              className="mt-2 w-full"
              disabled={loading}
              onClick={handleUpsert}
            >
              {trackingId ? "Edit" : "Simpan"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
