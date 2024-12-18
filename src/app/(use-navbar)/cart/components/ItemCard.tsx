import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Body3, Body4, H3 } from "@/components/ui/text";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

export const ItemCard: FC<{ item: CartItem }> = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { editItem, removeItem } = useCart();

  return (
    <div className="flex w-full flex-row items-center justify-between py-6">
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
          <H3 className="line-clamp-1 text-black md:line-clamp-2">
            {item.name}
          </H3>
          {item.variantName && (
            <Body4 className="mt-1 text-neutral-500">{item.variantName}</Body4>
          )}
        </div>
      </div>
      <div className="flex h-full flex-col items-end justify-between">
        <Body3 className="mb-4 text-black">
          {formatRupiah(item.quantity * item.pricePerItem)}
        </Body3>
        <div className="flex items-center gap-x-4">
          <Select
            onValueChange={(value) => {
              setQuantity(Number(value));

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
                  length: item.quantity,
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
            onClick={() => {
              removeItem(item.id);
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
