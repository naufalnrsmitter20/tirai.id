import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H1, H4 } from "@/components/ui/text";
import { PaginationMetadata } from "@/lib/paginator";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { PageSelector } from "./PageSelector";

type ArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: {
    author: true;
  };
}>;

const ArticleCard: FC<{ article: ArticleWithAuthor }> = ({ article }) => {
  return (
    <Link
      href={`/article/view/${article.slug}`}
      className="group flex flex-col gap-11 bg-none transition-all duration-300 hover:scale-105"
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
        <H4 className="mb-3 text-wrap break-words text-black transition-colors duration-300 group-hover:text-primary-900">
          {article.title}
        </H4>
        <div className="mb-4 flex flex-wrap items-center gap-x-2">
          {article.tags.map((tag) => (
            <Body3 key={tag} className="text-primary-800">
              {tag}
            </Body3>
          ))}
        </div>
        <Body3 className="line-clamp-3 text-neutral-500">
          {article.description}
        </Body3>
      </div>
      <div className="flex flex-col gap-[2px]">
        <Body3 className="text-wrap break-words font-medium text-black">
          {article.author.name}
        </Body3>
        <Body3 className="text-neutral-500">
          {formatDate(article.published_at)}
        </Body3>
      </div>
    </Link>
  );
};

export const ArticlesDisplay: FC<{
  articles: ArticleWithAuthor[];
  meta: PaginationMetadata;
}> = ({ articles, meta }) => {
  return (
    <SectionContainer className="">
      <H1 className="mb-[62px] text-black">Artikel Lainnya</H1>
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-[62px] md:grid-cols-2 lg:grid-cols-3">
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
