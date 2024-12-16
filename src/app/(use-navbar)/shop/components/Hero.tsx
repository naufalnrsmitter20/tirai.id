"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H3 } from "@/components/ui/text";
import { sanitizeInput } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";

const SORT_BY_VALUES = [
  "Best Selling",
  "Alphabetically, A-Z",
  "Alphabetically, Z-A",
  "Price, low-high",
  "Price, high-low",
  "Date, old-new",
  "Date, new-old",
];

export const Hero: FC = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  return (
    <SectionContainer id="header">
      <div className="relative h-[482px] w-full overflow-hidden rounded-2xl md:h-[302px]">
        <Image
          src={"/assets/shop.jpg"}
          width={1268}
          height={502}
          alt="Heading Image"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-6 left-1/2 w-full max-w-[90%] -translate-x-1/2 rounded-2xl bg-white p-6">
          <H3 className="mb-5 text-balance text-black">
            Cari dan Filter Produk-produk dari Tirai.id
          </H3>
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const sanitizedSearchTerm = sanitizeInput(searchTerm);

                if (sanitizedSearchTerm !== "") {
                  const currentParams = new URLSearchParams(searchParams);

                  currentParams.set("term", sanitizedSearchTerm);
                  router.push(`/shop?${currentParams.toString()}`);
                }
              }}
              className="flex w-full items-center justify-between gap-x-2 md:w-[75%]"
            >
              <div className="w-[90%]">
                <Input
                  placeholder="Cari produk dari Tirai.id..."
                  className="w-full"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  defaultValue={searchParams.get("term") || ""}
                />
              </div>
              <Button
                type="submit"
                className={buttonVariants({ variant: "default" })}
              >
                <Search />
              </Button>
            </form>
            <div className="w-full md:w-[20%]">
              <Select
                onValueChange={(value) => {
                  const currentParams = new URLSearchParams(searchParams);

                  currentParams.set("sortBy", value);
                  router.push(`/shop?${currentParams.toString()}`);
                }}
                defaultValue={searchParams.get("sortBy") || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Diurutkan berdasarkan..." />
                </SelectTrigger>
                <SelectContent>
                  {SORT_BY_VALUES.map((sortOption) => (
                    <SelectItem key={sortOption} value={sortOption}>
                      {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
