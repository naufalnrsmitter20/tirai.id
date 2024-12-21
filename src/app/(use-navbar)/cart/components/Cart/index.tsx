"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, H1, H2, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { EmptyCart } from "./EmptyCart";
import { ItemCard } from "./ItemCard";
import { Prisma } from "@prisma/client";

export const Cart: FC<{
  products: Prisma.ProductGetPayload<{ include: { variants: true } }>[] | null;
}> = ({ products }) => {
  const { cart } = useCart();
  const [quantities, setQuantities] = useState<
    {
      id: string;
      quantity: number;
    }[]
  >();

  useEffect(() => {
    if (cart !== undefined) {
      setQuantities(
        cart.map((item) => ({ id: item.id, quantity: item.quantity })),
      );
    }
  }, [cart]);

  if (cart === undefined)
    return (
      <SectionContainer className="mx-auto">
        <H2 className="w-full text-center text-neutral-500">Loading...</H2>
      </SectionContainer>
    );

  return (
    <SectionContainer id="cart">
      {cart.length > 0 && (
        <div className="flex w-full flex-col justify-between gap-y-8 lg:flex-row lg:items-start">
          <div className="block w-full lg:w-[65%]">
            <H1 className="text-black">
              Keranjang Anda{" "}
              <span className="text-lg text-neutral-500">
                ({cart.reduce((prev, curr) => prev + curr.quantity, 0)})
              </span>
            </H1>
            <div className="my-8 flex flex-col divide-y divide-neutral-500">
              {cart.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  quantities={quantities}
                  setQuantities={setQuantities}
                  product={products?.find(
                    (product) => product.id === item.productId,
                  )}
                />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[30%]">
            <H3 className="mb-6 text-black">Ringkasan Belanja</H3>
            <div className="mb-8 flex w-full items-center justify-between">
              <Body3 className="text-neutral-500">Subtotal</Body3>
              {quantities && cart && (
                <Body3 className="font-medium text-black">
                  {formatRupiah(
                    quantities.reduce(
                      (prev, curr) =>
                        prev +
                        cart.find((item) => item.id === curr.id)!.pricePerItem *
                          curr.quantity,
                      0,
                    ),
                  )}
                </Body3>
              )}
            </div>
            <Link
              href={"/shop/checkout"}
              className={buttonVariants({
                size: "lg",
                className: "mb-3 w-full",
              })}
            >
              Proses ke Checkout
            </Link>
            <Body3 className="w-full text-neutral-500">
              Kami mengumpulkan data pribadi Anda untuk memproses pesanan dan
              memberikan pembaruan statusnya. Dengan melanjutkan Checkout, Anda
              menyetujui Kebijakan Privasi dan Syarat dan Ketentuan kami.
            </Body3>
          </div>
        </div>
      )}
      {cart.length === 0 && <EmptyCart />}
    </SectionContainer>
  );
};
