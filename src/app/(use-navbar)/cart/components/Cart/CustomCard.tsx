import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Body2, Body3, H4 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { CustomRequestItem } from "@/types/cart";
import { Box, CreditCard, Package, Ruler } from "lucide-react";

export const CustomCard = ({
  customRequest,
}: {
  customRequest: CustomRequestItem;
}) => {
  const {
    id,
    material,
    model,
    width,
    height,
    price,
    shipping_price,
    quantity,
  } = customRequest;
  return (
    <Card className="w-full transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <H4 className="font-bold text-black">{id}</H4>
            <Body3 className="text-neutral-500">Model ({model})</Body3>
          </div>
          <Body2 className="text-neutral-500">Bahan ({material})</Body2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-gray-500" />
            <span>Ukuran</span>
          </div>
          <div className="flex gap-2 text-sm text-gray-600">
            <span>{width}cm</span>
            <span>×</span>
            <span>{height}cm</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span>Harga:</span>
            </div>

            <span>{formatRupiah(price)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-gray-500" />
              <span>Jumlah:</span>
            </div>

            <span>{quantity}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span>Ongkir:</span>
            </div>
            <span>
              {shipping_price
                ? formatRupiah(shipping_price)
                : "Menunggu konfirmasi"}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-2 font-medium">
            <span>Total:</span>
            <span className="text-lg">
              {formatRupiah(price * quantity + (shipping_price || 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
