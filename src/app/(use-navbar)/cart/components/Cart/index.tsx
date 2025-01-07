"use client";

import { updateCart } from "@/actions/cart";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/button";
import { Body3, H1, H2, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { CustomRequestItem } from "@/types/cart";
import { Discount, Prisma } from "@prisma/client";
import { useRouter } from "next-nprogress-bar";
import { FC, useEffect, useState } from "react";
import { EmptyCart } from "../EmptyCart";
import { CustomCard } from "./CustomCard";
import { ItemCard } from "./ItemCard";

export const CartItems: FC<{
  products: Prisma.ProductGetPayload<{ include: { variants: true } }>[] | null;
  customRequests: CustomRequestItem[] | null;
  discount?: Discount | null;
}> = ({ products, customRequests, discount }) => {
  const { cart } = useCart();
  const [quantities, setQuantities] = useState<
    {
      id: string;
      quantity: number;
    }[]
  >();

  const router = useRouter();

  useEffect(() => {
    if (cart !== undefined && quantities === undefined) {
      setQuantities(
        cart
          .filter((item) => {
            const product = products?.find(
              (product) => product.id === item.productId,
            );
            if (!product) return false;

            if (product.price !== null) return true;

            return product.variants.some(
              (variant) => variant.id === item.variantId,
            );
          })
          .map((item) => ({ id: item.id, quantity: item.quantity })),
      );
    }
  }, [cart, products, quantities]);

  if (cart === undefined)
    return (
      <SectionContainer className="mx-auto">
        <H2 className="w-full text-center text-neutral-500">Loading...</H2>
      </SectionContainer>
    );

  if (customRequests !== null) {
    const { shipping_price, total_price } = customRequests.reduce(
      (sum, i) => {
        sum.shipping_price += i.shipping_price ?? 0;
        sum.total_price += i.price * i.quantity;

        return sum;
      },
      { shipping_price: 0, total_price: 0 },
    );

    return (
      <SectionContainer id="cart">
        <div className="flex w-full flex-col justify-between gap-y-8 lg:flex-row lg:items-start">
          <div className="block w-full lg:w-[65%]">
            <H1 className="text-black">Keranjang Anda (Produk Kustom)</H1>
            <div className="my-8 flex flex-col gap-2 divide-y divide-neutral-500">
              {customRequests.map((i) => (
                <CustomCard customRequest={i} key={i.id} />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[30%]">
            <H3 className="mb-6 text-black">Ringkasan Belanja</H3>
            <div className="mb-8 flex w-full items-center justify-between">
              <Body3 className="text-neutral-500">Subtotal</Body3>
              <Body3 className="font-medium text-black">
                {formatRupiah(total_price)}
              </Body3>
            </div>
            {shipping_price === undefined && (
              <Body3 className="mb-2 text-neutral-500">
                Menunggu konfirmasi dari admin (max. 2x24 jam)
              </Body3>
            )}
            <Button
              size={"lg"}
              className="mb-3 w-full"
              onClick={() => {
                router.push("/shop/checkout");
              }}
              disabled={customRequests.some(
                (i) => i.shipping_price === undefined,
              )}
            >
              Proses ke Checkout
            </Button>
            <Body3 className="w-full text-neutral-500">
              Kami mengumpulkan data pribadi Anda untuk memproses pesanan dan
              memberikan pembaruan statusnya. Dengan melanjutkan Checkout, Anda
              menyetujui Kebijakan Privasi dan Syarat dan Ketentuan kami.
            </Body3>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="cart">
      {cart.length > 0 && (
        <div className="flex w-full flex-col justify-between gap-y-8 lg:flex-row lg:items-start">
          <div className="block w-full lg:w-[65%]">
            <H1 className="text-black">
              Keranjang Anda{" "}
              {quantities && (
                <span className="text-lg text-neutral-500">
                  ({quantities.reduce((prev, curr) => prev + curr.quantity, 0)})
                </span>
              )}
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
                  discount={discount}
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
                    discount
                      ? quantities.reduce(
                          (prev, curr) =>
                            prev +
                            cart.find((item) => item.id === curr.id)!
                              .pricePerItem *
                              curr.quantity,
                          0,
                        ) -
                          (quantities.reduce(
                            (prev, curr) =>
                              prev +
                              cart.find((item) => item.id === curr.id)!
                                .pricePerItem *
                                curr.quantity,
                            0,
                          ) *
                            discount?.discount_in_percent) /
                            100
                      : quantities.reduce(
                          (prev, curr) =>
                            prev +
                            cart.find((item) => item.id === curr.id)!
                              .pricePerItem *
                              curr.quantity,
                          0,
                        ),
                  )}
                </Body3>
              )}
            </div>
            <Button
              size={"lg"}
              className="mb-3 w-full"
              onClick={async () => {
                const filteredCart = cart.filter((item) => {
                  const product = products?.find(
                    (product) => product.id === item.productId,
                  );
                  if (!product) return false;

                  if (product.price !== null) return true;

                  return product.variants.some(
                    (variant) => variant.id === item.variantId,
                  );
                });

                await updateCart({ type: "ready-stock", items: filteredCart });
                return router.push("/shop/checkout");
              }}
            >
              Proses ke Checkout
            </Button>
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
