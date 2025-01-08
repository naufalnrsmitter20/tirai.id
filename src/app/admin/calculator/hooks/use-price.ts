import { Discount } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Material, Price } from "../types";

export const usePrice = (
  dimensions: Dimensions,
  selectedMaterial: Material | null,
  quantity: number,
  customerDiscount?: Discount | null,
  supplierDiscount?: Discount | null,
) => {
  const [price, setPrice] = useState<Price>({
    customer: { original: 0, discounted: 0 },
    supplier: { original: 0, discounted: 0 },
  });

  const calculatePrice = useCallback(
    (
      length: number,
      width: number,
      materialPrice: number,
      discount?: Discount | null,
    ) => {
      const area = (length / 100) * (width / 100);
      const brute = (area < 1 ? 1 : area) * materialPrice;
      return {
        original: brute * quantity,
        discounted:
          (brute - brute * (discount?.discount_in_percent || 0 / 100)) *
          quantity,
      };
    },
    [quantity],
  );

  useEffect(() => {
    if (selectedMaterial) {
      const customerPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.price,
        customerDiscount,
      );
      const supplierPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.supplier_price,
        supplierDiscount,
      );

      setPrice({
        customer: customerPrice,
        supplier: supplierPrice,
      });
    }
  }, [
    dimensions,
    quantity,
    selectedMaterial,
    calculatePrice,
    customerDiscount,
    supplierDiscount,
  ]);

  return price;
};
