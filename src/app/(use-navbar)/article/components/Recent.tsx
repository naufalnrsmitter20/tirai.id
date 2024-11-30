import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body1, Body3, H1, H3, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Recent = (data: {
  cover: string;
  title: string;
  slug: string;
  authorName: string;
  content: string;
  published_at: Date;
  tags: string[];
}) => {
  const { cover, tags, title, slug, authorName, content, published_at } = data;

  return (
    <SectionContainer id="recent-article">
      <div className="flex flex-col">
        <SectionTitle>Artikel</SectionTitle>
        <H1 className="mb-16 text-black">Artikel Terbaru</H1>
        <div className="grid grid-cols-1 gap-11 md:grid-cols-2">
          <Image
            src={cover}
            alt="Postingan Artikel Terbaru"
            width={560}
            height={345}
            unoptimized
            className="w-full rounded-[12px] object-cover"
          />
          <div className="mt-11 flex max-w-full flex-col lg:mt-0 lg:justify-between">
            <div className="mb-10 block lg:mb-0">
              <H3 className="mb-3 text-black">{title}</H3>
              <div className="mb-6 flex flex-wrap items-center gap-x-2">
                {tags.map((tag) => (
                  <Link href={`/`}>
                    <Body1 key={tag} className="text-primary-800">
                      {tag}
                    </Body1>
                  </Link>
                ))}
              </div>
              <Body3 className="line-clamp-4 text-neutral-500">{content}</Body3>
            </div>
            <div className="flex flex-col items-start justify-between gap-y-8 md:flex-row lg:items-center lg:gap-0">
              <div className="flex flex-col justify-between gap-y-0.5">
                <H5 className="text-black">{authorName}</H5>
                <Body3 className="text-neutral-500">
                  {formatDate(published_at)}
                </Body3>
              </div>
              <Link
                href={`/article/view/${slug}`}
                className={buttonVariants({
                  variant: "default",
                  className: "w-full md:w-fit md:flex-grow-0",
                })}
              >
                Baca sekarang <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
