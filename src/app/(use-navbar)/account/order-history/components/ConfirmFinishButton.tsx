"use client";

import { finishOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { OrderWithPayment } from "@/types/order";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { toast } from "sonner";

export const ConfirmFinishButton = ({ order }: { order: OrderWithPayment }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    const loadingId = toast.loading("Konfirmasi Order...");

    await finishOrder(order.id);

    setLoading(false);
    toast.success("Berhasil Konfirmasi Order", {
      id: loadingId,
    });
    return router.refresh();
  };

  return (
    <Button className="w-full" onClick={handleConfirm} disabled={loading}>
      Selesaikan Pesanan
    </Button>
  );
};
