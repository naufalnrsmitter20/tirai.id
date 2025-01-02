"use client";

import { updateResi } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Body3, H2 } from "@/components/ui/text";
import { OrderWithItemsPaymentShipment } from "@/types/entityRelations";
import { BoxIcon, MapPin, Truck } from "lucide-react";
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
      await updateResi(order.id, trackingId);
      toast.success("Berhasil mengupdate resi", { id: loadingId });
    } catch (e) {
      console.log(e);
      toast.error("Gagal mengupdate resi", { id: loadingId });
    } finally {
      setLoading(false);
      return toast.success("Berhasil mengupdate resi", {
        id: loadingId,
      });
    }
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-500" />
            <H2 className="text-xl font-semibold">Pengiriman</H2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Courier Information */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <BoxIcon className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium">Kurir Pilihan</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">
              {order.shipment?.carrier}
            </span>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium">Alamat Pengiriman</span>
              </div>
              <div className="max-w-[50%]">
                <Body3 className="text-right text-sm text-neutral-400">
                  {order.shipping_address}
                </Body3>
              </div>
            </div>
          </div>

          {/* Tracking Number Input Section */}
          {order.status === "PACKING" && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">No. Resi</span>
              </div>
              <Input
                value={trackingId ?? ""}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Masukkan nomor resi pengiriman"
                className="bg-white"
              />
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
                onClick={handleUpsert}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </span>
                ) : trackingId ? (
                  "Perbarui Resi"
                ) : (
                  "Simpan Resi"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
