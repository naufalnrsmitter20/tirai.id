"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, H1 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const Custom: FC = () => {
  return (
    <SectionContainer id="custom">
      <div className="flex w-full flex-col-reverse items-end justify-between gap-y-24 lg:flex-row lg:gap-0">
        <div className="w-full lg:max-w-[46%]">
          <SectionTitle>Custom</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
            Buat Tirai Sesuai Keinginan untuk Ruangan Anda
          </H1>
          <Body3 className="mb-12 text-neutral-500">
            Kami menyediakan layanan pembuatan tirai kustom yang dapat
            disesuaikan dengan ukuran jendela dan pilihan bahan Anda. Dengan
            pengalaman lebih dari 10 tahun dan kepercayaan dari ratusan klien,
            kami siap membantu mewujudkan tirai impian Anda. Hubungi kami
            sekarang untuk mendapatkan layanan terbaik.
          </Body3>
          {/* TODO: Change this to the custom product route */}
          <Link
            href={"#"}
            className={buttonVariants({
              variant: "default",
              className: "w-full sm:w-fit",
            })}
          >
            Buat tirai Anda sekarang <ArrowRight />
          </Link>
        </div>
        <Image
          src={"/assets/custom-product.png"}
          alt="Produk Kustom"
          width={525}
          height={457}
          className="pointer-events-none h-auto w-full object-cover lg:w-[45%]"
        />
      </div>
    </SectionContainer>
  );
};
