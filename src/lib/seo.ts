import { getSeoPageByPath } from "@/utils/database/seo.query";
import { Metadata } from "next";
import { ResolvedTwitterMetadata } from "next/dist/lib/metadata/types/twitter-types";
import { headers } from "next/headers";

const APP_ENV = process.env.APP_ENV || "development";
const BASE_URL = process.env.URL || "http://localhost";

const robots = APP_ENV !== "production" ? "noindex, nofollow" : "index, follow";

type SeoData = {
  title?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalURL?: string | null;
  twitterCard?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
};

export const metadata = {
  title: {
    default:
      "Tirai.id - Produsen dan pemasar gorden bermerek terkemuka dengan jangkauan global",
    template: "%s | Tirai.id",
  },
  description:
    "Kami menyediakan gorden ready stock dan dalam kemasan, tersedia di pasar modern seperti Giant dan Marco, serta melalui pemasaran MLM Sophie Paris (Sophie Martin). Target kami adalah kalangan menengah modern minimalis, namun tetap terbuka untuk kalangan atas dengan gaya klasik.",
  authors: [{ name: "MokletDev", url: "https://dev.moklet.org/" }],
  creator: "MokletDev",
  openGraph: {
    images: `${BASE_URL}/opengraph.png`,
  },
  keywords: [
    // Short
    "gorden",
    "tirai",
    "tirai.id",
    "yumindo",
    "gorden murah",
    "yumindo.net",
    "gorden kantor",
    "gorden surabaya",
    "jual gorden murah",
    "yumindo.co.id",
    "jual gorden",
    "jual tirai",
    "curtain",
    "classy curtain",

    // Utama (Primary Keywords)
    "Gorden Ready Stock",
    "Gordyn dalam kemasan",
    "Gorden Sophie Martin",
    "Gorden Sophie Paris",
    "Jual Gorden Modern Minimalis",
    "Gorden Pasar Modern",
    "Gorden Giant dan Marco",

    // Pendukung (Secondary Keywords)
    "Gorden Minimalis",
    "Gorden Klasik",
    "Gorden Murah Berkualitas",
    "Gorden untuk Rumah Modern",
    "Jual Gorden Online",
    "Gorden Eksklusif untuk Ruang Tamu",
    "Gorden Rumah Minimalis",

    // Long-Tail Keywords
    "Jual gorden minimalis untuk rumah modern",
    "Gorden klasik untuk rumah mewah",
    "Gorden ready stock murah dan berkualitas",
    "Gorden dalam kemasan di Giant dan Marco",
    "Pilihan gorden modern minimalis terbaru",

    // Lokal
    "Gorden Ready Stock Surabaya Malang",
    "Jual Gorden Minimalis di Surabaya Malang",
    "Toko Gorden di Surabaya Malang",

    // Brand-Specific Keywords
    "Gorden Sophie Paris original",
    "Sophie Martin gordyn collection",
    "Produk gorden di Sophie Paris",
  ],
  robots,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const headersList = await headers();
    const referer = headersList.get("x-next-pathname");

    const seoData: SeoData | null = referer
      ? await getSeoPageByPath(referer)
      : null;

    const resolveMeta = <T>(value: T | undefined | null, fallback: T): T =>
      value !== undefined && value !== null ? value : fallback;

    const resolveImages = (imageUrl?: string | null, alt?: string | null) => {
      if (!imageUrl) return undefined;
      return [{ url: imageUrl, alt: alt || "Image" }];
    };

    return {
      title: resolveMeta(seoData?.title, metadata.title.default),
      description: resolveMeta(seoData?.description, metadata.description),
      keywords: resolveMeta(seoData?.keywords, metadata.keywords),
      openGraph: {
        title: resolveMeta(seoData?.ogTitle, metadata.title.default),
        description: resolveMeta(seoData?.ogDescription, metadata.description),
        url: seoData?.canonicalURL || undefined,
        images: resolveImages(seoData?.ogImage, seoData?.ogTitle),
      },
      twitter: {
        card: resolveMeta(
          seoData?.twitterCard,
          "summary",
        ) as ResolvedTwitterMetadata["card"],
        title: resolveMeta(seoData?.ogTitle, metadata.title.default),
        description: resolveMeta(
          seoData?.twitterDescription,
          seoData?.description || metadata.description,
        ),
        images: resolveImages(seoData?.twitterImage, seoData?.ogTitle),
      },
    };
  } catch (error) {
    console.error({
      message: "Error generating metadata",
      error,
    });
    return metadata;
  }
}
