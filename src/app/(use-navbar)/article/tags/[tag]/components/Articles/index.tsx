import { buttonVariants } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { PaginationMetadata } from "@/lib/paginator";
import { ArticleWithUser } from "@/types/entityRelations";
import { FC } from "react";
import { ArticleCard } from "./ArticleCard";
import { PageSelector } from "./PageSelector";

export const ArticlesResultDisplay: FC<{
  articles: ArticleWithUser[];
  meta: PaginationMetadata;
  tag: string;
}> = ({ articles, meta, tag }) => {
  return (
    <div id="articles-result" className="block">
      <H2 className="mb-16 flex items-center gap-x-4 text-black">
        Artikel dengan Tagar{" "}
        <span className={buttonVariants({ variant: "tag" })}>{tag}</span>
      </H2>
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-[62px] md:grid-cols-2 lg:grid-cols-3">
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
