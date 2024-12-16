"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, H1, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { MOTTOS } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const About: FC = () => {
  return (
    <SectionContainer id="about">
      <div className="mb-16 flex w-full flex-col items-end justify-between gap-y-24 lg:flex-row lg:gap-0">
        <Image
          src={"/assets/about-us.png"}
          alt="Tentang Kami"
          width={525}
          height={457}
          className="pointer-events-none h-auto w-full object-cover lg:w-[34%]"
        />
        <div className="w-full lg:max-w-[57%]">
          <SectionTitle>Tentang Kami</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
            Kami Selalu Siap Memberikan Pelayanan Terbaik untuk Kebutuhan Anda
          </H1>
          <Body3 className="mb-12 text-neutral-500">
            Tirai.id adalah perusahaan yang bergerak dalam bidang dekorasi
            ruangan interior melalui Tirai.id yang siap melayani seluruh wilayah
            jawa timur bertujuan untuk meningkatkan keindahan ruangan Anda demi
            terciptanya ruangan yang nyaman untuk di tempati. Dengan bertumpu
            pada 3 nilai pokok yaitu tepat waktu, tepat ukuran dan tepat selera.
          </Body3>
          {/* TODO: Change this to the custom product route */}
          <Link
            href={"#"}
            className={buttonVariants({
              variant: "default",
              className: "w-full sm:w-fit",
            })}
          >
            Baca selengkapnya tentang kami <ArrowRight />
          </Link>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {MOTTOS.map((motto, index) => (
          <div
            key={motto.title}
            className="w-full rounded-xl bg-neutral-50 p-6"
          >
            <div className="mb-8 flex w-full items-center justify-between text-black">
              <H5>{motto.title}</H5>
              <H5>0{index + 1}</H5>
            </div>
            <Body3 className="text-neutral-500">{motto.description}</Body3>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};
