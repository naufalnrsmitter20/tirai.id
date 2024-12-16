"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body1 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { PaginatedResult } from "@/lib/paginator";
import { ProductCatalog } from "@/types/entityRelations";
import { ProductCategory } from "@prisma/client";
import { FC, useState } from "react";
import { Filter } from "./Filter";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProductList: FC<{
  categories: ProductCategory[];
  paginatedProducts: PaginatedResult<ProductCatalog>;
}> = ({ paginatedProducts, categories: availableCategories }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SectionContainer id="products">
      {paginatedProducts.meta.total === 0 && (
        <Body1 className="w-full text-center text-neutral-500">
          Tidak ada produk yang tersedia...
        </Body1>
      )}
      <Button
        variant={"link"}
        className="mb-6 w-fit p-0"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <SlidersHorizontal /> {isOpen ? "Hide" : "Show"} Filter
      </Button>
      <div
        className={cn(
          "flex w-full flex-col items-start justify-between md:flex-row",
          isOpen && "gap-8",
        )}
      >
        <Filter availableCategories={availableCategories} isOpen={isOpen} />
        {paginatedProducts.meta.total !== 0 && (
          <div className="w-full">
            <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <PageSelector meta={paginatedProducts.meta} />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};
