import { Body3, H1 } from "@/components/ui/text";
import { ArticleWithUser } from "@/types/entityRelations";
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { Calendar, Eye, User } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

export const ArticleContent: FC<{ article: ArticleWithUser }> = ({
  article,
}) => {
  return (
    <article className="mx-auto block w-full">
      <header>
        <H1 className="mb-4 text-4xl font-bold text-black" id="headline">
          {article.title}
        </H1>
        <div className="mb-4 flex items-center space-x-4 text-gray-600">
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
        {article.description && (
          <Body3 className="mb-6 text-xl text-gray-600" id="summary">
            {article.description}
          </Body3>
        )}
        <div className="mb-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Image
          src={article.cover_url}
          alt={article.title}
          width={1200}
          height={630}
          className="object-fit mb-12 w-full rounded-lg"
          unoptimized
        />
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
