"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sanitizeInput } from "@/lib/utils";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

interface SearchFilterProps {
  title: string;
  tags: string;
}

export function SearchFilter({
  searchTerm,
  setTitle,
  setTags,
  saveFilters,
}: {
  searchTerm: SearchFilterProps;
  setTitle: (title: string) => void;
  setTags: (tags: string) => void;
  saveFilters: () => void;
}) {
  const form = useForm<SearchFilterProps>({
    defaultValues: {
      tags: searchTerm.tags || "",
      title: searchTerm.title || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveFilters();
        }}
        className="flex w-full items-center justify-between gap-x-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-1/2 flex-col space-y-2">
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    setTitle(sanitizeInput(e.target.value));
                    field.onChange(e);
                  }}
                  placeholder="Filter dengan judul"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-1/2 flex-col space-y-2">
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    setTags(sanitizeInput(e.target.value));
                    field.onChange(e);
                  }}
                  placeholder="Filter dengan tagar"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"default"}>
          <Search />
        </Button>
      </form>
    </Form>
  );
}
