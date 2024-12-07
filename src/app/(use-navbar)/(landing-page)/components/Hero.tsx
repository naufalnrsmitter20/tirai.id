"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, Display } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

const CAROUSEL_IMAGES: string[] = [
  "/assets/hero/image-3.jpg",
  "/assets/hero/image-1.jpg",
  "/assets/hero/image-2.jpg",
] as const;

export const Hero: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const changeSlideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);

    return () => clearInterval(changeSlideInterval);
  }, [currentSlide]);

  return (
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
            <Display className="mb-6 text-balance">
              Pilihan Tirai Terbaik untuk Rumah, Kantor, dan Bisnis Anda
            </Display>
            <Body3 className="mb-12 text-balance">
              Hadirkan suasana baru dengan gorden terbaik, dirancang untuk
              kenyamanan dan gaya modern Anda.
            </Body3>
            <div className="flex w-fit items-center gap-x-2">
              {Array.from({ length: CAROUSEL_IMAGES.length }).map(
                (_, index) => (
                  <button key={index} onClick={() => setCurrentSlide(index)}>
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
  );
};
