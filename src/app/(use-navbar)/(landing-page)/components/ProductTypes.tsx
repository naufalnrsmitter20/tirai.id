"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { H3 } from "@/components/ui/text";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Category {
  title: string;
  href: string;
}

export const ProductTypes: FC<{ categories: Category[] }> = ({
  categories,
}) => {
  return (
    <SectionContainer id="product-types">
      <div className="grid w-full gap-x-6 gap-y-[4.5rem] lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.title}
            className="flex w-full flex-col rounded-xl bg-neutral-50 px-[1.125rem] py-[1.8125rem]"
          >
            <div className="mb-9 w-fit rounded-full bg-primary-50 p-6">
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
            </div>
            <div className="text-black">
              <H3 className="mb-3">{category.title}</H3>
              <Link
                href={category.href}
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
  );
};
