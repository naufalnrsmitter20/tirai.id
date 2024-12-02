import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H2, H3 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import Image from "next/image";
import { FC } from "react";

export const VisiMisi: FC = () => {
  return (
    <SectionContainer>
      <SectionTitle>Visi & Misi</SectionTitle>
      <H2 className="mb-[3.875rem] w-full text-black lg:max-w-[50%]">
        Komitmen Kami untuk Membuat Tirai dengan Kualitas Terbaik
      </H2>
      <div className="mb-[3.875rem] flex flex-col justify-between gap-y-12 lg:flex-row-reverse lg:gap-0">
        <Image
          src={"/assets/vision.png"}
          alt="Asset Visi"
          width={367}
          height={160}
          className="pointer-events-none mb-[1.25rem] h-auto w-full object-cover lg:mb-0 lg:w-[32%]"
        />
        <div className="flex w-full flex-col lg:max-w-[55%]">
          <H3 className="mb-6 text-black lg:mb-8">Visi Kami</H3>
          <Body3 className="text-neutral-500">
            Menjadi penyedia tirai terpercaya di Indonesia yang mengutamakan
            kualitas, inovasi, dan kepuasan pelanggan untuk menciptakan ruang
            yang indah dan nyaman. Kami bercita-cita untuk membantu menciptakan
            ruangan yang lebih nyaman dan estetis bagi setiap pelanggan.
          </Body3>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-y-12 lg:flex-row-reverse lg:gap-0">
        <Image
          src={"/assets/mission.png"}
          alt="Asset Misi"
          width={367}
          height={160}
          className="pointer-events-none mb-[1.25rem] h-auto w-full object-cover lg:mb-0 lg:w-[32%]"
        />
        <div className="flex w-full flex-col lg:max-w-[55%]">
          <H3 className="mb-6 text-black lg:mb-8">Misi Kami</H3>
          <Body3 className="text-neutral-500">
            Kami berkomitmen untuk menyediakan tirai berkualitas tinggi dengan
            desain estetis dan fungsional, memberikan layanan pemesanan yang
            cepat dan tepat, serta selalu mengutamakan kepuasan pelanggan.
          </Body3>
        </div>
      </div>
    </SectionContainer>
  );
};
