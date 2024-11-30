import { buttonVariants } from "@/components/ui/button";
import { Body3, H1 } from "@/components/ui/text";
import { ArticleWithUser } from "@/types/entityRelations";
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { Calendar, Eye, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ShareButton } from "./ShareButton";

export const ArticleContent: FC<{
  article: ArticleWithUser;
  shareData: ShareData;
}> = ({ article, shareData }) => {
  return (
    <article className="mx-auto block w-full max-w-screen-md">
      <header className="mb-7 border-b border-neutral-400 pb-7">
        <Image
          src={article.cover_url}
          alt={article.title}
          width={1200}
          height={345}
          className="h-[345px] w-full rounded-lg object-cover"
          unoptimized
        />
        <div className="my-5 flex flex-wrap items-center gap-x-5">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/article/tags/${tag}`}
              className={buttonVariants({ variant: "tag", size: "link" })}
            >
              {tag}
            </Link>
          ))}
        </div>
        <H1 className="mb-4 text-4xl font-bold text-black" id="headline">
          {article.title}
        </H1>
        <div className="mb-6 flex flex-row items-start justify-between gap-y-4 text-gray-600 md:items-center">
          <div className="flex flex-col items-start gap-x-4 md:flex-row md:items-center">
            <span className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              {article.author.name}
            </span>
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(article.published_at), "MMMM d, yyyy")}
            </span>
            <span className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              {article.views}
            </span>
          </div>
          <ShareButton shareData={shareData} />
        </div>
        {article.description && (
          <Body3 className="text-xl text-gray-600" id="summary">
            {article.description}
          </Body3>
        )}
      </header>
      <section id="article-content">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article.content),
          }}
        />
      </section>
    </article>
  );
};
