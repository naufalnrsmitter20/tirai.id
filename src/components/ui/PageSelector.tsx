"use client";

import { Button } from "@/components/ui/button";
import { Body3 } from "@/components/ui/text";
import { PaginationMetadata } from "@/lib/paginator";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next-nprogress-bar";

export const PageSelector = ({
  meta: { currentPage, lastPage, next, prev },
}: {
  meta: PaginationMetadata;
}) => {
  const router = useRouter();

  return (
    <div className="mx-auto mt-[62px] flex w-full items-center justify-between md:w-fit md:justify-center md:gap-x-8">
      <div className="inline-flex gap-2">
        <Button
          size="icon"
          disabled={currentPage === 1}
          onClick={() => router.push(`?page=1`, { scroll: false })}
          className="group"
        >
          <ArrowLeftToLineIcon strokeWidth={1} />
        </Button>
        <Button
          size="icon"
          disabled={!Boolean(prev)}
          onClick={() => router.push(`?page=${prev}`, { scroll: false })}
          className="group"
        >
          <ChevronLeft strokeWidth={1} />
        </Button>
      </div>
      <Body3 className="text-neutral-500">
        Halaman {currentPage} dari {lastPage}
      </Body3>
      <div className="inline-flex gap-2">
        <Button
          size={"icon"}
          disabled={!Boolean(next)}
          onClick={() => router.push(`?page=${next}`, { scroll: false })}
          className="group"
        >
          <ChevronRight strokeWidth={1} />
        </Button>
        <Button
          size={"icon"}
          disabled={!Boolean(lastPage) || currentPage === lastPage}
          onClick={() => router.push(`?page=${lastPage}`, { scroll: false })}
          className="group"
        >
          <ArrowRightToLineIcon strokeWidth={1} />
        </Button>
      </div>
    </div>
  );
};
