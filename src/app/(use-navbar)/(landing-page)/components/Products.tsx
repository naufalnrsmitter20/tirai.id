import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { Body3, Body4, H1, H5 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { getServerSession } from "@/lib/next-auth";
import { formatRupiah } from "@/lib/utils";
import { ProductCatalog } from "@/types/entityRelations";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const Products: FC<{ products: ProductCatalog[] }> = async ({
  products,
}) => {
  const session = await getServerSession();
  const discount =
    session && session.user
      ? await findDiscountByRole(session?.user?.role)
      : null;

  return (
    <SectionContainer id="products">
      <div className="mb-[3.375rem] flex w-full flex-col items-start justify-between gap-y-4 md:items-end lg:flex-row lg:gap-0">
        <div className="w-full lg:max-w-[70%]">
          <SectionTitle>Produk</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
            Temukan Keindahan, Kenyamanan dan Tirai Berkualitas Disini
          </H1>
        </div>
        <Link
          href={"/shop"}
          className={buttonVariants({
            variant: "link",
            size: "link",
          })}
        >
          Temukan lebih banyak <ArrowRight />
        </Link>
      </div>
      <ul className="no-scrollbar flex w-full snap-x snap-mandatory items-start justify-between gap-6 overflow-x-auto pb-10">
        {products && products.length > 0 ? (
          products.map((product) => {
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
              <li
                key={product.id}
                className="flex w-[85%] flex-none snap-start flex-col items-center md:w-[40%] lg:w-[23%]"
              >
                <div className="w-full">
                  <Image
                    src={product.photos[0]}
                    alt={product.name}
                    width={273}
                    height={304}
                    className="mb-11 min-h-[19rem] w-full rounded-[1.25rem] object-cover"
                    unoptimized
                  />
                  <div className="flex flex-col items-start text-black">
                    <Link href={`/shop/product/${product.slug}`}>
                      <H5 className="mb-3">{product.name}</H5>
                    </Link>
                    <Body3 className="mb-5 line-clamp-2 text-neutral-500">
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
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <Body3 className="text-neutral-500">
            Belum ada produk yang tersedia...
          </Body3>
        )}
      </ul>
    </SectionContainer>
  );
};
