import { CTA } from "@/components/widget/CTA";
import prisma from "@/lib/prisma";
import { About } from "./components/About";
import { Custom } from "./components/Custom";
import { Fabric } from "./components/Fabric";
import { Hero } from "./components/Hero";
import { ProductTypes } from "./components/ProductTypes";
import { Products } from "./components/Products";
import { Testimonies } from "./components/Testimonies";

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL}`,
    },
    description: "E-Commerce tirai nomor 1 di Indonesia",
    publisher: {
      "@type": "Organization",
      name: "Tirai.id",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/logo.png`,
      },
    },
    keywords:
      "curtain, tirai, gorden, kain, ecommerce, online, toko, bisnis, beli, jual, buy, sell, pengiriman, kirim, tirai.id, Tiraid, Tiraiid, id",
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    isAccessibleForFree: true,
    inLanguage: "id",
    about: {
      "@type": "OnlineStore",
      name: "Tirai.id",
    },
  };

  const [categories, products] = await prisma.$transaction([
    prisma.productCategory.findMany({ take: 6 }),
    prisma.product.findMany({
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        is_published: true,
        stock: true,
        price: true,
        photos: true,
        created_at: true,
        updated_at: true,
        variants: {
          select: {
            stock: true,
            price: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    }),
  ]);

  return (
    <>
      <Hero />
      <ProductTypes
        categories={categories.map((category) => ({
          title: category.name,
          href: `/shop?categories=${category.id}`,
        }))}
      />
      <Products products={products} />
      <Custom />
      <About />
      <Fabric />
      <Testimonies />
      <CTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
