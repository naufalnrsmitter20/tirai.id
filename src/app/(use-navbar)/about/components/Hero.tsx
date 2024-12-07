import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H2 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import Image from "next/image";
import { FC } from "react";

export const Hero: FC = () => {
  return (
    <SectionContainer id="hero">
      <div className="flex flex-col items-end justify-between space-y-[3.75rem] lg:flex-row lg:space-y-0">
        <Image
          src={"/assets/login.png"}
          alt="Hero Image"
          width={502}
          height={648}
          className="pointer-events-none"
        />
        <div className="flex w-full flex-col lg:max-w-[50%]">
          <div className="mb-16 flex flex-col">
            <SectionTitle>Sejarah</SectionTitle>
            <H2 className="text-black">
              Perjalanan Kami Menuju Standar Terbaik dalam Kualitas dan Desain
              Tirai
            </H2>
          </div>
          <Body3 className="text-neutral-500">
            Tirai.id memulai perjalanan pada pertengahan 2009 sebagai usaha
            kecil di kawasan perumahan, melayani kebutuhan tirai rumah tangga
            dengan fokus pada kualitas. Pada tahun 2010, kami menjalin kerja
            sama dengan jaringan toko modern, memperluas jangkauan pasar dan
            memperkenalkan produk berkualitas kepada lebih banyak pelanggan.
            Hingga kini, kami terus berinovasi untuk menghadirkan tirai yang
            estetis, fungsional, dan sesuai dengan kebutuhan pelanggan.
            <br />
            <br />
            Kami menyediakan ready stock gordyn dalam kemasan yang praktis dan
            siap pakai. Produk kami telah tersedia di berbagai pasar modern
            ternama seperti Giant dan Marco, serta telah menjadi bagian dari
            jaringan pemasaran multilevel marketing (MLM) Sophie Paris (Sophie
            Martin). Dengan kualitas yang terjamin dan desain yang elegan, kami
            menyasar segmen pasar kelas menengah modern minimalis yang
            mengutamakan kepraktisan dan gaya. Namun, produk kami juga dapat
            memenuhi kebutuhan kalangan atas dengan preferensi desain klasik,
            sehingga mencakup berbagai lapisan masyarakat dengan selera yang
            beragam.
          </Body3>
        </div>
      </div>
    </SectionContainer>
  );
};
