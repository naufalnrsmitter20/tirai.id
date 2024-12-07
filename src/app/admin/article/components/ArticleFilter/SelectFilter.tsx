"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface SortFormValues {
  sort: "latest" | "popular" | "";
  status: "all" | "published" | "archived" | "";
}

export const SelectFilter: React.FC<{
  searchTerm: SortFormValues;
  setSort: (sort: SortFormValues["sort"]) => void;
  setStatus: (sort: SortFormValues["status"]) => void;
}> = ({ searchTerm, setSort, setStatus }) => {
  const form = useForm<SortFormValues>({
    defaultValues: {
      sort: searchTerm.sort || "",
      status: searchTerm.status || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex w-full items-center justify-between space-x-2"
      >
        <FormField
          control={form.control}
          name="sort"
          render={({ field }) => (
            <FormItem className="w-full">
              <Select
                onValueChange={(value) => {
                  const sortValue = value as SortFormValues["sort"];
                  field.onChange(sortValue);
                  setSort(sortValue);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["latest", "popular"].map((sortOption) => (
                    <SelectItem key={sortOption} value={sortOption}>
                      {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <Select
                onValueChange={(value) => {
                  const statusValue = value as SortFormValues["status"];
                  setStatus(statusValue);
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["all", "published", "archived"].map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption.charAt(0).toUpperCase() +
                        statusOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
