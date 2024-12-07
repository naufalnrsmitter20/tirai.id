import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H1 } from "@/components/ui/text";
import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { ArticlesResultDisplay } from "./components/Articles";

const paginate = paginator({ perPage: 6 });

export default async function ArticlesByTag({
  params,
  searchParams,
}: {
  params: Promise<{ tag?: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag: paramTag } = await params;
  const { page: paramPage } = await searchParams;

  if (!paramTag) return notFound();

  const tag = decodeURIComponent(paramTag);

  let page = paramPage ? Number(paramPage) : 1;
  if (page < 0) page = 1;

  const paginatedArticles = await paginate<
    Prisma.ArticleGetPayload<{
      include: {
        author: { select: { name: true; role: true } };
      };
    }>,
    Prisma.ArticleFindManyArgs
  >(
    prisma.article,
    { page },
    {
      where: {
        is_published: true,
        tags: { has: tag },
      },
      include: { author: { select: { name: true, role: true } } },
    },
  );
  if (
    (paginatedArticles.meta.lastPage !== 0 &&
      page > paginatedArticles.meta.lastPage) ||
    paginatedArticles.data.length === 0
  ) {
    return notFound();
  }

  return (
    <PageContainer>
      <SectionContainer id="filter-by-tag-result">
        <div className="mb-20 flex flex-col items-center justify-center">
          <H1 className="mb-4 text-black">{tag}</H1>
          <div className="flex items-center gap-x-3 text-neutral-500">
            <Body3>Tagar</Body3>
            <div className="size-0.5 rounded-full bg-black"></div>
            <Body3>{paginatedArticles.meta.total} Artikel</Body3>
            <div className="size-0.5 rounded-full bg-black"></div>
            <Body3>
              {paginatedArticles.data.reduce(
                (prev, curr) => prev + curr.views,
                0,
              )}{" "}
              view
            </Body3>
          </div>
        </div>
        <ArticlesResultDisplay
          articles={paginatedArticles.data}
          meta={paginatedArticles.meta}
          tag={tag}
        />
      </SectionContainer>
    </PageContainer>
  );
}
