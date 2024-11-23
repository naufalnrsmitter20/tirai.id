"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export function SearchInput({ searchTerm }: { searchTerm: string }) {
  const form = useForm({
    defaultValues: {
      search: searchTerm || "",
    },
  });

  const router = useRouter();

  function onSubmit(data: { search: string }) {
    const trimmedSearch = data.search.trim();
    const params: URLSearchParams = new URLSearchParams();
    if (trimmedSearch) {
      params.set("searchQuery", trimmedSearch);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </Form>
  );
}
