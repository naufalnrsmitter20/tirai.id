"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body3, Display } from "@/components/ui/text";
import { sanitizeInput } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useState } from "react";

export const Hero: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  return (
    <SectionContainer className="text-center">
      <div className="flex flex-row justify-center gap-x-2">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.90328 6.4058L6.90329 6.40581L6.90704 6.40457L7.43104 6.23104C7.43166 6.23083 7.43216 6.23069 7.43255 6.23059C7.43514 6.23142 7.44314 6.23481 7.45277 6.24455C7.463 6.25487 7.46967 6.26699 7.47264 6.27726C7.47513 6.28589 7.47514 6.2929 7.47289 6.30093C7.41431 6.51022 7.35828 6.72747 7.30387 6.95235L7.30386 6.95234L7.30299 6.95605L6.32299 11.146L6.32295 11.1462C5.75862 13.5626 5.86305 15.5454 6.816 17.0844C7.76888 18.6232 9.49807 19.6018 11.9142 20.1764L11.9165 20.1769L12.2588 20.2565L11.4764 20.514C11.4759 20.5142 11.4755 20.5144 11.475 20.5145C9.5372 21.1391 8.18142 21.1472 7.1776 20.6336C6.17338 20.1197 5.38541 19.0143 4.75542 17.0755C4.75541 17.0755 4.75539 17.0755 4.75538 17.0754L3.47573 13.1265C3.47569 13.1264 3.47565 13.1263 3.47562 13.1261C2.85056 11.1873 2.83997 9.82836 3.3517 8.82298C3.86306 7.81833 4.96544 7.03059 6.90328 6.4058Z"
            stroke="black"
          />
          <path
            d="M15.8851 3.3061L15.8865 3.30642L17.5563 3.69638C17.5564 3.69639 17.5564 3.69641 17.5565 3.69642C19.6032 4.17515 20.8119 4.89347 21.4291 5.88812C22.0462 6.8828 22.1521 8.28348 21.6734 10.3254L20.6934 14.5054L20.6932 14.5062C20.2833 16.2677 19.6921 17.4131 18.9001 18.0909C18.125 18.7542 17.081 19.0334 15.608 18.8918L15.608 18.8918L15.6001 18.8911C15.1305 18.8535 14.6167 18.7684 14.0575 18.6335L14.056 18.6331L12.376 18.2331L12.3757 18.233C10.3384 17.7494 9.13119 17.0312 8.51367 16.037C7.89651 15.0433 7.7884 13.645 8.26698 11.6037L8.26704 11.6034L9.24689 7.41404C9.24692 7.41391 9.24695 7.41379 9.24698 7.41366C9.44209 6.58451 9.6715 5.88414 9.94885 5.32018L9.94886 5.32018L9.95033 5.31715C10.4909 4.19911 11.1906 3.5421 12.0995 3.22841C13.0317 2.90671 14.2557 2.9207 15.8851 3.3061ZM16.2735 13.4575L16.2736 13.4575L16.2753 13.4508C16.4414 12.7863 16.0427 12.1021 15.3613 11.9344L12.4534 11.1949L12.4514 11.1944C11.7897 11.029 11.1036 11.4242 10.9351 12.0983C10.7698 12.7597 11.1645 13.4454 11.8379 13.6143C11.8383 13.6144 11.8386 13.6145 11.8389 13.6146L14.747 14.3541L14.7729 14.3607L14.7995 14.3645C14.8056 14.3654 14.8125 14.3664 14.8202 14.3675C14.8754 14.3758 14.9679 14.3895 15.0602 14.3895C15.6204 14.3895 16.1238 14.0231 16.2735 13.4575ZM19.2035 10.0775L19.2036 10.0775L19.2059 10.068C19.3676 9.40535 18.9818 8.71093 18.2862 8.55312L13.4431 7.32486L13.4414 7.32445C12.7797 7.15901 12.0936 7.55424 11.9251 8.22825C11.7597 8.8897 12.1546 9.57549 12.828 9.74437C12.8283 9.74444 12.8286 9.74452 12.8289 9.74459L17.6773 10.9742L17.7031 10.9807L17.7295 10.9845C17.7356 10.9854 17.7425 10.9864 17.7502 10.9875C17.8054 10.9958 17.8979 11.0095 17.9902 11.0095C18.5504 11.0095 19.0538 10.6431 19.2035 10.0775Z"
            stroke="black"
          />
        </svg>
        <Body3 className="mb-3 text-black">Tips & Inspirasi</Body3>
      </div>
      <Display className="mb-6 text-black">
        Temukan Tips dan Inspirasi Seputar Tirai dan Desain Interior
      </Display>
      <Body3 className="mb-16 text-neutral-500">
        Dapatkan tips, panduan, dan tren terbaru untuk memilih tirai dan
        mendesain ruang yang indah dan fungsional
      </Body3>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const sanitizedSearchTerm = sanitizeInput(searchTerm);

          if (sanitizedSearchTerm !== "") {
            router.push(`/article/search?term=${sanitizedSearchTerm}`);
          }
        }}
        className="mx-auto flex w-full max-w-xl items-center justify-between gap-x-2"
      >
        <div className="w-[90%]">
          <Input
            placeholder="Cari artikel dari Tirai.id..."
            className="w-full"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <Button
          type="submit"
          className={buttonVariants({ variant: "default" })}
        >
          <Search />
        </Button>
      </form>
    </SectionContainer>
  );
};
