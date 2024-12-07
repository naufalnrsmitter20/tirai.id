"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanitizeInput } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useState } from "react";

export const SearchBar: FC<{ defaultValue?: string }> = ({ defaultValue }) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(defaultValue || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const sanitizedSearchTerm = sanitizeInput(searchTerm);

        if (sanitizedSearchTerm !== "") {
          router.push(`/article/search?term=${sanitizedSearchTerm}`);
        }
      }}
      className="mx-auto flex w-full items-center justify-between gap-x-2"
    >
      <div className="w-[95%]">
        <Input
          placeholder="Cari artikel dari Tirai.id..."
          className="w-full"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value={searchTerm}
        />
      </div>
      <Button type="submit" className={buttonVariants({ variant: "default" })}>
        <Search />
      </Button>
    </form>
  );
};
