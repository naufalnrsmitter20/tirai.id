"use client";

import { Button } from "@/components/ui/button";
import { Body3 } from "@/components/ui/text";
import { PaginationMetadata } from "@/lib/paginator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next-nprogress-bar";

export const PageSelector = ({
  meta: { currentPage, lastPage, next, prev },
  term,
}: {
  meta: PaginationMetadata;
  term: string;
}) => {
  const router = useRouter();

  return (
    <div className="mx-auto mt-[62px] flex w-full items-center justify-between md:w-fit md:justify-center md:gap-x-8">
      <Button
        size="icon"
        disabled={!Boolean(prev)}
        onClick={() =>
          router.push(`/article/search?term=${term}&page=${prev}`, {
            scroll: false,
          })
        }
        className="group"
      >
        <ChevronLeft strokeWidth={1} />
      </Button>
      <Body3 className="text-neutral-500">
        Halaman {currentPage} dari {lastPage}
      </Body3>
      <Button
        size={"icon"}
        disabled={!Boolean(next)}
        onClick={() =>
          router.push(`/article/search?term=${term}&page=${next}`, {
            scroll: false,
          })
        }
        className="group"
      >
        <ChevronRight strokeWidth={1} />
      </Button>
    </div>
  );
};
