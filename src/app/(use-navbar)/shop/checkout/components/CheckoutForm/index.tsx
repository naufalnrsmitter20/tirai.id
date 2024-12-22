"use client";

import { upsertCheckout } from "@/actions/checkout";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { CartItem } from "@/types/cart";
import { Courier } from "@/types/courier";
import { ProductWithVariant } from "@/types/entityRelations";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import { AddressSelector } from "./AddressSelector";
import { Details } from "./Details";
import { ProductCard } from "./ProductCard";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CourierSelector = dynamic(() => import("./CourierSelector"), {
  ssr: false,
});

export const CheckoutForm: FC<{
  addresses: ShippingAddress[];
  cart: CartItem[];
  products: ProductWithVariant[];
}> = ({ addresses, cart, products }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [selectedCourier, setSelectedCourier] = useState<Courier>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckOut = async () => {
    if (selectedAddressId && selectedCourier) {
      const loadingToast = toast.loading("Loading...");

      setLoading(true);
      const res = await upsertCheckout(
        cart,
        selectedAddressId,
        selectedCourier,
      );
      router.push(res.data?.payment_link_url!);

      setLoading(false);
      toast.success("Berhasil!", { id: loadingToast });
    }
  };

  return (
    <SectionContainer id="checkout">
      <div className="flex w-full flex-col items-start justify-between gap-x-6 lg:flex-row">
        <div className="mb-6 flex h-full w-full flex-col items-start">
          <div className="flex w-full flex-col gap-y-8">
            <AddressSelector
              addressId={selectedAddressId}
              setAddressId={setSelectedAddressId}
              addresses={addresses}
            />
            {selectedAddressId !== undefined && (
              <CourierSelector
                address={
                  addresses.find((address) => address.id === selectedAddressId)!
                }
                courier={selectedCourier}
                setCourier={setSelectedCourier}
                weightInKg={calculateCartWeight(products, cart)}
              />
            )}
          </div>
          <div className="flex w-full flex-col">
            {cart.map((i) => (
              <ProductCard
                cartItem={i}
                product={
                  products[products.findIndex((j) => j.id === i.productId)]
                }
                key={i.id}
              />
            ))}
          </div>
        </div>
        <Details
          products={products}
          checkoutDisabled={!selectedAddressId || !selectedCourier || loading}
          handleCheckout={handleCheckOut}
          shippingPrice={
            selectedCourier ? Number(selectedCourier.price) : undefined
          }
        />
      </div>
    </SectionContainer>
  );
};
