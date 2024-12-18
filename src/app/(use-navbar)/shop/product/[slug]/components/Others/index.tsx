import { SectionContainer } from "@/components/layout/SectionContainer";
import { H3 } from "@/components/ui/text";
import { Prisma } from "@prisma/client";
import { FC } from "react";
import { ProductCard } from "./ProductCard";

type Product = Prisma.ProductGetPayload<{ include: { variants: true } }>;

export const Others: FC<{ title: string; products: Product[] }> = ({
  title,
  products,
}) => {
  return (
    <SectionContainer id="others">
      <H3 className="mb-12 text-black">{title}</H3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </SectionContainer>
  );
};
