import { getArticleBySlug } from "@/actions/articles";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { findArticle } from "@/utils/database/article.query";
import { ChevronLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "./components/ArticleContent";

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
      url: `${process.env.APP_URL}/article/view/${article.slug}`,
    },
    authors: {
      name: article.author.name,
    },
    creator: article.author.name,
    description: article.description,
    keywords: [
      "Tirai.id",
      "Gorden Murah",
      "Tirai Indonesia",
      ...article.tags,
      ...article.title.split(" "),
    ],
    alternates: {
      canonical: `${process.env.APP_URL}/article/view/${article.slug}`,
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
    publisher: "Tirai.id",
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
  const response = await getArticleBySlug(slug, "view");
  const data = response.data;

  if (!data || !data.article) return notFound();

  const { article } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.APP_URL}/article/view/${article.slug}`,
    },
    headline: article.title,
    description: article.description,
    image: [article.cover_url],
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Tirai.id",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.APP_URL}/assets/logo.png`,
      },
    },
    datePublished: article.published_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    articleSection: "Interior Design",
    keywords: article.tags.join(", "),
    wordCount: article.content.split(" ").length,
    url: `${process.env.APP_URL}/article/view/${article.slug}`,
    isAccessibleForFree: true,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#headline", "#summary"],
    },
    inLanguage: "id",
    about: {
      "@type": "Thing",
      name: "Interior Design",
    },
    thumbnailUrl: article.cover_url,
  };

  return (
    <PageContainer>
      <SectionContainer id="article">
        <ArticleContent
          article={article}
          shareData={{
            url: `${process.env.APP_URL}/article/view/${article.slug}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </SectionContainer>
    </PageContainer>
  );
}
