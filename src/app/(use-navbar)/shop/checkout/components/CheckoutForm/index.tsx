"use client";

import { applyReferalCode, upsertCheckout } from "@/actions/checkout";
import { Service } from "@/actions/shippingPrice/scraper";
import { CustomCard } from "@/app/(use-navbar)/cart/components/Cart/CustomCard";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body3, H3 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { CartItem, CustomRequestItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { Discount, ShippingAddress } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddressSelector } from "./AddressSelector";
import { Details } from "./Details";
import { ProductCard } from "./ProductCard";

const CourierSelector = dynamic(() => import("./CourierSelector"), {
  ssr: false,
});

export const CheckoutForm: FC<{
  addresses: ShippingAddress[];
  cartItems: CartItem[] | undefined; // Will be defined if the cart type is "ready-stock"
  products: ProductWithVariant[] | undefined; // Will be defined if the cart type is "ready-stock"
  customRequests: CustomRequestItem[] | undefined; // Will be defined if the cart type is "custom"
  discount?: Discount | null;
}> = ({ addresses, cartItems, customRequests, products, discount }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [selectedCourier, setSelectedCourier] = useState<Service>();
  const [loading, setLoading] = useState(false);
  const [referalCode, setReferalCode] = useState<string>();
  const [referalDiscount, setReferalDiscount] = useState<number>();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      toast.loading("Loading...");
      setLoading(true);

      let checkoutResponse;

      if (customRequests) {
        checkoutResponse = await upsertCheckout(
          {
            customRequests,
          },
          undefined,
          undefined,
          referalCode,
        );
      } else if (cartItems && selectedAddressId && selectedCourier) {
        checkoutResponse = await upsertCheckout(
          { cartItems },
          selectedAddressId,
          selectedCourier,
          referalCode,
        );
      } else {
        toast.error("Please complete all required fields");
        return;
      }

      if (!checkoutResponse.success) {
        toast.error("Checkout failed");
        return;
      }

      if (checkoutResponse.data?.payment_link_url) {
        router.push(checkoutResponse.data.payment_link_url);
      } else {
        toast.error("Payment link not found");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  if (customRequests !== undefined) {
    const {
      discountPrice,
      totalItemPrice,
      totalShipping,
      totalVat,
      referalDiscountPrice,
    } = useMemo(() => {
      const count = customRequests.reduce(
        (sum, i) => {
          const totalItemPrice = i.price * i.quantity;
          sum.totalItemPrice += totalItemPrice;
          sum.totalShipping += i.shipping_price ?? 0;
          let discountPrice = discount
            ? totalItemPrice * (discount.discount_in_percent / 100)
            : 0;
          let referalDiscountPrice = 0;
          if (referalDiscount) {
            referalDiscountPrice =
              ((totalItemPrice - discountPrice) * referalDiscount) / 100;
          }
          sum.referalDiscountPrice += referalDiscountPrice;
          sum.discountPrice += discountPrice;
          if (i.is_vat)
            sum.totalVat +=
              ((totalItemPrice - discountPrice - referalDiscountPrice) * 11) /
              100;
          return sum;
        },
        {
          totalItemPrice: 0,
          totalVat: 0,
          totalShipping: 0,
          discountPrice: 0,
          referalDiscountPrice: 0,
        },
      );
      return { ...count };
    }, [customRequests, discount, referalDiscount]);

    const totalPrice = useMemo(() => {
      return (
        totalItemPrice -
        (discountPrice + referalDiscountPrice) +
        totalVat +
        (totalShipping === undefined ? 0 : totalShipping)
      );
    }, [
      discountPrice,
      totalItemPrice,
      totalShipping,
      totalVat,
      referalDiscountPrice,
    ]);
    return (
      <SectionContainer id="checkout">
        <div className="flex w-full flex-col items-start justify-between gap-x-6 lg:flex-row">
          <div className="mb-6 flex h-full w-full flex-col items-start">
            <div className="flex w-full flex-col gap-2">
              {customRequests.map((customItem) => (
                <CustomCard key={customItem.id} customRequest={customItem} />
              ))}
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-stretch overflow-y-hidden lg:w-1/3">
            <div className="mb-6 flex flex-col gap-y-2">
              <div className="my-2 flex flex-col items-center justify-between gap-1 md:flex-row">
                <Input
                  placeholder="Kode Referal"
                  onChange={(e) => {
                    setReferalCode(e.target.value);
                  }}
                />
                <Button
                  onClick={async () => {
                    if (!referalCode) {
                      return;
                    }

                    const loadingToast = toast.loading("Loading...");
                    setLoading(true);

                    try {
                      const appliedReferalCode =
                        await applyReferalCode(referalCode);

                      if (appliedReferalCode.data) {
                        setReferalDiscount(
                          appliedReferalCode.data.discount_in_percent,
                        );
                      }

                      toast.success("Berhasil mengaplikasikan kode referal!", {
                        id: loadingToast,
                      });
                      setLoading(false);
                    } catch (e) {
                      console.log(e);
                      toast.error("Terjadi kesalahan!", { id: loadingToast });
                    }
                  }}
                  type="button"
                  disabled={loading}
                >
                  Apply
                </Button>
              </div>
              {/* TODO: Handle the is_vat per-customproductitem and price calculation @teguhbayu */}
              <div className="flex flex-row justify-between">
                <Body3 className="text-black">Subtotal (Kustom)</Body3>
                <Body3 className="text-black">
                  {formatRupiah(totalItemPrice)}
                </Body3>
              </div>
              {discount && discountPrice && (
                <div className="flex flex-row justify-between">
                  <Body3 className="text-black">
                    Diskon ({discount.discount_in_percent}%)
                  </Body3>
                  <Body3 className="text-green-500">
                    -{formatRupiah(discountPrice)}
                  </Body3>
                </div>
              )}
              {referalDiscount && (
                <div className="flex flex-row justify-between">
                  <Body3 className="text-black">
                    Diskon Referal ({referalDiscount}%)
                  </Body3>
                  <Body3 className="text-green-500">
                    -{formatRupiah(totalItemPrice * (referalDiscount / 100))}
                  </Body3>
                </div>
              )}
              {totalVat > 0 && (
                <div className="flex flex-row justify-between">
                  <Body3 className="text-black">PPN (11%)</Body3>
                  <Body3 className="text-black">{formatRupiah(totalVat)}</Body3>
                </div>
              )}
              <div className="flex flex-row justify-between">
                <Body3 className="text-black">Shipping</Body3>
                <Body3 className="neutral-500 text-black">
                  {formatRupiah(totalShipping!)}
                </Body3>
              </div>
              <div className="mt-2 flex flex-row justify-between">
                <H3 className="text-black">Total</H3>
                <H3 className="text-black">{formatRupiah(totalPrice)}</H3>
              </div>
            </div>
            <Button
              disabled={customRequests.some(
                (i) => i.shipping_price === undefined,
              )}
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
        <div className="mb-6 flex h-full max-h-[30rem] w-full flex-col items-start overflow-y-scroll pr-4">
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
            discount={discount}
            referalCode={referalCode}
            setReferalCode={setReferalCode}
            referalDiscount={referalDiscount}
            setReferalDiscount={setReferalDiscount}
          />
        )}
      </div>
    </SectionContainer>
  );
};
