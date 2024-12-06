import { CTA } from "@/components/widget/CTA";
import { About } from "./components/About";
import { Custom } from "./components/Custom";
import { Fabric } from "./components/Fabric";
import { Hero } from "./components/Hero";
import { ProductTypes } from "./components/ProductTypes";
import { Products } from "./components/Products";
import { Testimonies } from "./components/Testimonies";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.APP_URL}`,
    },
    description: "E-Commerce tirai nomor 1 di Indonesia",
    publisher: {
      "@type": "Organization",
      name: "Tirai.id",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.APP_URL}/assets/logo.png`,
      },
    },
    keywords:
      "curtain, tirai, gorden, kain, ecommerce, online, toko, bisnis, beli, jual, buy, sell, pengiriman, kirim, tirai.id, Tiraid, Tiraiid, id",
    url: `${process.env.APP_URL}`,
    isAccessibleForFree: true,
    inLanguage: "id",
    about: {
      "@type": "OnlineStore",
      name: "Tirai.id",
    },
  };

  return (
    <>
      <Hero />
      <ProductTypes />
      <Products />
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
