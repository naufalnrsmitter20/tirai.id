"use client";

import { sendProductInfo } from "@/actions/chat";
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
import { Body3, Body5, H3, H4, H5 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { cn, formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { Discount, Prisma } from "@prisma/client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";
import Image from "next/image";
import { FC, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Product = Prisma.ProductGetPayload<{
  include: { variants: true; category: { select: { name: true } } };
}>;

export const Hero: FC<{
  product: Product;
  hasCustomCart: boolean;
  session: Session | null | undefined;
  discount?: Discount | null;
}> = ({ product, hasCustomCart, session, discount }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((variant) => variant.stock > 0),
  );
  const [selectedPhoto, setSelectedPhoto] = useState(product.photos[0]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { cart, addItem } = useCart();

  const productInCart = useMemo(
    () =>
      cart
        ? cart.find(
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

  const originalPrice = useMemo(
    () => (!product.price ? selectedVariant?.price || 0 : product.price),
    [product.price, selectedVariant],
  );

  const price = useMemo(
    () =>
      discount
        ? product.price === null
          ? (selectedVariant?.price || 0) -
            (selectedVariant?.price || 0) * (discount.discount_in_percent / 100)
          : product.price - product.price * (discount.discount_in_percent / 100)
        : product.price === null
          ? selectedVariant?.price || 0
          : product.price,
    [product.price, selectedVariant],
  );

  useEffect(() => {
    if (quantity > maxStock) {
      setQuantity(maxStock);
    }
  }, [maxStock, quantity]);

  const handleChat = async () => {
    try {
      if (!session || !session.user) return console.error("unauthorized!");

      await sendProductInfo(product.id, session.user.id);
    } catch (e) {
      console.error(e);
    }
  };

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
          {discount ? (
            <div className="text-black">
              <H4 className="mt-12 text-black">{formatRupiah(price)}</H4>
              <span className="inline-flex items-center gap-2">
                <Body3 className="line-through">
                  {formatRupiah(originalPrice)}
                </Body3>
                <Body5 className="rounded-md bg-red-200 px-[4px] py-[1px] font-semibold text-red-500">
                  {discount.discount_in_percent}%
                </Body5>
              </span>
            </div>
          ) : (
            <H4 className="mt-12 text-black">{formatRupiah(price)}</H4>
          )}
          <div className="mt-3 flex w-full flex-col items-center gap-2">
            <div className="flex w-full flex-col">
              <Label className="mb-2 text-black">Kuantitas</Label>
              <Select
                onValueChange={(value) => {
                  setQuantity(Number(value));
                }}
                value={quantity.toString()}
                disabled={maxStock === 0 || hasCustomCart}
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
            <div className="flex w-full items-center gap-1">
              <Button className="aspect-square" onClick={handleChat}>
                <ChatBubbleIcon />
              </Button>
              <Button
                variant={"default"}
                className="w-full"
                disabled={maxStock === 0 || loading || hasCustomCart}
                onClick={async () => {
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

                  await addItem(cartItem);

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
      </div>
    </SectionContainer>
  );
};
