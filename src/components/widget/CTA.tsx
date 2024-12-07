import Image from "next/image";
import { FC } from "react";
import { SectionContainer } from "../layout/SectionContainer";
import { Body3, Display } from "../ui/text";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ShoppingCart } from "lucide-react";

export const CTA: FC<{ className?: string }> = ({ className }) => {
  return (
    <SectionContainer id="CTA" className={className}>
      <div className="relative h-[520px] w-full overflow-hidden rounded-xl">
        <Image
          src={"/assets/CTA.jpeg"}
          alt="Call To Action"
          width={1164}
          height={426}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-0 top-0 z-[800] flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-75">
          <div className="max-w-screen-md text-center">
            <div className="mb-3 flex items-center justify-center gap-x-2 text-white">
              <ShoppingCart />
              <Body3>Belanja di Tirai.id</Body3>
            </div>
            <Display className="mb-12 text-balance text-white">
              Bikin Ruanganmu Jadi Lebih <span className="italic">Stylish</span>{" "}
              Sekarang Juga!
            </Display>

            {/* TODO: Change this into the e-commerce path */}
            <Link
              href={"#"}
              className={buttonVariants({
                variant: "default",
                size: "lg",
              })}
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
