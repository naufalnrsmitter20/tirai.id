import { buttonVariants } from "@/components/ui/button";
import { Body3, H3 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import Link from "next/link";
import { FC } from "react";

export const Tags: FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <div id="tags-result" className="block w-full lg:max-w-screen-sm">
      <SectionTitle>Tagar</SectionTitle>
      <H3 className="mb-8 text-black">Hasil Pencarian untuk Tagar</H3>
      <div className="flex w-full flex-wrap items-center gap-x-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              key={tag}
              href={`/article/tags/${tag}`}
              className={buttonVariants({
                variant: "tag",
                size: "link",
              })}
            >
              {tag}
            </Link>
          ))
        ) : (
          <Body3 className="text-neutral-500">
            Tidak ada tagar yang ditemukan...
          </Body3>
        )}
      </div>
    </div>
  );
};
