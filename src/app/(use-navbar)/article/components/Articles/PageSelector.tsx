"use client";

import { Button } from "@/components/ui/button";
import { PaginationMetadata } from "@/lib/paginator";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

const PageButton = ({
  page,
  onClick,
  currentPage,
}: {
  page: number;
  currentPage: number;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className={`inline-flex aspect-square h-10 w-10 items-center justify-center rounded-[10px] border transition-all duration-300 ${page === currentPage ? "border-primary-900 bg-primary-900 text-white" : "border-neutral-500 bg-none text-neutral-500 hover:bg-neutral-500 hover:text-white"}`}
      onClick={onClick}
    >
      {page}
    </button>
  );
};

export const PageSelector = ({
  meta: { currentPage, lastPage, next, prev },
}: {
  meta: PaginationMetadata;
}) => {
  const router = useRouter();
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className="mt-[62px] flex w-full justify-between">
      <Button
        disabled={!Boolean(prev)}
        onClick={() => router.push(`?page=${prev}`, { scroll: false })}
        className="group"
      >
        <MoveLeft
          strokeWidth={1}
          className="transition-all duration-300 group-hover:-translate-x-[5px]"
        />
        Sebelumnya
      </Button>
      <div className="flex gap-[10px]">
        {pages.map((i) => (
          <PageButton
            onClick={() => router.push(`?page=${i}`, { scroll: false })}
            page={i}
            key={i}
            currentPage={currentPage}
          />
        ))}
      </div>
      <Button
        disabled={!Boolean(next)}
        onClick={() => router.push(`?page=${next}`, { scroll: false })}
        className="group"
      >
        Selanjutnya
        <MoveRight
          strokeWidth={1}
          className="transition-all duration-300 group-hover:translate-x-[5px]"
        />
      </Button>
    </div>
  );
};
