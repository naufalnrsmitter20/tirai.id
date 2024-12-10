"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Body1, Body3, Body4 } from "@/components/ui/text";
import { ProductWithCategoryReviewsVariants } from "@/types/entityRelations";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import Link from "next/link";

export const ProductCard = ({
  data,
  changePublishStatus,
  isLoading,
}: {
  data: ProductWithCategoryReviewsVariants;
  changePublishStatus: (
    id: string,
    status: boolean,
  ) => Promise<string | number | undefined>;
  isLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-neutral-100 px-4 py-3 text-black">
      <Image
        src={
          data.variants.length > 0 && data.variants[0].photo
            ? data.variants[0].photo
            : "https://www.rallis.com/Upload/Images/thumbnail/Product-inside.png"
        }
        alt={`Gambar ${data.name}`}
        width={200}
        height={100}
        unoptimized
        className="h-[200px] w-full rounded-lg object-cover"
      />
      <div className="mb-6 mt-3">
        <Body1>{data.name}</Body1>
        <Body3>{data.category.name}</Body3>
        <Body4>{data.reviews.length} Review</Body4>
      </div>
      <div className="inline-flex w-full gap-1">
        <Button
          className="flex-shrink"
          disabled={isLoading}
          onClick={async () => {
            return await changePublishStatus(data.id, !data.is_published);
          }}
        >
          {data.is_published ? <EyeClosed /> : <Eye />}
        </Button>
        <Link
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
          href={`/admin/shop/product/${data.id}`}
        >
          Edit
        </Link>
      </div>
    </div>
  );
};
