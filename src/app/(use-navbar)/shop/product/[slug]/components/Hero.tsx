"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Body3, H3, H4, H5 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { cn, formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { FC, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Product = Prisma.ProductGetPayload<{
  include: { variants: true; category: { select: { name: true } } };
}>;

export const Hero: FC<{ product: Product }> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((variant) => variant.stock > 0),
  );
  const [selectedPhoto, setSelectedPhoto] = useState(product.photos[0]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { cart, addReadyStockItem } = useCart();

  const productInCart = useMemo(
    () =>
      cart !== null && cart?.type === "ready-stock"
        ? cart.items.find(
            (item) =>
              item.productId === product.id &&
              selectedVariant?.id === item.variantId,
          )
        : undefined,
    [cart, product.id, selectedVariant?.id],
  );
  const maxStock = useMemo(
    () =>
      product.stock === null ? selectedVariant?.stock || 0 : product.stock,
    [product.stock, selectedVariant],
  );
  const price = useMemo(
    () =>
      product.price === null ? selectedVariant?.price || 0 : product.price,
    [product.price, selectedVariant],
  );
  const hasCustomProductInCart = useMemo(
    () => (cart !== null ? cart?.type === "custom" : false),
    [cart],
  );

  console.log(hasCustomProductInCart);

  useEffect(() => {
    if (quantity > maxStock) {
      setQuantity(maxStock);
    }
  }, [maxStock, quantity]);

  return (
    <SectionContainer id="hero">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex w-full flex-col-reverse gap-6 md:max-w-[56%] md:flex-row">
          <div className="mb-12 flex w-full flex-row gap-5 md:mb-0 md:w-24 md:flex-col">
            {product.photos.map((photo) => (
              <button
                key={photo}
                className={cn(
                  "size-fit",
                  photo === selectedPhoto
                    ? "rounded-2xl border-2 border-primary-900"
                    : "",
                )}
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo}
                  alt="Small Product Image"
                  unoptimized
                  className="aspect-square size-24 rounded-2xl"
                  height={98}
                  width={98}
                />
              </button>
            ))}
          </div>
          <Image
            src={selectedPhoto}
            alt="Large Product Image"
            unoptimized
            className="h-[372px] w-full max-w-[522px] rounded-[20px]"
            height={372}
            width={522}
          />
        </div>
        <div className="flex w-full flex-col md:max-w-[38%]">
          <H3 className="mb-[.75rem] text-black">{product.name}</H3>
          <Body3 className="mb-[3.5rem] text-neutral-500">
            {product.description}
          </Body3>
          {product.variants.length > 0 && (
            <div className="flex flex-col">
              <H5 className="mb-4 text-black">Pilihan Varian</H5>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-8">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={"default"}
                    className={cn(
                      "rounded-xl duration-0",
                      variant.id === selectedVariant?.id
                        ? ""
                        : "border border-primary-900 bg-white text-primary-900 hover:text-white",
                    )}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <H4 className="mt-12 text-black">{formatRupiah(price)}</H4>
          <div className="mt-3 flex w-full flex-col items-center gap-2">
            <div className="flex w-full flex-col">
              <Label className="mb-2 text-black">Kuantitas</Label>
              <Select
                onValueChange={(value) => {
                  setQuantity(Number(value));
                }}
                value={quantity.toString()}
                disabled={maxStock === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{quantity}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    {
                      length:
                        (maxStock > 30 ? 29 : maxStock) -
                        (productInCart ? productInCart.quantity : 0),
                    },
                    (_, index) => index + 1,
                  ).map((sortOption) => (
                    <SelectItem key={sortOption} value={sortOption.toString()}>
                      {sortOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant={"default"}
              className="w-full"
              disabled={maxStock === 0 || loading || hasCustomProductInCart}
              onClick={() => {
                setLoading(true);
                const loadingToast = toast.loading("Loading...");

                const cartItem: Omit<CartItem, "id"> = {
                  name: product.name,
                  photo: product.photos[0],
                  categoryName: product.category.name,
                  pricePerItem: product.price ?? selectedVariant!.price,
                  quantity,
                  productId: product.id,
                  variantId: selectedVariant?.id,
                  variantName: selectedVariant?.name,
                };

                addReadyStockItem(cartItem);

                setLoading(false);
                toast.success("Berhasil menambahkan produk!", {
                  id: loadingToast,
                });
                return location.reload();
              }}
            >
              {maxStock === 0 ? "Sold Out" : "Masukkan Keranjang"}
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
