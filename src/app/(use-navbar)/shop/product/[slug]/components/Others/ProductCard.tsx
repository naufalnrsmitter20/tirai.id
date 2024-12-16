import { Body3, H4, H5 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Product = Prisma.ProductGetPayload<{ include: { variants: true } }>;

export const ProductCard: FC<{ product: Product }> = ({ product }) => {
  return (
    <Link href={`/shop/product/${product.slug}`} className="group block w-full">
      <Image
        src={product.photos[0]}
        alt={`Gambar ${product.name}`}
        unoptimized
        className="mb-[1.375rem] aspect-video w-full rounded-[20px] object-cover"
        width={280}
        height={175}
      />
      <H4 className="mb-[1.375rem] line-clamp-1 text-black transition-all duration-300 group-hover:text-primary-900">
        {product.name}
      </H4>
      <Body3 className="mb-3 line-clamp-1 justify-start text-neutral-500">
        {product.description}
      </Body3>
      {(product.price || product.variants.length > 0) && (
        <H5 className="justify-start text-black">
          {formatRupiah(
            product.price ||
              product.variants.sort((a, b) => a.price - b.price)[0].price,
          )}{" "}
          {product.stock === 0 &&
            product.variants.reduce((prev, curr) => prev + curr.stock, 0) ===
              0 && <span className="text-destructive">(Sold Out)</span>}
        </H5>
      )}
    </Link>
  );
};
