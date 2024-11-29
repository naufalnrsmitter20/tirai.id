"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H1, H2 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface FabricHighlight {
  title: string;
  description: string;
}

const FABRIC_HIGHLIGHTS: FabricHighlight[] = [
  {
    title: "Bahan Lokal dengan Motif Menarik",
    description:
      "Kain lokal, diproduksi dalam negeri, menahan sinar matahari hingga +/- 45%, lebih terjangkau, dengan banyak motif dan warna cerah.",
  },
  {
    title: "Vitrase Tirai Sempurna dan Nyaman",
    description:
      "Vitrase menahan sinar matahari dan menjaga privasi, sambil memungkinkan penghuni rumah melihat ke luar dengan bebas.",
  },
  {
    title: "Black Out Mengatur Cahaya dan Suasana",
    description:
      "Menghalangi cahaya matahari dengan sempurna, halus, lembut, dan mudah dibersihkan. Ideal untuk berbagai gorden yang mempercantik ruangan.",
  },
];

export const Fabric: FC = () => {
  const [currentFabricHighlight, setCurrentFabricHighlight] = useState(0);

  // Change current fabric highlight every 5 seconds
  useEffect(() => {
    const changeFabricHighlightInterval = setInterval(() => {
      setCurrentFabricHighlight(
        (prev) => (prev + 1) % FABRIC_HIGHLIGHTS.length,
      );
    }, 5000);

    return () => clearInterval(changeFabricHighlightInterval);
  }, [currentFabricHighlight]);

  return (
    <SectionContainer id="fabrics">
      <div className="mb-[3.25rem] w-full">
        <SectionTitle>Kain</SectionTitle>
        <H1 className="text-black">Kain Berkualitas untuk Gorden Sempurna</H1>
      </div>
      <div className="flex flex-col-reverse justify-between lg:flex-row lg:items-center">
        <div className="flex w-full flex-col gap-y-6 lg:w-[60%]">
          {FABRIC_HIGHLIGHTS.map((highlight, index) => (
            <button
              onClick={() => setCurrentFabricHighlight(index)}
              key={highlight.title}
              className="flex items-center gap-x-7 text-left"
            >
              <div
                className={cn(
                  "h-36 w-[0.375rem] rounded-full transition-colors duration-300",
                  currentFabricHighlight === index
                    ? "bg-primary-900"
                    : "bg-neutral-500",
                )}
              ></div>
              <div
                className={cn(
                  "block transition-all duration-300",
                  currentFabricHighlight === index
                    ? "opacity-100"
                    : "opacity-40",
                )}
              >
                <H2 className="mb-5 text-black">{highlight.title}</H2>
                <Body3 className="text-neutral-500">
                  {highlight.description}
                </Body3>
              </div>
            </button>
          ))}
        </div>
        <Image
          src={"/assets/fabric.png"}
          alt="Bahan Kain"
          width={381}
          height={475}
          className="mb-14 h-auto w-full max-w-[381px] object-cover md:mb-24 lg:mb-0"
        />
      </div>
    </SectionContainer>
  );
};
