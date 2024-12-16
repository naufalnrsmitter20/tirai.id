import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H5 } from "@/components/ui/text";
import { MOTTOS } from "@/lib/utils";
import { FC } from "react";

export const Keunggulan: FC = () => {
  return (
    <SectionContainer id="superiority">
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
