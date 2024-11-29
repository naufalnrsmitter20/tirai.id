import { PageContainer } from "@/components/layout/PageContainer";
import { findArticle } from "@/utils/database/article.query";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;

  const article = await findArticle({ slug });

  const previousImages = (await parent).openGraph?.images || [];

  if (!article)
    return {
      title: "Article Not Found",
      description:
        "The article that you're looking for is not found in our website.",
    };

  return {
    title: `${article.title} - ${article.author.name}`,
    openGraph: {
      type: "article",
      title: `${article?.title} - ${article?.author.name}`,
      images: [article?.cover_url, ...previousImages],
      publishedTime: article.published_at.toISOString(),
      description: article.description || undefined,
      url: `${process.env.APP_URL}/article/${article.slug}`,
    },
    authors: {
      name: article.author.name,
    },
    creator: article.author.name,
    description: article.description,
    keywords: article.tags,
    alternates: {
      canonical: `${process.env.APP_URL}/article/${article.slug}`,
    },
    robots: {
      index: true,
      nocache: false,
      follow: true,
      "max-image-preview": "large",
      googleBot: {
        index: true,
        follow: true,
      },
    },
    other: {
      news_keywords: `${article.published_at.toLocaleDateString("ID-ID", { day: "numeric", month: "long", year: "numeric" })} ${article?.description} ${article?.tags.join(", ")}`,
      "googlebot-news": "index,follow",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await findArticle({ slug });

  console.log(article);

  return (
    <PageContainer>
      <div></div>
    </PageContainer>
  );
}
