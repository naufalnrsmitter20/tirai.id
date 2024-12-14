import NextAuthProvider from "@/components/provider/NextAuthProvider";
import ProgressBarProvider from "@/components/provider/ProgressBarProvider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import generalSansFont from "./fonts";
import "./globals.css";
import "./prosemirror.css";
import Script from "next/script";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SNAP_URL } from "@/lib/midtrans-client";

const robots =
  process.env.APP_ENV != "production" ? "noindex, nofollow" : "index, follow";

export const metadata: Metadata = {
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
    images: `${process.env.URL}/opengraph.png`,
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang="en">
        {process.env.APP_ENV === "production" && process.env.GA_ID && (
          <GoogleAnalytics gaId={process.env.GA_ID} />
        )}
        <Script
          src={MIDTRANS_SNAP_URL}
          data-client-key={MIDTRANS_CLIENT_KEY}
          async
        ></Script>
        <body
          className={`${generalSansFont.className} overflow-x-hidden bg-white antialiased`}
        >
          {children}
          <ProgressBarProvider />
          <Toaster />
        </body>
      </html>
    </NextAuthProvider>
  );
}
