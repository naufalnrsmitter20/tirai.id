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
import { useSearchParams } from "next/navigation";

export const PageSelector = ({
  meta: { currentPage, lastPage, next, prev },
}: {
  meta: PaginationMetadata;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="mx-auto mt-[62px] flex w-full items-center justify-between md:w-fit md:justify-center md:gap-x-8">
      <div className="inline-flex gap-2">
        <Button
          size="icon"
          disabled={currentPage === 1}
          onClick={() => {
            const previousParams = new URLSearchParams(searchParams);
            previousParams.set("page", "1");

            router.push(`?${previousParams.toString()}`, { scroll: false });
          }}
          className="group"
        >
          <ArrowLeftToLineIcon strokeWidth={1} />
        </Button>
        <Button
          size="icon"
          disabled={!Boolean(prev)}
          onClick={() => {
            const previousParams = new URLSearchParams(searchParams);
            previousParams.set("page", prev!.toString());

            router.push(`?${previousParams.toString()}`, { scroll: false });
          }}
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
          size="icon"
          disabled={!Boolean(next)}
          onClick={() => {
            const previousParams = new URLSearchParams(searchParams);
            previousParams.set("page", next!.toString());

            router.push(`?${previousParams.toString()}`, { scroll: false });
          }}
          className="group"
        >
          <ChevronRight strokeWidth={1} />
        </Button>
        <Button
          size="icon"
          disabled={!Boolean(lastPage) || currentPage === lastPage}
          onClick={() => {
            const previousParams = new URLSearchParams(searchParams);
            previousParams.set("page", lastPage.toString());

            router.push(`?${previousParams.toString()}`, { scroll: false });
          }}
          className="group"
        >
          <ArrowRightToLineIcon strokeWidth={1} />
        </Button>
      </div>
    </div>
  );
};
