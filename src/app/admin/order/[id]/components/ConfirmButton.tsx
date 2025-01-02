"use client";

import { confirmOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { OrderWithItemsProductsPaymentShipment } from "@/types/entityRelations";
import { OrderStatus, Role } from "@prisma/client";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { toast } from "sonner";

export const ConfirmButton = ({
  order,
  role,
}: {
  order: OrderWithItemsProductsPaymentShipment;
  role: Role;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    const loadingId = toast.loading("Konfirmasi Order...");

    const statusMap: { [key: string]: OrderStatus } = {
      ADMIN: "APPROVED",
      PRODUCTION: "PRODUCING",
      PACKAGING: "PACKING",
    };

    await confirmOrder(order.id, statusMap[role]);
    setLoading(false);
    toast.success("Berhasil Konfirmasi Order", {
      id: loadingId,
    });
    return router.push("/admin/order");
  };

  return (
    <div className="flex w-full justify-center">
      {(role !== "ADMIN" ||
        (order.status !== "APPROVED" && order.status !== "PACKING")) && (
        <Button className="w-[35vw]" onClick={handleConfirm} disabled={loading}>
          Konfirmasi{" "}
          {
            { PRODUCTION: "Produksi", ADMIN: "Order", PACKAGING: "Packaging" }[
              role as keyof {
                PRODUCTION: "Produksi";
                ADMIN: "Order";
                PACKAGING: "Packaging";
              }
            ]
          }
        </Button>
      )}
    </div>
  );
};
