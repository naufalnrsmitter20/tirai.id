"use client";

import { ProductWithCategoryReviewsVariants } from "@/types/entityRelations";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { toast } from "sonner";
import { changeProductPublishedStatus } from "@/actions/products";

export const ProductContainer = ({
  products,
}: {
  products: ProductWithCategoryReviewsVariants[];
}) => {
  const [isLoading, setLoading] = useState(false);

  const changePublishStatus = async (id: string, status: boolean) => {
    setLoading(true);

    const loading = toast.loading("Memperbarui Product...");

    try {
      const upsertProductResult = await changeProductPublishedStatus(
        id,
        status,
      );

      if (!upsertProductResult.success) {
        setLoading(false);
        return toast.error("Gagal memperbarui Product!", { id: loading });
      }

      setLoading(false);
      toast.success("Berhasil memperbarui Product!", { id: loading });
    } catch {
      setLoading(false);
      return toast.error("Gagal memperbarui Product!", { id: loading });
    }
  };

  return (
    <>
      {products.map((i) => (
        <ProductCard
          data={i}
          key={i.id}
          changePublishStatus={changePublishStatus}
          isLoading={isLoading}
        />
      ))}
    </>
  );
};
