import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H2, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { FC } from "react";
interface Motto {
  title: string;
  description: string;
}

const MOTTOS: Motto[] = [
  {
    title: "Tepat Waktu",
    description:
      "Produksi molor dan tidak tepat waktu? Itu tidak terjadi pada Tirai.id. Kami sangat berkomitmen pada waktu.",
  },
  {
    title: "Tepat Ukuran",
    description:
      "Kami membuat tirai dengan ukuran yang tepat, tidak terlalu tinggi atau terlalu rendah. Tidak kurang ataupun tidak terlalu banyak.",
  },
  {
    title: "Tepat Selera",
    description:
      "Menyediakan berbagai pilihan model dan jenis bahan dengan kualitas terbaik untuk memenuhi kebutuhan anda.",
  },
];
export const Keunggulan: FC = () => {
  return (
    <SectionContainer>
      <div className="flex flex-col">
        <SectionTitle>Keunggulan</SectionTitle>
        <H2 className="mb-[3rem] text-black">
          Kualitas, Layanan, dan Kepuasan Pelanggan Kami Terjamin
        </H2>
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
      </div>
    </SectionContainer>
  );
};
