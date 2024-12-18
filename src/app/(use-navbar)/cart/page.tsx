"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Body3, H1, H2, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ItemCard } from "./components/ItemCard";

export default function Cart() {
  const { cart } = useCart();

  if (cart === undefined)
    return (
      <PageContainer>
        <SectionContainer className="mx-auto">
          <H2 className="w-full text-center text-neutral-500">Loading...</H2>
        </SectionContainer>
      </PageContainer>
    );

  return (
    <PageContainer>
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
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div className="w-full lg:w-[30%]">
              <H3 className="mb-6 text-black">Ringkasan Belanja</H3>
              <div className="mb-8 flex w-full items-center justify-between">
                <Body3 className="text-neutral-500">Subtotal</Body3>
                <Body3 className="font-medium text-black">
                  {formatRupiah(
                    cart.reduce(
                      (prev, curr) => prev + curr.pricePerItem * curr.quantity,
                      0,
                    ),
                  )}
                </Body3>
              </div>
              <Button className="mb-3 w-full" size={"lg"}>
                Proses ke Checkout
              </Button>
              <Body3 className="w-full text-neutral-500">
                Kami mengumpulkan data pribadi Anda untuk memproses pesanan dan
                memberikan pembaruan statusnya. Dengan melanjutkan dan mengklik
                Checkout, Anda menyetujui Kebijakan Privasi serta Syarat dan
                Ketentuan kami.
              </Body3>
            </div>
          </div>
        )}
        {cart.length === 0 && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
            <ShoppingCart className="mb-16 size-28 text-primary-900" />
            <H1 className="mb-2 text-black">Belum Ada Apapun di Keranjangmu</H1>
            <Body3 className="mb-8 text-neutral-500">
              Yuk, isi dengan produk-produk keren dari Tirai.id!
            </Body3>
            <Link
              href={"/shop"}
              className={buttonVariants({
                variant: "default",
                className: "min-w-64",
                size: "lg",
              })}
            >
              Belanja sekarang
            </Link>
          </div>
        )}
      </SectionContainer>
    </PageContainer>
  );
}
