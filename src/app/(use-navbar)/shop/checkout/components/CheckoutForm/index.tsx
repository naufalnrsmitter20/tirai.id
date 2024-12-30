"use client";

import { upsertCheckout } from "@/actions/checkout";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Body2, Body3, H3, H4 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { CartItem, CustomRequestItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { ShippingAddress } from "@prisma/client";
import { CreditCard, Package, Palette, Ruler } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";
import { AddressSelector } from "./AddressSelector";
import { Details } from "./Details";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Service } from "@/actions/shippingPrice/scraper";

const CourierSelector = dynamic(() => import("./CourierSelector"), {
  ssr: false,
});

export const CheckoutForm: FC<{
  addresses: ShippingAddress[];
  cartItems: CartItem[] | undefined; // Will be defined if the cart type is "ready-stock"
  products: ProductWithVariant[] | undefined; // Will be defined if the cart type is "ready-stock"
  customRequest: CustomRequestItem | undefined; // Will be defined if the cart type is "custom"
}> = ({ addresses, cartItems, customRequest, products }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [selectedCourier, setSelectedCourier] = useState<Service>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    toast.loading("Loading...");

    setLoading(true);
    if (selectedAddressId && selectedCourier) {
      if (cartItems) {
        const res = await upsertCheckout(
          { cartItems },
          selectedAddressId,
          selectedCourier,
        );
        if (!res.success) {
          setLoading(false);
        }
        router.push(res.data?.payment_link_url!);
      }

      // Handle when the customRequest are available
    }
    if (customRequest) {
      const res = await upsertCheckout({ customRequest });
      if (!res.success) {
        setLoading(false);
      }
      router.push(res.data?.payment_link_url!);
    }

    setLoading(false);
  };

  if (customRequest !== undefined) {
    const { id, material, model, color, width, height, price, shipping_price } =
      customRequest;

    return (
      <SectionContainer id="checkout">
        <div className="flex w-full flex-col items-start justify-between gap-x-6 lg:flex-row">
          <div className="mb-6 flex h-full w-full flex-col items-start">
            <div className="flex w-full flex-col">
              <Card className="w-full transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <H4 className="font-bold text-black">{id}</H4>
                      <Body3 className="text-neutral-500">
                        Model ({model})
                      </Body3>
                    </div>
                    <Body2 className="text-neutral-500">
                      Bahan ({material})
                    </Body2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-gray-500" />
                      <span>Warna</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-600">{color}</span>
                    </div>
                  </div>

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
                        {formatRupiah(price + (shipping_price || 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-stretch overflow-y-hidden lg:w-1/3">
            <div className="mb-6 flex flex-col gap-y-2">
              <div className="flex flex-row justify-between">
                <Body3 className="text-black">Subtotal (Kustom)</Body3>
                <Body3 className="text-black">{formatRupiah(price)}</Body3>
              </div>
              <div className="flex flex-row justify-between">
                <Body3 className="text-black">Shipping</Body3>
                <Body3 className="neutral-500 text-black">
                  {formatRupiah(shipping_price!)}
                </Body3>
              </div>
              <div className="mt-2 flex flex-row justify-between">
                <H3 className="text-black">Total</H3>
                <H3 className="text-black">
                  {formatRupiah(shipping_price! + price)}
                </H3>
              </div>
            </div>
            <Button
              disabled={shipping_price === undefined}
              onClick={handleCheckout}
              className="w-full"
            >
              Checkout
            </Button>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="checkout">
      <div className="flex w-full flex-col items-start justify-between gap-x-6 lg:flex-row">
        <div className="mb-6 flex h-full w-full flex-col items-start">
          {cartItems && products && (
            <div className="flex w-full flex-col gap-y-8">
              <AddressSelector
                addressId={selectedAddressId}
                setAddressId={setSelectedAddressId}
                addresses={addresses}
              />
              {selectedAddressId !== undefined && (
                <CourierSelector
                  address={
                    addresses.find(
                      (address) => address.id === selectedAddressId,
                    )!
                  }
                  courier={selectedCourier}
                  setCourier={setSelectedCourier}
                  weightInKg={calculateCartWeight(products, cartItems)}
                />
              )}
            </div>
          )}
          <div className="flex w-full flex-col">
            {cartItems &&
              cartItems.map((i) => (
                <ProductCard
                  cartItem={i}
                  product={
                    products![products!.findIndex((j) => j.id === i.productId)]
                  }
                  key={i.id}
                />
              ))}
          </div>
        </div>
        {products && cartItems && (
          <Details
            cartItems={cartItems}
            products={products}
            checkoutDisabled={!selectedAddressId || !selectedCourier || loading}
            handleCheckout={handleCheckout}
            shippingPrice={
              selectedCourier ? Number(selectedCourier.price) : undefined
            }
          />
        )}
      </div>
    </SectionContainer>
  );
};
