import NextAuthProvider from "@/components/provider/NextAuthProvider";
import ProgressBarProvider from "@/components/provider/ProgressBarProvider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Viewport } from "next";
import generalSansFont from "./fonts";
import "./globals.css";
import "./prosemirror.css";
import Script from "next/script";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SNAP_URL } from "@/lib/midtrans-client";

export { generateMetadata } from "@/lib/seo";

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
        {process.env.APP_ENV === "production" &&
          process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
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

export const dynamic = "force-dynamic";
