import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Body3 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { OrderStatus, Prisma } from "@prisma/client";
import { Palette, Ruler } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { ReviewForm } from "./ReviewForm";

export const OrderItemCard: FC<{
  item: Prisma.OrderItemGetPayload<{
    include: {
      product: true;
      variant: true;
      custom_request: true;
      review: true;
    };
  }>;
  status: OrderStatus;
}> = ({ item, status }) => {
  if (item.custom_request) {
    return (
      <Card
        key={item.custom_request.id}
        className="border-none bg-slate-50 shadow-none"
      >
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Custom #{item.custom_request.id}
              </span>
              <span className="text-sm text-slate-500">
                ({item.custom_request.model})
              </span>
            </div>
            <span className="text-sm text-slate-500">
              {item.custom_request.material}
            </span>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-500" />
              <span>Warna: </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{
                    backgroundColor: item.custom_request.color,
                  }}
                />
                <span>{item.custom_request.color}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-slate-500" />
              <span>
                Ukuran: {item.custom_request.width}cm ×{" "}
                {item.custom_request.height}cm
              </span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span>Harga:</span>
              <span>{formatRupiah(item.custom_request.price)}</span>
            </div>

            <div className="flex justify-between">
              <span>Ongkir:</span>
              <span>
                {item.custom_request.shipping_price
                  ? formatRupiah(item.custom_request.shipping_price)
                  : "Menunggu konfirmasi"}
              </span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>
                {formatRupiah(
                  item.custom_request.price +
                    (item.custom_request.shipping_price || 0),
                )}
              </span>
            </div>
          </div>

          {status === "FINISHED" && <ReviewForm review={item.review} />}
        </CardContent>
      </Card>
    );
  }

  return (
    <div key={item.id}>
      <div className="flex gap-4 rounded-lg bg-slate-50 p-3">
        <Image
          src={item.product?.photos[0] || "/placeholder.png"}
          alt={item.product?.name || item.variant?.name!}
          className="h-20 w-20 rounded-lg object-cover"
          width={80}
          height={80}
        />
        <div className="flex flex-1 justify-between">
          <div>
            <Body3 className="font-medium">{item.product?.name}</Body3>
            {item.variant && (
              <p className="text-sm text-slate-500">{item.variant.name}</p>
            )}
          </div>
          <div className="text-right text-sm">
            {item.quantity} x{" "}
            {formatRupiah(
              item.variant ? item.variant.price : item.product?.price!,
            )}
          </div>
        </div>
      </div>

      {status === "FINISHED" && <ReviewForm review={item.review} />}
    </div>
  );
};
