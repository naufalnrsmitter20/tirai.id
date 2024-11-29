"use client";
import { SearchInput } from "./SearchInput";
import { SearchSelector } from "./SearchSelector";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "./DateRangePicker";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";

interface ArticleFilterLayoutProps {
  title: string;
  tags: string;
  sort: "latest" | "popular" | "";
  status: "all" | "published" | "archived" | "";
  start: Date;
  end: Date;
  page?: string;
}

export default function ArticleFilterLayout({
  searchData,
}: {
  searchData: ArticleFilterLayoutProps;
}) {
  const [searchTitle, setSearchTitle] = useState(searchData.title);
  const [searchTags, setSearchTags] = useState(searchData.tags);
  const [searchSort, setSearchSort] = useState(searchData.sort);
  const [searchStatus, setSearchStatus] = useState(searchData.status);
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchData.start,
    to: searchData.end,
  });

  const router = useRouter();

  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams();
    if (searchTitle) {
      const trimmedSearch = searchTitle.trim();
      params.set("title", trimmedSearch);
    }
    if (searchTags) {
      const trimmedSearch = searchTags.trim();
      params.set("tags", trimmedSearch);
    }
    if (searchSort) {
      params.set("sort", searchSort);
    }
    if (searchStatus) {
      params.set("status", searchStatus);
    }
    if (date?.from) {
      const formattedStartDate = new Date(date.from).toISOString();
      params.set("start", formattedStartDate);
    }
    if (date?.to) {
      const formattedEndDate = new Date(date.to).toISOString();
      params.set("end", formattedEndDate);
    }
    if (searchData.page) {
      params.set("page", searchData.page);
    }
    router.push(`?${params.toString()}`);
  }, [
    searchTitle,
    searchTags,
    searchSort,
    searchStatus,
    router,
    date,
    searchData.page,
  ]);

  function clearFilters() {
    setSearchTitle("");
    setSearchTags("");
    setSearchSort("");
    setSearchStatus("");
    setDate(undefined);
    router.push("?");
  }

  return (
    <div className="flex w-full flex-row flex-wrap gap-2">
      <Button variant="outline" onClick={clearFilters}>
        Clear Filters
      </Button>
      <DateRangePicker date={date} setDate={setDate} />
      <SearchSelector
        searchTerm={{ sort: searchSort, status: searchStatus }}
        setSort={setSearchSort}
        setStatus={setSearchStatus}
      />
      <SearchInput
        searchTerm={{ title: searchTitle, tags: searchTags }}
        setTags={setSearchTags}
        setTitle={setSearchTitle}
      />
    </div>
  );
}
