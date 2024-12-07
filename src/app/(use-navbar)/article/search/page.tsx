import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { H1 } from "@/components/ui/text";
import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { cn, sanitizeInput } from "@/lib/utils";
import { findTags } from "@/utils/database/article.query";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArticlesResultDisplay } from "./components/Articles";
import { SearchBar } from "./components/SearchBar";
import { Tags } from "./components/Tags";

const paginate = paginator({ perPage: 6 });

export const metadata: Metadata = {
  title: "Cari Artikel",
  description: "Cari artikel dari Tirai.id",
};

export default async function SearchArticles({
  searchParams,
}: {
  searchParams: Promise<{ term?: string; page?: string }>;
}) {
  // The term can't be undefined, if it is then we redirect the user to /article
  const { term: searchTerm, page: paramPage } = await searchParams;
  if (!searchTerm) return redirect("/article");

  let page = paramPage ? Number(paramPage) : 1;
  if (page < 0) page = 1;

  const sanitizedSearchterm = sanitizeInput(searchTerm);

  const tags = await findTags(searchTerm);

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
        OR: sanitizedSearchterm.split(" ").map((term) => ({
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { tags: { hasSome: tags } },
          ],
        })),
      },
      include: { author: { select: { name: true, role: true } } },
    },
  );
  if (
    paginatedArticles.meta.lastPage !== 0 &&
    page > paginatedArticles.meta.lastPage
  ) {
    return notFound();
  }

  return (
    <PageContainer>
      <SectionContainer id="search-articles">
        <div className="block w-full">
          <H1 className="mb-6 text-black">
            Hasil Pencarian untuk{" "}
            <span className="text-primary-900">&quot;{searchTerm}&quot;</span>
          </H1>
          <SearchBar defaultValue={searchTerm} />

          <div
            id="search-result"
            className={cn(
              "mt-20 flex w-full flex-col items-start justify-between gap-y-20 lg:flex-row",
            )}
          >
            <ArticlesResultDisplay
              articles={paginatedArticles.data}
              meta={paginatedArticles.meta}
              term={searchTerm}
            />
            <Tags tags={tags} />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
