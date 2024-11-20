import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const robots =
  process.env.APP_ENV != "production" ? "noindex, nofollow" : "index, follow";

// TOOD: Change this metadata
export const metadata: Metadata = {
  title: { default: "My App", template: "%s | My App" },
  description:
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint, porro.",
  authors: [{ name: "Ahsan Azizan", url: "https://ahsanzizan.xyz/" }],
  creator: "My Team",
  publisher: "My Publisher",
  openGraph: {
    images: `${process.env.URL}/logo-horizontal.png`,
  },
  keywords: ["my", "app"],
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
          className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
        >
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </NextAuthProvider>
  );
}
