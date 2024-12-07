"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import { FC, useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./DateRangeFilter";
import { SearchFilter } from "./SearchFilter";
import { SelectFilter } from "./SelectFilter";

interface ArticleFilterProps {
  title: string;
  tags: string;
  sort: "latest" | "popular" | "";
  status: "all" | "published" | "archived" | "";
  start: Date;
  end: Date;
  page?: string;
}

export const ArticleFilter: FC<{
  searchData: ArticleFilterProps;
}> = ({ searchData }) => {
  const [searchTitle, setSearchTitle] = useState(searchData.title);
  const [searchTags, setSearchTags] = useState(searchData.tags);
  const [sortBy, setSortBy] = useState(searchData.sort);
  const [status, setStatus] = useState(searchData.status);
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchData.start,
    to: searchData.end,
  });

  const router = useRouter();

  const saveFilters = useCallback(() => {
    const params = new URLSearchParams();

    const appendIfExists = (key: string, value: string | undefined) => {
      if (value?.trim()) {
        params.append(key, value.trim());
      }
    };

    const appendDate = (key: string, dateValue?: Date) => {
      if (dateValue) {
        params.append(key, new Date(dateValue).toISOString());
      }
    };

    appendIfExists("title", searchTitle);
    appendIfExists("status", status);
    appendIfExists("tags", searchTags);
    appendIfExists("sort", sortBy);
    appendDate("start", date?.from);
    appendDate("end", date?.to);

    if (searchData.page) {
      params.append("page", searchData.page);
    }

    // Only save filters if there's date.from then there should be date.to, otherwise don't save filters
    if ((date?.from && date.to) || (!date?.from && !date?.to))
      router.push(`?${params.toString()}`);
  }, [
    searchTitle,
    status,
    searchTags,
    sortBy,
    date?.from,
    date?.to,
    searchData.page,
    router,
  ]);

  useEffect(() => {
    saveFilters();
  }, [sortBy, status, router, date, searchData.page, saveFilters]);

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center gap-x-2">
        <DateRangeFilter date={date} setDate={setDate} />
        <SearchFilter
          searchTerm={{ title: searchTitle, tags: searchTags }}
          setTags={setSearchTags}
          setTitle={setSearchTitle}
          saveFilters={saveFilters}
        />
      </div>
      <SelectFilter
        searchTerm={{ sort: sortBy, status: status }}
        setSort={setSortBy}
        setStatus={setStatus}
      />
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          setSearchTitle("");
          setSearchTags("");
          setSortBy("");
          setStatus("");
          setDate(undefined);
          router.push("?");
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
};
