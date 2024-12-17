"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Body3, H5 } from "@/components/ui/text";
import { cn, formatNumber, parseNumberInput } from "@/lib/utils";
import { ProductCategory } from "@prisma/client";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";

export const Filter: FC<{
  availableCategories: ProductCategory[];
  isOpen: boolean;
}> = ({ availableCategories, isOpen }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || [],
  );
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get("minPrice") || "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get("maxPrice") || "",
  );

  const handleCheckboxChange = (checked: boolean | string, itemId: string) => {
    setCategories((prev) =>
      checked !== "indeterminate" && checked !== false
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId),
    );

    const previousParams = new URLSearchParams(searchParams);
    if ([...categories, itemId].length > 0) {
      previousParams.set(
        "categories",
        checked !== "indeterminate" && checked !== false
          ? [...categories, itemId].join(",")
          : categories.filter((id) => id !== itemId).join(","),
      );
    } else {
      previousParams.delete("categories");
    }

    router.push(`?${previousParams.toString()}`);
  };

  return (
    <div
      className={cn(
        "mb-6 w-full flex-col gap-y-7 overflow-hidden transition-all duration-300 md:mb-0 md:w-[35%]",
        isOpen ? "flex" : "hidden",
      )}
    >
      <div className="block">
        <H5 className="mb-3 text-black">Kategori</H5>
        <div className="itmes-start flex flex-col gap-y-2">
          {availableCategories.map((category) => (
            <div className="flex items-center gap-x-2" key={category.id}>
              <Checkbox
                checked={categories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked, category.id)
                }
              />
              <Label className="text-neutral-500">{category.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="block">
        <H5 className="mb-3 text-black">Harga</H5>
        <form
          className="block"
          onSubmit={(e) => {
            e.preventDefault();

            const previousParams = new URLSearchParams(searchParams);
            previousParams.set(
              "minPrice",
              parseNumberInput(minPrice!).toString(),
            );
            previousParams.set(
              "maxPrice",
              parseNumberInput(maxPrice!).toString(),
            );

            return router.push(`?${previousParams.toString()}`);
          }}
        >
          <div className="mb-3 flex w-full flex-col items-center gap-y-3">
            <div className="w-full">
              <Label className="text-neutral-500">Min (Rp.)</Label>
              <Input
                className="w-full"
                type="text"
                onChange={(e) => {
                  setMinPrice(formatNumber(e.target.value));
                }}
                value={minPrice}
              />
            </div>
            <Body3 className="w-full text-center text-neutral-500">
              Hingga
            </Body3>
            <div className="w-full">
              <Label className="text-neutral-500">Max (Rp.)</Label>
              <Input
                className="w-full"
                type="text"
                onChange={(e) => {
                  setMaxPrice(formatNumber(e.target.value));
                }}
                value={maxPrice}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Apply
          </Button>
        </form>
      </div>
      <div className="block">
        <H5 className="mb-3 text-black">Ketersediaan</H5>
        <RadioGroup
          defaultValue={searchParams.get("availability") || undefined}
          className="text-black"
          onValueChange={(e) => {
            const previousParams = new URLSearchParams(searchParams);
            previousParams.set("availability", e);

            router.push(`?${previousParams.toString()}`);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-stock" id="in-stock" />
            <Label htmlFor="in-stock">In-stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="out-of-stock" id="out-of-stock" />
            <Label htmlFor="out-of-stock">Out of Stock</Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        variant={"outline"}
        onClick={() => {
          setMinPrice("");
          setMaxPrice("");
          setCategories([]);

          return router.push("/shop");
        }}
        className="w-full"
      >
        Reset Filter
      </Button>
    </div>
  );
};
