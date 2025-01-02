"use client";

import { updateCart } from "@/actions/cart";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Body2, Body3, H1, H2, H3, H4 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { CustomRequestItem } from "@/types/cart";
import { Discount, Prisma } from "@prisma/client";
import { CreditCard, Package, Palette, Ruler } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useEffect, useState } from "react";
import { EmptyCart } from "../EmptyCart";
import { ItemCard } from "./ItemCard";

export const CartItems: FC<{
  products: Prisma.ProductGetPayload<{ include: { variants: true } }>[] | null;
  customRequest: CustomRequestItem | null;
  discount?: Discount | null;
}> = ({ products, customRequest, discount }) => {
  const { cart } = useCart();
  const [quantities, setQuantities] = useState<
    {
      id: string;
      quantity: number;
    }[]
  >();

  const router = useRouter();

  useEffect(() => {
    if (cart !== undefined) {
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
  }, [cart, products]);

  if (cart === undefined)
    return (
      <SectionContainer className="mx-auto">
        <H2 className="w-full text-center text-neutral-500">Loading...</H2>
      </SectionContainer>
    );

  if (customRequest !== null) {
    const { id, material, model, color, width, height, price, shipping_price } =
      customRequest;

    return (
      <SectionContainer id="cart">
        <div className="flex w-full flex-col justify-between gap-y-8 lg:flex-row lg:items-start">
          <div className="block w-full lg:w-[65%]">
            <H1 className="text-black">Keranjang Anda (Produk Kustom)</H1>
            <div className="my-8 flex flex-col divide-y divide-neutral-500">
              <Card className="w-full transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <H4 className="font-bold text-black">{id}</H4>
                      <Body3 className="text-neutral-500">
                        Model ({model})
                      </Body3>
                    </div>
                    <Body2 className="text-neutral-500">
                      Bahan ({material})
                    </Body2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-gray-500" />
                      <span>Warna</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-600">{color}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-gray-500" />
                      <span>Ukuran</span>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>{width}cm</span>
                      <span>×</span>
                      <span>{height}cm</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>Harga:</span>
                      </div>

                      <span>{formatRupiah(price)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>Ongkir:</span>
                      </div>
                      <span>
                        {shipping_price
                          ? formatRupiah(shipping_price)
                          : "Menunggu konfirmasi"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 font-medium">
                      <span>Total:</span>
                      <span className="text-lg">
                        {formatRupiah(price + (shipping_price || 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="w-full lg:w-[30%]">
            <H3 className="mb-6 text-black">Ringkasan Belanja</H3>
            <div className="mb-8 flex w-full items-center justify-between">
              <Body3 className="text-neutral-500">Subtotal</Body3>
              <Body3 className="font-medium text-black">
                {formatRupiah(customRequest!.price)}
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
              disabled={shipping_price === undefined}
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
