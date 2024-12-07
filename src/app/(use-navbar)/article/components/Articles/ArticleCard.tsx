import { buttonVariants } from "@/components/ui/button";
import { Body3, H4 } from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import { ArticleWithUser } from "@/types/entityRelations";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const ArticleCard: FC<{ article: ArticleWithUser }> = ({ article }) => {
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
        <div className="mb-6 flex flex-wrap items-center gap-x-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className={buttonVariants({ variant: "tag", size: "link" })}
            >
              {tag}
            </span>
          ))}
        </div>
        <H4 className="mb-4 text-wrap break-words text-black transition-colors duration-300 group-hover:text-primary-900">
          {article.title}
        </H4>
        <Body3 className="line-clamp-3 text-neutral-500">
          {article.description}
        </Body3>
      </div>
      <div className="flex flex-col gap-[2px]">
        <Body3 className="text-wrap break-words font-medium text-black">
          {article.author.name}
        </Body3>
        <Body3 className="text-neutral-500">
          {formatDate(article.published_at!)}
        </Body3>
      </div>
    </Link>
  );
};
