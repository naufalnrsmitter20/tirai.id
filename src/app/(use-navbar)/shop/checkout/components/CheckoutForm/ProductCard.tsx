"use client";

import { Body3, Body4, H3 } from "@/components/ui/text";
import { cn, formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import Image from "next/image";

export const ProductCard = ({
  cartItem,
  product,
}: {
  cartItem: CartItem;
  product: ProductWithVariant;
}) => {
  const variant = cartItem.variantId
    ? product.variants[
        product.variants.findIndex((i) => i.id === cartItem.variantId)
      ]
    : null;

  return (
    <div
      className={cn(
        "products-center flex w-[80%] flex-row justify-between py-6",
      )}
    >
      <div className="products-center flex w-full max-w-xs gap-x-4 lg:max-w-fit">
        <Image
          src={product.photos[0]}
          width={400}
          height={400}
          className="aspect-square size-24 rounded-md md:size-32"
          alt={`${product.name}'s Photo`}
          unoptimized
        />
        <div className="block">
          <H3 className="text-black">{product.name}</H3>
          {variant && (
            <Body4 className="mt-1 text-neutral-500">{variant.name}</Body4>
          )}
        </div>
      </div>
      <div className="products-end flex h-full flex-col justify-between">
        <Body3 className="mb-4 text-black">
          {cartItem.quantity} x{" "}
          {formatRupiah(product.price ? product.price : variant?.price!)}
        </Body3>
      </div>
    </div>
  );
};
