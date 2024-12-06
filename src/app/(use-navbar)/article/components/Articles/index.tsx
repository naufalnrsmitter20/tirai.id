import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H1 } from "@/components/ui/text";
import { PaginationMetadata } from "@/lib/paginator";
import { ArticleWithUser } from "@/types/entityRelations";
import { FC } from "react";
import { ArticleCard } from "./ArticleCard";
import { PageSelector } from "@/components/ui/PageSelector";
import { SectionTitle } from "@/components/widget/SectionTitle";

export const ArticlesDisplay: FC<{
  articles: ArticleWithUser[];
  meta: PaginationMetadata;
}> = ({ articles, meta }) => {
  return (
    <SectionContainer id="articles">
      <SectionTitle>Artikel</SectionTitle>
      <H1 className="mb-[62px] text-black">Artikel Dari Kami</H1>
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-[62px] md:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((item) => <ArticleCard article={item} key={item.id} />)
        ) : (
          <Body3 className="text-neutral-500">
            Belum ada artikel untuk saat ini...
          </Body3>
        )}
      </div>
      {meta.lastPage > 0 && <PageSelector meta={meta} />}
    </SectionContainer>
  );
};
