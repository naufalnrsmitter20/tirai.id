import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H1 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import Link from "next/link";
import { FC } from "react";

export const Tags: FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <SectionContainer id="tags">
      <SectionTitle>Tagar</SectionTitle>
      <H1 className="mb-16 text-black">Lihat Semua Tagar dari Artikel Kami</H1>
      <div className="flex w-full flex-wrap items-center gap-x-4">
        {tags.map((tag) => (
          <Link key={tag} href={`/article/tags/${tag}`} className="group w-fit">
            <div className="group-hover:text-priary-900 w-full rounded-xl border border-neutral-50 bg-neutral-50 px-6 py-3 transition-all duration-300 group-hover:border-primary-900 group-hover:bg-primary-100">
              <Body3 className="text-black">{tag}</Body3>
            </div>
          </Link>
        ))}
      </div>
    </SectionContainer>
  );
};
