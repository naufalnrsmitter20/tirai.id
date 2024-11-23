"use client";
import { SearchInput } from "./SearchInput";
export default function ArticleFilterLayout({
  searchData,
}: {
  searchData: string;
}) {
  return (
    <div>
      <SearchInput searchTerm={searchData} />
    </div>
  );
}
