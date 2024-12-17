"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Body3, H1, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Cart() {
  const { cart } = useCart();

  return (
    <PageContainer>
      <SectionContainer id="cart">
        {cart.length > 0 && (
          <div className="flex w-full flex-col items-start justify-between lg:flex-row">
            <div className="block w-full p-4 lg:w-[65%]">
              <H1 className="text-black">
                Keranjang Anda{" "}
                <span className="text-lg text-neutral-500">
                  ({cart.reduce((prev, curr) => prev + curr.quantity, 0)})
                </span>
              </H1>
              <div className="flex flex-col gap-y-6"></div>
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
              <Body3 className="w-full text-balance text-neutral-500">
                Kami mengumpulkan data pribadi Anda untuk memproses pesanan dan
                memberikan pembaruan terkait status pesanan Anda. Dengan
                melanjutkan dan mengklik tombol Checkout, Anda menyetujui
                Kebijakan Privasi serta Syarat dan Ketentuan layanan kami.
              </Body3>
            </div>
          </div>
        )}
      </SectionContainer>
    </PageContainer>
  );
}
