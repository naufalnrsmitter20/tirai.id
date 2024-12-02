import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, H2, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widgets/SectionTitle";
import { formatRupiah } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Clients {
  id: string;
  photo: string;
  name: string;
  description: string;
}

const CLIENTS: Clients[] = [
  {
    id: "1",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with the actual path or URL to the image above
    name: "Light Beige Minimalist Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
  },
  {
    id: "2",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with a relevant image path
    name: "Classic White Wooden Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
  },
  {
    id: "3",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with a relevant image path
    name: "Blackout Roller Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
  },
  {
    id: "4",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with a relevant image path
    name: "Custom Pattern Fabric Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
  },
];
export const Client: FC<{ clients?: Clients[] }> = (
  { clients } = { clients: CLIENTS },
) => {
  return (
    <SectionContainer>
      <div className="flex flex-col">
        <SectionTitle>Klien</SectionTitle>
        <div className="flex w-full flex-col justify-between space-y-[1.25rem] lg:flex-row lg:space-y-0">
          <H2 className="text-black">
            Membantu Mewujudkan Ruang Impian Banyak Klien
          </H2>
          <Link
            href={"#"}
            className={buttonVariants({
              variant: "default",
              className: "w-[212px] lg:w-fit",
            })}
          >
            Lihat lebih banyak <ArrowRight />
          </Link>
        </div>
        <ul className="no-scrollbar flex w-full snap-x snap-mandatory flex-col items-end justify-between gap-6 overflow-x-auto pb-10 sm:flex-row sm:items-start">
          {clients && clients.length > 0 ? (
            clients.map((clients) => (
              <li
                key={clients.id}
                className="flex w-[85%] flex-none snap-start flex-col items-center md:w-[40%] lg:w-[23%]"
              >
                <div className="w-full">
                  <Image
                    src={clients.photo}
                    alt={clients.name}
                    width={273}
                    height={304}
                    className="mb-11 min-h-[16rem] w-full rounded-[1.25rem] object-cover"
                    unoptimized
                  />
                  <div className="flex flex-col items-start text-black">
                    {/* TODO: Change the href into actual clients detail */}
                    <Link href={"#"}>
                      <H5 className="mb-3">{clients.name}</H5>
                    </Link>
                    <Body3 className="mb-5 text-neutral-500">
                      {clients.description}
                    </Body3>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <Body3 className="text-neutral-500">
              Belum ada testimoni dari klien...
            </Body3>
          )}
        </ul>
      </div>
    </SectionContainer>
  );
};
