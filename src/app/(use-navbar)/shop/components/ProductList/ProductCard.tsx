import { Body3, Body4, H4, H5 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { ProductCatalog } from "@/types/entityRelations";
import { Discount } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const ProductCard: FC<{
  product: ProductCatalog;
  discount?: Discount;
}> = ({ product, discount }) => {
  const finalPrice =
    product.price ||
    (product.variants.length > 0
      ? product.variants.sort((a, b) => a.price - b.price)[0].price
      : 0);

  const discountedPrice =
    discount && finalPrice
      ? finalPrice - finalPrice * (discount.discount_in_percent / 100)
      : finalPrice;

  return (
    <Link href={`/shop/product/${product.slug}`} className="group block w-full">
      <div className="relative h-fit w-full">
        <Image
          src={product.photos[0]}
          alt={`Gambar ${product.name}`}
          unoptimized
          className="mb-[1.375rem] aspect-video w-full rounded-[20px] object-cover"
          width={280}
          height={175}
        />
        {product.stock === 0 &&
          product.variants.reduce((prev, curr) => prev + curr.stock, 0) ===
            0 && (
            <Body3 className="absolute bottom-0 w-full rounded-b-[20px] bg-destructive py-2 text-center text-white">
              Sold Out
            </Body3>
          )}
      </div>
      <H4 className="mb-[1.375rem] line-clamp-1 text-black transition-all duration-300 group-hover:text-primary-900">
        {product.name}
      </H4>
      <Body3 className="mb-3 line-clamp-1 justify-start text-neutral-500">
        {product.description}
      </Body3>
      <H5 className="justify-start text-black">
        {formatRupiah(discountedPrice)}{" "}
      </H5>
      {discount && (
        <span className="inline-flex items-center gap-1">
          <Body3 className="justify-start text-black !line-through">
            {formatRupiah(finalPrice)}{" "}
          </Body3>
          <Body4 className="font-semibold text-red-500">
            {Math.round(discount.discount_in_percent)}%
          </Body4>
        </span>
      )}
    </Link>
  );
};
