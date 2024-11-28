"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, Display, H3 } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "./components/navbar";
import { PageContainer } from "@/components/layout/PageContainer";

interface ProductType {
  icon: ReactNode;
  title: string;
  description: string;
}

const CAROUSEL_IMAGES: string[] = [
  "/assets/hero/image-3.jpg",
  "/assets/hero/image-1.jpg",
  "/assets/hero/image-2.jpg",
] as const;

const PRODUCT_TYPES: ProductType[] = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.9401 3.5H5.06006C4.65006 3.5 4.31006 3.16 4.31006 2.75C4.31006 2.34 4.65006 2 5.06006 2H18.9401C19.3501 2 19.6901 2.34 19.6901 2.75C19.6901 3.16 19.3501 3.5 18.9401 3.5Z"
          fill="#133E87"
        />
        <path
          d="M18.9401 22H5.06006C4.65006 22 4.31006 21.66 4.31006 21.25C4.31006 20.84 4.65006 20.5 5.06006 20.5H18.9401C19.3501 20.5 19.6901 20.84 19.6901 21.25C19.6901 21.66 19.3501 22 18.9401 22Z"
          fill="#133E87"
        />
        <path
          d="M2.75 8V16C2.75 17.66 4.09 19 5.75 19H18.25C19.91 19 21.25 17.66 21.25 16V8C21.25 6.34 19.91 5 18.25 5H5.75C4.09 5 2.75 6.34 2.75 8Z"
          fill="#133E87"
        />
      </svg>
    ),
    title: "Vertical Blind",
    description:
      "Tirai vertikal dengan 150+ pilihan warna dan motif yang cocok untuk desain ruangan Anda.",
  },
  {
    icon: (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 22H15.5C17.16 22 18.5 20.66 18.5 19V5C18.5 3.34 17.16 2 15.5 2H9.5C7.84 2 6.5 3.34 6.5 5V19C6.5 20.66 7.84 22 9.5 22Z"
          fill="#133E87"
        />
        <path
          d="M5 5.92996V18.07C5 18.39 4.71 18.62 4.4 18.56C2.92 18.29 2.5 17.43 2.5 15.33V8.66996C2.5 6.56996 2.92 5.70996 4.4 5.43996C4.71 5.37996 5 5.60996 5 5.92996Z"
          fill="#133E87"
        />
        <path
          d="M22.5 8.66996V15.33C22.5 17.43 22.08 18.29 20.6 18.56C20.29 18.62 20 18.38 20 18.07V5.92996C20 5.60996 20.29 5.37996 20.6 5.43996C22.08 5.70996 22.5 6.56996 22.5 8.66996Z"
          fill="#133E87"
        />
      </svg>
    ),
    title: "Smoking Tirai",
    description:
      "Tirai dengan gaya minimalis yang sangat cantik dan cocok untuk ruang di rumah Anda.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 21.25H2C1.59 21.25 1.25 21.59 1.25 22C1.25 22.41 1.59 22.75 2 22.75H22C22.41 22.75 22.75 22.41 22.75 22C22.75 21.59 22.41 21.25 22 21.25Z"
          fill="#133E87"
        />
        <path
          d="M17 2H7C4 2 3 3.79 3 6V22H9V15.94C9 15.42 9.42 15 9.94 15H14.07C14.58 15 15.01 15.42 15.01 15.94V22H21.01V6C21 3.79 20 2 17 2ZM14.5 9.25H12.75V11C12.75 11.41 12.41 11.75 12 11.75C11.59 11.75 11.25 11.41 11.25 11V9.25H9.5C9.09 9.25 8.75 8.91 8.75 8.5C8.75 8.09 9.09 7.75 9.5 7.75H11.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V7.75H14.5C14.91 7.75 15.25 8.09 15.25 8.5C15.25 8.91 14.91 9.25 14.5 9.25Z"
          fill="#133E87"
        />
      </svg>
    ),
    title: "Tirai Hospital",
    description:
      "Bermanfaat sebagai penyekat ruangan, membatasi antara pasien, menjaga privasi pasien, dan lainnya.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.8 2.23998L12.8 3.83998C12.33 3.92998 12 4.33999 12 4.81999V9.99999C12 10.55 12.45 11 13 11H21C21.55 11 22 10.55 22 9.99999V3.21999C22 2.58999 21.42 2.11998 20.8 2.23998Z"
          fill="#133E87"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.8 21.76L12.8 20.16C12.33 20.07 12 19.66 12 19.18V14C12 13.45 12.45 13 13 13H21C21.55 13 22 13.45 22 14V20.78C22 21.41 21.42 21.88 20.8 21.76Z"
          fill="#133E87"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.78998 4.55996L2.78998 5.82995C2.32998 5.92995 2 6.33996 2 6.80996V9.99996C2 10.55 2.45 11 3 11H9C9.55 11 10 10.55 10 9.99996V5.52996C10 4.89996 9.40998 4.41996 8.78998 4.55996Z"
          fill="#133E87"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.78998 19.44L2.78998 18.17C2.32998 18.07 2 17.66 2 17.19V14C2 13.45 2.45 13 3 13H9C9.55 13 10 13.45 10 14V18.47C10 19.1 9.40998 19.58 8.78998 19.44Z"
          fill="#133E87"
        />
      </svg>
    ),
    title: "Roller Blind",
    description:
      "Tirai dengan model penyimpanan kain menggulung di atas/bawah.",
  },
  {
    icon: (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 22H15.5C17.16 22 18.5 20.66 18.5 19V5C18.5 3.34 17.16 2 15.5 2H9.5C7.84 2 6.5 3.34 6.5 5V19C6.5 20.66 7.84 22 9.5 22Z"
          fill="#133E87"
        />
        <path
          d="M5 5.92996V18.07C5 18.39 4.71 18.62 4.4 18.56C2.92 18.29 2.5 17.43 2.5 15.33V8.66996C2.5 6.56996 2.92 5.70996 4.4 5.43996C4.71 5.37996 5 5.60996 5 5.92996Z"
          fill="#133E87"
        />
        <path
          d="M22.5 8.66996V15.33C22.5 17.43 22.08 18.29 20.6 18.56C20.29 18.62 20 18.38 20 18.07V5.92996C20 5.60996 20.29 5.37996 20.6 5.43996C22.08 5.70996 22.5 6.56996 22.5 8.66996Z"
          fill="#133E87"
        />
      </svg>
    ),
    title: "Horizontal Blind",
    description:
      "Tirai penutup jendela dan pengatur cahaya secara horizontal, minimalis.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 3.5H5.49998C5.18998 3.5 4.88999 3.65 4.69999 3.9L3.19999 5.9C2.70999 6.56 3.17998 7.5 3.99998 7.5H18.5C18.81 7.5 19.11 7.35 19.3 7.1L20.8 5.1C21.29 4.44 20.82 3.5 20 3.5Z"
          fill="#133E87"
        />
        <path
          d="M3.99998 10H18.5C18.81 10 19.11 10.15 19.3 10.4L20.8 12.4C21.29 13.06 20.82 14 20 14H5.49998C5.18998 14 4.88999 13.85 4.69999 13.6L3.19999 11.6C2.70999 10.94 3.17998 10 3.99998 10Z"
          fill="#133E87"
        />
        <path
          d="M20 16.5H5.49998C5.18998 16.5 4.88999 16.65 4.69999 16.9L3.19999 18.9C2.70999 19.56 3.17998 20.5 3.99998 20.5H18.5C18.81 20.5 19.11 20.35 19.3 20.1L20.8 18.1C21.29 17.44 20.82 16.5 20 16.5Z"
          fill="#133E87"
        />
      </svg>
    ),
    title: "Roman Shades",
    description:
      "Fashion blinds simpel, mewah, dan praktis untuk memperindah ruangan Anda.",
  },
] as const;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Change current slide every 5 seconds
  useEffect(() => {
    const changeSlideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);

    return () => clearInterval(changeSlideInterval);
  }, [currentSlide]);

  return (
    <>
      <Navbar />
      <PageContainer className="pt-[5.375rem]">
        <SectionContainer id="hero" className="max-w-screen-2xl">
          <div className="relative h-[582px] overflow-hidden rounded-[1.25rem]">
            <div
              className="flex h-full w-full transition-transform duration-300"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {CAROUSEL_IMAGES.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  width={1440}
                  height={582}
                  alt={`Hero Image ${index + 1}`}
                  className="h-full w-full flex-shrink-0 object-cover"
                  priority
                />
              ))}
            </div>
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-[48%]">
              <div className="flex flex-col items-center px-6 py-[7.375rem] text-center sm:px-12 md:px-[8.625rem]">
                <div className="mb-3 flex items-center gap-2">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 19.9V4.1C10.75 2.6 10.11 2 8.52 2H4.48C2.89 2 2.25 2.6 2.25 4.1V19.9C2.25 21.4 2.89 22 4.48 22H8.52C10.11 22 10.75 21.4 10.75 19.9Z"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.25 19.9V4.1C22.25 2.6 21.61 2 20.02 2H15.98C14.39 2 13.75 2.6 13.75 4.1V19.9C13.75 21.4 14.39 22 15.98 22H20.02C21.61 22 22.25 21.4 22.25 19.9Z"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <Body3>Tirai Berkualitas Global</Body3>
                </div>
                <Display className="mb-6">
                  Pilihan Tirai Terbaik untuk Rumah, Kantor, dan Bisnis Anda
                </Display>
                <Body3 className="mb-12">
                  Hadirkan suasana baru dengan gorden terbaik, dirancang untuk
                  kenyamanan dan gaya modern Anda.
                </Body3>
                <div className="flex w-fit items-center gap-x-2">
                  {Array.from({ length: CAROUSEL_IMAGES.length }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <div
                          className={cn(
                            "rounded-full bg-white transition-all duration-300",
                            currentSlide === index
                              ? "size-[0.625rem] bg-opacity-100"
                              : "size-2 bg-opacity-[28%]",
                          )}
                        ></div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
        <SectionContainer id="product-types">
          <div className="grid w-full gap-x-6 gap-y-[4.5rem] lg:grid-cols-3">
            {PRODUCT_TYPES.map((productType) => (
              <div
                key={productType.title}
                className="flex w-full flex-col rounded-xl bg-neutral-50 px-[1.125rem] py-[1.8125rem]"
              >
                <div className="mb-9 w-fit rounded-full bg-primary-50 p-6">
                  {productType.icon}
                </div>
                <div className="text-black">
                  <H3 className="mb-3">{productType.title}</H3>
                  <Body3 className="mb-6 text-neutral-500">
                    {productType.description}
                  </Body3>
                  <Link
                    href={"#"}
                    className={buttonVariants({
                      variant: "link",
                      size: "link",
                    })}
                  >
                    Beli sekarang <ArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
