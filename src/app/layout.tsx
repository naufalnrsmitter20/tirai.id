import NextAuthProvider from "@/components/provider/NextAuthProvider";
import ProgressBarProvider from "@/components/provider/ProgressBarProvider";
import { buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Body3 } from "@/components/ui/text";
import { email, phoneNumber } from "@/constants/content";
import { NAV_ITEMS } from "@/constants/main-nav-items";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import generalSansFont from "./fonts";
import "./globals.css";

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
        <body
          className={`${generalSansFont.className} overflow-x-hidden bg-white antialiased`}
        >
          {children}
          <ProgressBarProvider />
          <Toaster />
          <footer
            id="footer"
            className="mx-auto w-full max-w-screen-xl px-6 pb-8 pt-[5.125rem] md:px-12"
          >
            <div className="flex h-full flex-col items-start gap-y-[72px] lg:flex-row lg:justify-between lg:gap-y-0">
              <div className="flex h-full flex-col items-start gap-y-[22px] lg:h-[155px] lg:justify-between">
                <Image
                  src={"/assets/logo-trimmed.png"}
                  alt="Logo Tirai.id"
                  width={100.37}
                  height={38}
                  className="h-auto w-[6.3rem]"
                />
                <Body3 className="text-black">
                  &copy; {new Date().getFullYear()} Pengembang Tirai.id
                </Body3>
              </div>
              <div className="w-full lg:max-w-[598px]">
                <div className="mb-11 flex w-full max-w-[598px] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-0 lg:mb-0">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={buttonVariants({
                        variant: "link",
                        size: "link",
                      })}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-y-1">
                  <Body3 className="text-neutral-500">OFFICE:</Body3>
                  <ul className="flex list-decimal flex-col gap-y-0.5 pl-5 text-neutral-500">
                    <li>
                      <Body3>
                        Jl. Semanggi Timur Kav 1A, Jati Mulyo, Lowokwaru, Malang
                      </Body3>
                    </li>
                    <li>
                      <Body3>
                        Pertokoan Kartika Niaga, Jalan Kebraon 5 Ruko Blok GC
                        12, Kebraon, Karangpilang, Surabaya
                      </Body3>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-full max-w-[214px]">
                {/* TOOD: Change this into an actual contact of Tirai.id */}
                <div className="mb-5 flex items-center gap-x-3">
                  <Link href={`https://wa.me/${phoneNumber}`}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.98 11.41C21.64 5.60995 16.37 1.13996 10.3 2.13996C6.11998 2.82996 2.76999 6.21994 2.11999 10.3999C1.73999 12.8199 2.24001 15.1099 3.33001 16.9999L2.43999 20.3099C2.23999 21.0599 2.92998 21.7399 3.66998 21.5299L6.92999 20.63C8.40999 21.5 10.14 21.9999 11.99 21.9999C17.63 21.9999 22.31 17.03 21.98 11.41ZM16.88 15.7199C16.79 15.8999 16.68 16.07 16.54 16.23C16.29 16.5 16.02 16.7 15.72 16.82C15.42 16.95 15.09 17.01 14.74 17.01C14.23 17.01 13.68 16.89 13.11 16.64C12.53 16.39 11.96 16.0599 11.39 15.6499C10.81 15.2299 10.27 14.7599 9.74999 14.2499C9.22999 13.7299 8.76997 13.1799 8.34997 12.6099C7.93997 12.0399 7.60999 11.4699 7.36999 10.8999C7.12999 10.3299 7.01 9.77996 7.01 9.25996C7.01 8.91996 7.06999 8.58996 7.18999 8.28996C7.30999 7.97996 7.50001 7.69996 7.77001 7.44996C8.09001 7.12996 8.43999 6.97996 8.80999 6.97996C8.94999 6.97996 9.08996 7.00995 9.21996 7.06995C9.34996 7.12995 9.46999 7.21995 9.55999 7.34995L10.72 8.98994C10.81 9.11994 10.88 9.22994 10.92 9.33994C10.97 9.44994 10.99 9.54994 10.99 9.64994C10.99 9.76994 10.95 9.88996 10.88 10.01C10.81 10.13 10.72 10.2499 10.6 10.3699L10.22 10.7699C10.16 10.8299 10.14 10.8899 10.14 10.9699C10.14 11.0099 10.15 11.0499 10.16 11.0899C10.18 11.1299 10.19 11.16 10.2 11.1899C10.29 11.36 10.45 11.5699 10.67 11.8299C10.9 12.0899 11.14 12.3599 11.4 12.6199C11.67 12.8899 11.93 13.1299 12.2 13.3599C12.46 13.5799 12.68 13.73 12.85 13.82C12.88 13.83 12.91 13.8499 12.94 13.8599C12.98 13.8799 13.02 13.88 13.07 13.88C13.16 13.88 13.22 13.85 13.28 13.79L13.66 13.41C13.79 13.28 13.91 13.19 14.02 13.13C14.14 13.06 14.25 13.0199 14.38 13.0199C14.48 13.0199 14.58 13.0399 14.69 13.0899C14.8 13.1399 14.92 13.2 15.04 13.29L16.7 14.4699C16.83 14.5599 16.92 14.67 16.98 14.79C17.03 14.92 17.06 15.0399 17.06 15.1799C17 15.3499 16.96 15.5399 16.88 15.7199Z"
                        fill="#0D0D0D"
                      />
                    </svg>
                  </Link>
                  <Link href={`mailto:${email}`}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
                        fill="#0D0D0D"
                      />
                    </svg>
                  </Link>
                </div>
                <Link
                  href={`mailto:${email}`}
                  className={buttonVariants({ variant: "link", size: "link" })}
                >
                  {email}
                </Link>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </NextAuthProvider>
  );
}
