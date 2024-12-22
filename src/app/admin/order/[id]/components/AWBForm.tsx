"use client";

import { UpdateResi } from "@/actions/order";
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
    if (!trackingId?.trim()) {
      return toast.error("Nomor resi harus diisi");
    }

    setLoading(true);
    const loadingId = toast.loading("Mengupdate resi...");

    try {
      await UpdateResi(order.id, trackingId);
      toast.success("Berhasil mengupdate resi", { id: loadingId });
    } catch (error) {
      toast.error("Gagal mengupdate resi", { id: loadingId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="w-[35vw] rounded-lg bg-white px-6 py-4 shadow-md">
        <H2 className="mb-4 border-b pb-2">Pengiriman</H2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Body2>Kurir Pilihan</Body2>
            <Body3>{order.shipment?.carrier.toUpperCase()}</Body3>
          </div>

          <div className="flex items-start justify-between">
            <Body2>Alamat Pengiriman</Body2>
            <Body3 className="max-w-[50%] break-words text-right">
              {order.shipping_address}
            </Body3>
          </div>

          {order.status === "PACKING" && (
            <div className="space-y-2">
              <Body2>No. Resi</Body2>
              <Input
                value={trackingId ?? ""}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Input Resi"
              />
              <Button
                className="w-full"
                disabled={loading}
                onClick={handleUpsert}
              >
                {trackingId ? "Edit" : "Simpan"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
