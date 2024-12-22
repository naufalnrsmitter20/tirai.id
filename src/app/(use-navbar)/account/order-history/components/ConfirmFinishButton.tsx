"use client";

import { FinishOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { OrderWithPayment } from "@/types/order";
import { useState } from "react";
import { toast } from "sonner";

export const ConfirmFinishButton = ({ order }: { order: OrderWithPayment }) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    const loadingId = toast.loading("Konfirmasi Order...");

    await FinishOrder(order.id);
    setLoading(false);
    return toast.success("Berhasil Konfirmasi Order", {
      id: loadingId,
    });
  };

  return (
    <Button className="w-[90%]" onClick={handleConfirm} disabled={loading}>
      Konfirmasi Selesai
    </Button>
  );
};
