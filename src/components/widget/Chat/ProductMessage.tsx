import { buttonVariants } from "@/components/ui/button";
import { Body4, Body5 } from "@/components/ui/text";
import { Message } from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import { ChatProduct, ChatUser } from "@/types/entityRelations";
import { CheckCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ProductMessageCard = ({
  message,
  isUser,
  participants,
  className,
  product,
}: {
  message: Message;
  isUser: boolean;
  participants?: ChatUser[];
  className?: string;
  product: ChatProduct;
}) => {
  return (
    <>
      {isUser ? (
        <figure
          key={message.id}
          className={cn(
            "relative ms-auto w-full rounded-lg bg-green-500 px-2 py-2 text-white",
            className,
          )}
        >
          <div className="flex h-auto w-full items-center justify-center gap-x-2">
            <Image
              alt={message.id}
              src={product.photos[0]}
              unoptimized
              width={75}
              height={760}
              className="aspect-square h-[75px] rounded-lg"
            />
            <div className="w-full">
              <Body4 className="font-semibold">{product.name}</Body4>
              <Body5>{product.category.name}</Body5>
            </div>
          </div>
          <div className="w-full">
            <Link
              href={`/shop/product/${product.slug}`}
              target="_blank"
              className={buttonVariants({
                variant: "default",
                className: "mb-3 mt-2 w-full",
              })}
            >
              Buka produk
            </Link>
            <div className="absolute bottom-0 right-0 flex items-end gap-[2px] p-1">
              <CheckCheck
                size={12}
                className={cn(
                  message.is_read
                    ? "text-white opacity-100"
                    : "text-neutral-400 opacity-85",
                )}
              />
            </div>
          </div>
        </figure>
      ) : (
        <figure
          key={message.id}
          className={cn(
            "relative mt-5 !w-full rounded-lg bg-neutral-400 px-2 py-2 text-white",
            participants &&
              participants.findIndex((i) => i.id === message.sender_id) !==
                -1 &&
              (participants[
                participants.findIndex((i) => i.id === message.sender_id)
              ].role === "CUSTOMER"
                ? "!bg-neutral-400"
                : "!bg-[#6099FF]"),
          )}
        >
          {participants &&
            participants.findIndex((i) => i.id === message.sender_id) !==
              -1 && (
              <Body5 className="absolute -top-5 left-0 text-nowrap text-black">
                {participants &&
                  participants[
                    participants.findIndex((i) => i.id === message.sender_id)
                  ].id}
              </Body5>
            )}
          <div className="flex h-auto w-full items-center justify-center gap-x-2">
            <Image
              alt={message.id}
              src={product.photos[0]}
              unoptimized
              width={75}
              height={760}
              className="aspect-square h-[75px] rounded-lg"
            />
            <div className="w-full">
              <Body4 className="font-semibold">{product.name}</Body4>
              <Body5>{product.category.name}</Body5>
            </div>
          </div>
          <div className="w-full">
            <Link
              href={`/shop/product/${product.slug}`}
              target="_blank"
              className={buttonVariants({
                variant: "default",
                className: "mt-2 w-full",
              })}
            >
              Buka produk
            </Link>
          </div>
        </figure>
      )}
    </>
  );
};
