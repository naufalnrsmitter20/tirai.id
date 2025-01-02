import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Body3, Body4, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { cn, formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { Discount, Prisma } from "@prisma/client";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const ItemCard: FC<{
  item: CartItem;
  quantities?: { id: string; quantity: number }[];
  setQuantities: Dispatch<
    SetStateAction<{ id: string; quantity: number }[] | undefined>
  >;
  product?: Prisma.ProductGetPayload<{ include: { variants: true } }>;
  discount?: Discount | null;
}> = ({ item, quantities, setQuantities, product, discount }) => {
  const { editItem, removeItem } = useCart();

  const itemVariant = useMemo(
    () => product?.variants.find((variant) => variant.id === item.variantId),
    [item.variantId, product?.variants],
  );
  const maxStock = useMemo(
    () => (itemVariant ? itemVariant.stock : product?.stock!), // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
    [product, itemVariant],
  );
  const quantity = useMemo(
    () => quantities?.find((q) => q.id === item.id)?.quantity || item.quantity,
    [item.id, item.quantity, quantities],
  );

  useEffect(() => {
    const init = () => {
      if (!product) return;

      const { stock, variants } = product;

      if (stock !== null) {
        setQuantities(
          quantities?.map((q) => {
            if (q.id === item.id) {
              return { ...q, quantity: Math.min(item.quantity, stock) };
            }

            return q;
          }),
        );
        return;
      }

      const variant = variants.find(({ id }) => id === item.variantId);
      if (variant) {
        setQuantities(
          quantities?.map((q) => {
            if (q.id === item.id) {
              return { ...q, quantity: Math.min(item.quantity, variant.stock) };
            }

            return q;
          }),
        );
      } else {
        setQuantities(
          quantities?.map((q) => {
            if (q.id === item.id) {
              return { ...q, quantity: item.quantity };
            }

            return q;
          }),
        );
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, product]);

  useEffect(() => {
    editItem(item.id, { quantity });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, item.id]);

  if (itemVariant === undefined && product === undefined) {
    return (
      <div
        className={cn(
          "pointer-events-none flex w-full flex-row items-center justify-between py-6 opacity-50",
        )}
      >
        <div className="flex w-full max-w-xs items-center gap-x-4 lg:max-w-fit">
          <Image
            src={item.photo}
            width={400}
            height={400}
            className="aspect-square size-24 rounded-md md:size-32"
            alt={`${item.name}'s Photo`}
            unoptimized
          />
          <div className="block">
            <Body4 className="text-black">
              {item.categoryName.replace(
                item.categoryName[0],
                item.categoryName[0].toUpperCase(),
              )}
            </Body4>
            <H3 className="text-black">{item.name}</H3>
            {item.variantName && (
              <Body4 className="mt-1 text-neutral-500">
                {item.variantName}
              </Body4>
            )}
          </div>
        </div>
        <div className="flex h-full flex-col items-end justify-between">
          {discount ? (
            <div className="mb-4">
              <Body3 className="text-primary-500">
                {formatRupiah(
                  quantity * item.pricePerItem -
                    (quantity *
                      item.pricePerItem *
                      discount.discount_in_percent) /
                      100,
                )}
              </Body3>
              <Body4 className="text-black line-through">
                {formatRupiah(quantity * item.pricePerItem)}
              </Body4>
            </div>
          ) : (
            <Body3 className="mb-4 text-black">
              {formatRupiah(quantity * item.pricePerItem)}
            </Body3>
          )}
          <Body3 className="text-destructive">Barang Invalid</Body3>
        </div>
      </div>
    );
  }

  if (maxStock === 0) {
    return (
      <div
        className={cn(
          "pointer-events-none flex w-full flex-row items-center justify-between py-6 opacity-50",
        )}
      >
        <div className="flex w-full max-w-xs items-center gap-x-4 lg:max-w-fit">
          <Image
            src={item.photo}
            width={400}
            height={400}
            className="aspect-square size-24 rounded-md md:size-32"
            alt={`${item.name}'s Photo`}
            unoptimized
          />
          <div className="block">
            <Body4 className="text-black">
              {item.categoryName.replace(
                item.categoryName[0],
                item.categoryName[0].toUpperCase(),
              )}
            </Body4>
            <Link href={`/shop/product/${product?.slug}`}>
              <H3 className="text-black">{item.name}</H3>
            </Link>
            {item.variantName && (
              <Body4 className="mt-1 text-neutral-500">
                {item.variantName}
              </Body4>
            )}
          </div>
        </div>
        <div className="flex h-full flex-col items-end justify-between">
          {discount ? (
            <div className="mb-4">
              <Body3 className="text-primary-500">
                {formatRupiah(
                  quantity * item.pricePerItem -
                    (quantity *
                      item.pricePerItem *
                      discount.discount_in_percent) /
                      100,
                )}
              </Body3>
              <Body4 className="text-black line-through">
                {formatRupiah(quantity * item.pricePerItem)}
              </Body4>
            </div>
          ) : (
            <Body3 className="mb-4 text-black">
              {formatRupiah(quantity * item.pricePerItem)}
            </Body3>
          )}
          <Body3 className="text-destructive">Stok Habis</Body3>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex w-full flex-row items-center justify-between py-6")}
    >
      <div className="flex w-full max-w-xs items-center gap-x-4 lg:max-w-fit">
        <Image
          src={item.photo}
          width={400}
          height={400}
          className="aspect-square size-24 rounded-md md:size-32"
          alt={`${item.name}'s Photo`}
          unoptimized
        />
        <div className="block">
          <Body4 className="text-black">
            {item.categoryName.replace(
              item.categoryName[0],
              item.categoryName[0].toUpperCase(),
            )}
          </Body4>
          <Link href={`/shop/product/${product?.slug}`}>
            <H3 className="text-black">{item.name}</H3>
          </Link>
          {item.variantName && (
            <Body4 className="mt-1 text-neutral-500">{item.variantName}</Body4>
          )}
        </div>
      </div>
      <div className="flex h-full flex-col items-end justify-between">
        {discount ? (
          <div className="mb-4">
            <Body3 className="text-primary-500">
              {formatRupiah(
                quantity * item.pricePerItem -
                  (quantity *
                    item.pricePerItem *
                    discount.discount_in_percent) /
                    100,
              )}
            </Body3>
            <Body4 className="text-black line-through">
              {formatRupiah(quantity * item.pricePerItem)}
            </Body4>
          </div>
        ) : (
          <Body3 className="mb-4 text-black">
            {formatRupiah(quantity * item.pricePerItem)}
          </Body3>
        )}
        <div className="flex items-center gap-x-4">
          <Select
            onValueChange={(value) => {
              setQuantities(
                quantities?.map((q) => {
                  if (q.id === item.id) {
                    return {
                      ...q,
                      quantity: Number(value),
                    };
                  }

                  return q;
                }),
              );
              editItem(item.id, { quantity: Number(value) });
            }}
            value={quantity.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{quantity}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                {
                  length: maxStock || 0,
                },
                (_, index) => index + 1,
              ).map((sortOption) => (
                <SelectItem key={sortOption} value={sortOption.toString()}>
                  {sortOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={async () => {
              const loadingToast = toast.loading("Loading...");

              await removeItem(item.id);

              toast.success("Berhasil menghapus barang dari keranjang!", {
                id: loadingToast,
              });
              return location.reload();
            }}
            className="text-black"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  );
};
