"use client";

import { upsertDiscount } from "@/actions/discount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body3 } from "@/components/ui/text";
import { Discount, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DiscountForm = ({
  discount,
  role,
}: {
  discount: Discount | null;
  role: Role;
}) => {
  const [discountInPercent, setDiscountInPercent] = useState<number>(
    discount?.discount_in_percent ?? 0,
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async () => {
    setLoading(true);
    const toastId = toast.loading("Menyimpan diskon...");

    if (discountInPercent < 0 || discountInPercent > 100) {
      setLoading(false);
      return toast.error("Masukkan Jumlah diskon yang valid", { id: toastId });
    }

    const res = await upsertDiscount({ discount: discountInPercent, role });

    if (!res.success) {
      setLoading(false);
      return toast.error("Gagal menyimpan diskon", { id: toastId });
    }

    setLoading(false);
    toast.success("Berhasil menyimpan diskon", { id: toastId });
    router.push("/admin/shop/discount");
  };

  return (
    <div>
      <div className="w-full text-black">
        <Body3 className="mb-1">
          Jumlah Diskon Dalam Persen (min. 0, max. 100)
        </Body3>
        <Input
          defaultValue={discountInPercent}
          type="number"
          onChange={(e) =>
            e.target.value && setDiscountInPercent(Number(e.target.value))
          }
          min={0}
          max={100}
        />
      </div>
      <div className="mt-3 flex w-full justify-end">
        <Button onClick={handleFormSubmit} disabled={loading}>
          Simpan
        </Button>
      </div>
    </div>
  );
};
