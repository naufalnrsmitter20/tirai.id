import Image from "next/image";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { H2, Body1 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Hero() {
  return (
    <SectionContainer id="Hero">
      <div className="flex flex-col justify-between space-y-[3.75rem] lg:flex-row lg:space-y-0">
        <Image
          src={"/assets/login.png"}
          alt="Hero Image"
          width={502}
          height={648}
          className="pointer-events-none"
        />
        <div
          id="paragraph"
          className="flex w-full flex-col justify-between space-y-[3.75rem] lg:max-w-[50%] lg:space-y-0"
        >
          <div className="flex flex-col">
            <SectionTitle>Sejarah</SectionTitle>
            <H2 className="text-black">
              Perjalanan Kami Menuju Standar Terbaik dalam Kualitas dan Desain
              Tirai
            </H2>
          </div>
          <Body1 className="text-black opacity-50">
            Tirai.id memulai perjalanan pada pertengahan 2009 sebagai usaha
            kecil di kawasan perumahan, melayani kebutuhan tirai rumah tangga
            dengan fokus pada kualitas. Pada tahun 2010, kami menjalin kerja
            sama dengan jaringan toko modern, memperluas jangkauan pasar dan
            memperkenalkan produk berkualitas kepada lebih banyak pelanggan.
            Hingga kini, kami terus berinovasi untuk menghadirkan tirai yang
            estetis, fungsional, dan sesuai dengan kebutuhan pelanggan.
          </Body1>
          <div className="flex flex-row justify-start">
            <Link
              href={"#"}
              className={buttonVariants({
                variant: "default",
                className: "w-[212px] lg:w-fit",
              })}
            >
              Baca Selengkapnya <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
