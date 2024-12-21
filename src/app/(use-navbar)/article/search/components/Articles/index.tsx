import { Body3, H2 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { PaginationMetadata } from "@/lib/paginator";
import { ArticleWithUser } from "@/types/entityRelations";
import { FC } from "react";
import { ArticleCard } from "./ArticleCard";

export const ArticlesResultDisplay: FC<{
  articles: ArticleWithUser[];
  meta: PaginationMetadata;
  term: string;
}> = ({ articles, meta }) => {
  return (
    <div id="articles-result" className="block lg:max-w-screen-md">
      <SectionTitle>Artikel</SectionTitle>
      <H2 className="mb-16 text-black">Hasil Pencarian untuk Artikel</H2>
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-[62px] md:grid-cols-2">
        {articles.length > 0 ? (
          articles.map((item) => <ArticleCard article={item} key={item.id} />)
        ) : (
          <Body3 className="text-neutral-500">
            Tidak ada artikel yang ditemukan...
          </Body3>
        )}
      </div>
      {meta.lastPage > 0 && <PageSelector meta={meta} />}
    </div>
  );
};
