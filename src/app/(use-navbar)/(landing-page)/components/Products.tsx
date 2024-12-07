"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, H1, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { formatRupiah } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Product {
  id: string;
  photo: string;
  name: string;
  description: string;
  price: number;
}

// TODO: Remove these dummy products and replace it with an actual list of products using server action
const PRODUCTS: Product[] = [
  {
    id: "1",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with the actual path or URL to the image above
    name: "Light Beige Minimalist Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
    price: 350000,
  },
  {
    id: "2",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with a relevant image path
    name: "Classic White Wooden Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
    price: 450000,
  },
  {
    id: "3",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with a relevant image path
    name: "Blackout Roller Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
    price: 550000,
  },
  {
    id: "4",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Jyuci2UNsnAXRLH2z59jaMMTGPIf1yyGmA&s", // Replace with a relevant image path
    name: "Custom Pattern Fabric Window Blind",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula",
    price: 700000,
  },
];

export const Products: FC<{ products?: Product[] }> = (
  { products } = { products: PRODUCTS },
) => {
  return (
    <SectionContainer id="products">
      <div className="mb-[3.375rem] flex w-full flex-col items-start justify-between gap-y-4 md:items-end lg:flex-row lg:gap-0">
        <div className="w-full lg:max-w-[70%]">
          <SectionTitle>Produk</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
            Temukan Keindahan, Kenyamanan dan Kualitas Tirai Disini
          </H1>
        </div>
        {/* TODO: Change this to the e-commerce route */}
        <Link
          href={"#"}
          className={buttonVariants({
            variant: "link",
            size: "link",
          })}
        >
          Temukan lebih banyak <ArrowRight />
        </Link>
      </div>
      <ul className="no-scrollbar flex w-full snap-x snap-mandatory items-start justify-between gap-6 overflow-x-auto pb-10">
        {products && products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.id}
              className="flex w-[85%] flex-none snap-start flex-col items-center md:w-[40%] lg:w-[23%]"
            >
              <div className="w-full">
                <Image
                  src={product.photo}
                  alt={product.name}
                  width={273}
                  height={304}
                  className="mb-11 min-h-[19rem] w-full rounded-[1.25rem] object-cover"
                  unoptimized
                />
                <div className="flex flex-col items-start text-black">
                  {/* TODO: Change the href into actual product detail */}
                  <Link href={"#"}>
                    <H5 className="mb-3">{product.name}</H5>
                  </Link>
                  <Body3 className="mb-5 text-neutral-500">
                    {product.description}
                  </Body3>
                  <H5>{formatRupiah(product.price)}</H5>
                </div>
              </div>
            </li>
          ))
        ) : (
          <Body3 className="text-neutral-500">
            Belum ada produk yang tersedia...
          </Body3>
        )}
      </ul>
    </SectionContainer>
  );
};
