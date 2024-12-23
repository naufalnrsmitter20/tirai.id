"use client";

import { Button } from "@/components/ui/button";
import { Body3, H3 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { useMemo } from "react";

export const Details = ({
  cartItems,
  products,
  checkoutDisabled,
  handleCheckout,
  shippingPrice,
}: {
  cartItems: CartItem[];
  products: ProductWithVariant[];
  checkoutDisabled: boolean;
  handleCheckout: () => void;
  shippingPrice?: number;
}) => {
  const detailedCartItems = useMemo(() => {
    if (!cartItems || !products) return [];

    return cartItems
      .map((item) => {
        const product = products.find(
          (product) => product.id === item.productId,
        );
        if (!product) return null;

        const variant = item.variantId
          ? product.variants?.find((variant) => variant.id === item.variantId)
          : null;

        const pricePerUnit = variant?.price ?? product.price ?? 0;
        const totalItemPrice = pricePerUnit * item.quantity;

        return {
          ...item,
          productName: product.name,
          variantName: variant?.name || null,
          pricePerUnit,
          totalItemPrice,
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const productPrice = useMemo(() => {
    return detailedCartItems.reduce(
      (sum, item) => sum + item!.totalItemPrice,
      0,
    );
  }, [detailedCartItems]);

  const totalPrice = useMemo(
    () => productPrice + (shippingPrice === undefined ? 0 : shippingPrice),
    [productPrice, shippingPrice],
  );

  return (
    <div className="flex h-full w-full flex-col items-stretch overflow-y-hidden lg:w-1/3">
      <div className="mb-6 flex flex-col gap-y-2">
        <div className="flex flex-row justify-between">
          <Body3 className="text-black">
            Subtotal ({detailedCartItems.length})
          </Body3>
          <Body3 className="text-black">{formatRupiah(productPrice)}</Body3>
        </div>
        <div className="flex flex-row justify-between">
          <Body3 className="text-black">Shipping</Body3>
          {shippingPrice && (
            <Body3 className="neutral-500 text-black">
              {formatRupiah(shippingPrice)}
            </Body3>
          )}
        </div>
        <div className="mt-2 flex flex-row justify-between">
          <H3 className="text-black">Total</H3>
          <H3 className="text-black">{formatRupiah(totalPrice)}</H3>
        </div>
      </div>
      <Button
        disabled={checkoutDisabled}
        onClick={handleCheckout}
        className="w-full"
      >
        Checkout
      </Button>
    </div>
  );
};
