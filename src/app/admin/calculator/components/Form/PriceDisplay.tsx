import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { Discount } from "@prisma/client";
import { Banknote } from "lucide-react";
import { Price } from "../../types";

interface PriceItemProps {
  label: string;
  originalPrice: number;
  discountedPrice: number;
  discount?: number;
}

const PriceItem: React.FC<PriceItemProps> = ({
  label,
  originalPrice,
  discountedPrice,
  discount,
}) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm">Harga Original:</span>
        <span className="font-medium">{formatRupiah(originalPrice)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          Harga {discount ? `(Diskon ${discount}%)` : "Final"}:
        </span>
        <span className="text-primary font-semibold">
          {formatRupiah(discountedPrice)}
        </span>
      </div>
    </div>
  </div>
);

interface PriceDisplayProps {
  price: Price;
  customerDiscount?: Discount | null;
  supplierDiscount?: Discount | null;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  customerDiscount,
  supplierDiscount,
}) => (
  <Card className="shadow-md">
    <CardHeader className="flex flex-row items-center space-x-4">
      <Banknote className="text-primary h-6 w-6" />
      <CardTitle>Perkiraan Harga</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="divide-y divide-border rounded-lg border bg-card">
        <div className="p-4">
          <PriceItem
            label="Harga Customer"
            originalPrice={price.customer.original}
            discountedPrice={price.customer.discounted}
            discount={customerDiscount?.discount_in_percent}
          />
        </div>
        <div className="p-4">
          <PriceItem
            label="Harga Supplier"
            originalPrice={price.supplier.original}
            discountedPrice={price.supplier.discounted}
            discount={supplierDiscount?.discount_in_percent}
          />
        </div>
      </div>

      {/* Total Savings Display */}
      {customerDiscount && (
        <div className="bg-primary/10 mt-4 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Penghematan:</span>
            <span className="text-primary font-semibold">
              {formatRupiah(
                price.customer.original - price.customer.discounted,
              )}
            </span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);
