import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    select: { slug: true, updated_at: true },
  });

  return [
    { url: `${process.env.URL}/`, lastModified: new Date().toISOString() },
    {
      url: `${process.env.URL}/article`,
      lastModified: new Date().toISOString(),
    },
    ...articles.map(({ slug, updated_at }) => ({
      url: `${process.env.APP_URL}/article/${slug}`,
      lastModified: updated_at.toISOString(),
    })),
  ];
}

// Revalidate every 7.2 seconds
export const revalidate = 7200;
