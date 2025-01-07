"use client";

import { applyReferalCode } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body3, H5 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { Discount } from "@prisma/client";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";

export const Details = ({
  cartItems,
  products,
  checkoutDisabled,
  handleCheckout,
  shippingPrice,
  discount,
  referalCode,
  setReferalCode,
  referalDiscount,
  setReferalDiscount,
}: {
  cartItems: CartItem[];
  products: ProductWithVariant[];
  checkoutDisabled: boolean;
  handleCheckout: () => void;
  shippingPrice?: number;
  discount?: Discount | null;
  referalCode?: string;
  setReferalCode: Dispatch<SetStateAction<string | undefined>>;
  referalDiscount?: number;
  setReferalDiscount: Dispatch<SetStateAction<number | undefined>>;
}) => {
  const detailedCartItems = useMemo(() => {
    if (!cartItems || !products) return [];

    return cartItems
      .map((item) => {
        const product = products.find(
          (product) => product.id === item.productId,
        );
        if (!product) return null;

        const variant = item.variantId
          ? product.variants?.find((variant) => variant.id === item.variantId)
          : null;

        const pricePerUnit = variant?.price ?? product.price ?? 0;
        const totalItemPrice = pricePerUnit * item.quantity;
        let discountPrice = discount
          ? totalItemPrice * (discount.discount_in_percent / 100)
          : 0;
        let referalDiscountPrice = 0;
        if (referalDiscount)
          referalDiscountPrice =
            ((totalItemPrice - discountPrice) * referalDiscount) / 100;
        const vat = product.is_vat
          ? (totalItemPrice - discountPrice - referalDiscountPrice) * (11 / 100)
          : 0;

        return {
          ...item,
          productName: product.name,
          variantName: variant?.name || null,
          pricePerUnit,
          totalItemPrice,
          vat,
          discountPrice,
          referalDiscountPrice,
        };
      })
      .filter(Boolean);
  }, [cartItems, discount, products, referalDiscount]);

  const productsPrice = useMemo(
    () =>
      detailedCartItems.reduce((sum, item) => sum + item!.totalItemPrice, 0),
    [detailedCartItems],
  );

  const totalVat = useMemo(() => {
    return detailedCartItems.reduce((sum, item) => sum + item!.vat, 0);
  }, [detailedCartItems]);

  const discountPrice = useMemo(() => {
    return detailedCartItems.reduce(
      (sum, item) => sum + item!.discountPrice,
      0,
    );
  }, [detailedCartItems]);

  const referalPrice = useMemo(() => {
    return detailedCartItems.reduce(
      (sum, item) => sum + item!.referalDiscountPrice,
      0,
    );
  }, [detailedCartItems]);

  const totalPrice = useMemo(
    () =>
      productsPrice -
      (discountPrice + referalPrice) +
      totalVat +
      (shippingPrice === undefined ? 0 : shippingPrice),
    [
      productsPrice,
      discountPrice,
      totalVat,
      shippingPrice,
      referalDiscount,
      referalPrice,
    ],
  );

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-stretch overflow-y-hidden px-1 lg:w-[35%]">
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
                const appliedReferalCode = await applyReferalCode(referalCode);

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
        <div className="flex flex-row justify-between">
          <Body3 className="text-black">
            Subtotal ({detailedCartItems.length})
          </Body3>
          <Body3 className="text-black">{formatRupiah(productsPrice)}</Body3>
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
        {referalDiscount && referalPrice && (
          <div className="flex flex-row justify-between">
            <Body3 className="text-black">
              Diskon Referal ({referalDiscount}%)
            </Body3>
            <Body3 className="text-green-500">
              -{formatRupiah(referalPrice)}
            </Body3>
          </div>
        )}
        <div className="flex flex-row justify-between">
          <Body3 className="text-black">PPN (11%)</Body3>
          <Body3 className="text-black">{formatRupiah(totalVat)}</Body3>
        </div>
        <div className="flex flex-row justify-between">
          <Body3 className="text-black">Shipping</Body3>
          {shippingPrice && (
            <Body3 className="neutral-500 text-black">
              {formatRupiah(shippingPrice)}
            </Body3>
          )}
        </div>
        <div className="mt-2 flex flex-row justify-between">
          <H5 className="text-black">Total</H5>
          <H5 className="text-black">{formatRupiah(totalPrice)}</H5>
        </div>
      </div>
      <Button
        disabled={checkoutDisabled}
        onClick={handleCheckout}
        className="w-full"
      >
        Checkout
      </Button>
    </div>
  );
};
