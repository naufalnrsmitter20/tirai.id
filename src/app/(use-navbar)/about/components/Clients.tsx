import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H2, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widgets/SectionTitle";
import Image from "next/image";
import { FC } from "react";

interface Client {
  id: string;
  photo: string;
  name: string;
  description: string;
}

const CLIENTS: Client[] = [
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

export const Clients: FC = () => {
  return (
    <SectionContainer>
      <div className="flex flex-col">
        <SectionTitle>Klien</SectionTitle>
        <div className="mb-12 flex w-full flex-col justify-between space-y-[1.25rem] lg:flex-row lg:space-y-0">
          <H2 className="text-black">
            Membantu Mewujudkan Ruang Impian Banyak Klien
          </H2>
        </div>
        <ul className="grid w-full grid-cols-1 items-start justify-between gap-6 pb-10 md:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((client) => (
            <li key={client.id} className="flex flex-col items-center">
              <div className="w-full">
                <Image
                  src={client.photo}
                  alt={client.name}
                  width={273}
                  height={304}
                  className="mb-11 h-40 w-full rounded-2xl object-cover"
                  unoptimized
                />
                <div className="flex flex-col items-start">
                  <H5 className="mb-3 text-black">{client.name}</H5>
                  <Body3 className="mb-5 text-neutral-500">
                    {client.description}
                  </Body3>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
};
