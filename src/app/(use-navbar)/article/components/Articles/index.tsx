import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H1, H5, H6 } from "@/components/ui/text";
import { PaginationMetadata } from "@/lib/paginator";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { PageSelector } from "./PageSelector";

type ArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: {
    author: true;
  };
}>;

const ArticleCard = ({ article }: { article: ArticleWithAuthor }) => {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="flex scale-100 flex-col gap-11 bg-none transition-all duration-300 hover:scale-105"
    >
      <Image
        src={article.cover_url}
        alt={article.title}
        unoptimized
        className="aspect-[2.25/1] w-full rounded-[20px] object-cover"
        width={500}
        height={150}
      />
      <div className="text-wrap pe-5">
        <H5 className="mb-[12px] text-wrap break-words text-black">
          {article.title}
        </H5>
        <H6 className="h-auto max-w-full text-wrap break-words text-[16px] text-neutral-500">
          {article.description}
        </H6>
      </div>
      <div className="flex flex-col gap-[2px]">
        <H5 className="text-wrap break-words font-medium text-black">
          {article.author.name}
        </H5>
        <Body3 className="text-neutral-500">
          {formatDate(article.published_at)}
        </Body3>
      </div>
    </Link>
  );
};

export const Articles = ({
  articles,
  meta,
}: {
  articles: ArticleWithAuthor[];
  meta: PaginationMetadata;
}) => {
  return (
    <SectionContainer className="">
      <H1 className="mb-[62px] text-black">Artikel Lainnya</H1>
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-[62px] sm:grid-cols-2 md:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((item) => <ArticleCard article={item} key={item.id} />)
        ) : (
          <Body3 className="text-neutral-500">
            Belum ada artikel untuk saat ini...
          </Body3>
        )}
      </div>
      <PageSelector meta={meta} />
    </SectionContainer>
  );
};
