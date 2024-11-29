"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body1, Body3, H1, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { COLORS } from "@/constants/color";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import { FC, useState } from "react";

interface Testimony {
  testimony: string;
  customer: {
    name: string;
    title: string;
  };
}

const TESTIMONIES: Testimony[] = [
  {
    testimony:
      "Saya sangat puas dengan kualitas tirai yang saya beli! Proses pemesanan sangat mudah dan hasilnya luar biasa.",
    customer: { name: "Rina Agustina", title: "Ibu Rumah Tangga" },
  },
  {
    testimony:
      "Saya sangat puas dengan kualitas tirai yang saya beli! Proses pemesanan sangat mudah dan hasilnya luar biasa.",
    customer: { name: "Rina Agustina", title: "Ibu Rumah Tangga" },
  },
  {
    testimony:
      "Saya sangat puas dengan kualitas tirai yang saya beli! Proses pemesanan sangat mudah dan hasilnya luar biasa.",
    customer: { name: "Rina Agustina", title: "Ibu Rumah Tangga" },
  },
];

export const Testimonies: FC = () => {
  const [currentTestimony, setCurrentTestimony] = useState(0);

  return (
    <SectionContainer id="testimony">
      <div className="flex w-full flex-col items-start justify-between gap-y-24 md:flex-row">
        <div className="w-full lg:max-w-[45%]">
          <SectionTitle>Testimoni</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
            Bagaimana Tirai.id Dipercaya Banyak Pelanggan
          </H1>
          <Body3 className="mb-12 text-neutral-500">
            Pelajari lebih lanjut bagaimana produk kami memberikan kepuasan
            kepada pelanggan kami. Testimoni ini adalah bukti kepercayaan yang
            telah kami bangun.
          </Body3>
          <div className="flex w-fit items-center gap-x-2">
            {Array.from({ length: TESTIMONIES.length }).map((_, index) => (
              <button key={index} onClick={() => setCurrentTestimony(index)}>
                <div
                  className={cn(
                    "rounded-full bg-primary-900 transition-all duration-300",
                    currentTestimony === index
                      ? "size-[0.625rem] bg-opacity-100"
                      : "size-2 bg-opacity-[28%]",
                  )}
                ></div>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-hidden lg:max-w-[45%]">
          <div
            className="flex h-full w-full transition-transform duration-300"
            style={{
              transform: `translateX(-${currentTestimony * 100}%)`,
            }}
          >
            {TESTIMONIES.map((testimony, index) => (
              <div key={index} className="h-full w-full flex-shrink-0">
                <div className="mb-6">
                  <Quote
                    size={24}
                    fill={COLORS.primary[900]}
                    color={COLORS.primary[900]}
                  />
                </div>
                <Body1 className="mb-12 text-black">
                  {testimony.testimony}
                </Body1>
                <div className="flex flex-col gap-y-0.5">
                  <H5 className="text-black">{testimony.customer.name}</H5>
                  <Body3 className="text-neutral-500">
                    {testimony.customer.title}
                  </Body3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
