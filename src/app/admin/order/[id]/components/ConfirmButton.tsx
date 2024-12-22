"use client";

import { confirmOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { OrderWithItemsProductsPaymentShipment } from "@/types/entityRelations";
import { useState } from "react";
import { toast } from "sonner";

export const ConfirmButton = ({
  order,
}: {
  order: OrderWithItemsProductsPaymentShipment;
}) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    const loadingId = toast.loading("Konfirmasi Order...");

    await confirmOrder(order.id);
    setLoading(false);
    return toast.success("Berhasil Konfirmasi Order", {
      id: loadingId,
    });
  };

  return (
    <Button className="w-[35vw]" onClick={handleConfirm} disabled={loading}>
      Konfirmasi Order
    </Button>
  );
};
