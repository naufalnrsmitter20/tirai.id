import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
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
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              key={tag}
              href={`/article/tags/${tag}`}
              className={buttonVariants({ variant: "outline" })}
            >
              {tag}
            </Link>
          ))
        ) : (
          <Body3 className="text-neutral-500">
            Belum ada tagar apapun untuk hari ini...
          </Body3>
        )}
      </div>
    </SectionContainer>
  );
};
