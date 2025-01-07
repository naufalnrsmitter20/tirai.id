import { CartItem, CustomRequestItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { ItemDetail } from "@/types/midtrans";
import { CustomRequest } from "@prisma/client";

export const calculateOrderAmounts = (
  cartItems: CartItem[],
  products: ProductWithVariant[],
  shipmentCost: number,
  discount?: { discount_in_percent: number },
) => {
  let amount = 0;
  let vat = 0;
  const itemDetails: ItemDetail[] = [];

  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    const variant = item.variantId
      ? product?.variants.find((v) => v.id === item.variantId)
      : undefined;

    const price = variant ? variant.price : (product?.price ?? 0);
    const totalItemPrice = item.quantity * price;
    amount += totalItemPrice;

    itemDetails.push({
      price,
      quantity: item.quantity,
      description: product!.name,
    });

    if (product?.is_vat) {
      const discountItemPrice =
        (totalItemPrice * (discount?.discount_in_percent ?? 0)) / 100;
      vat += (totalItemPrice - discountItemPrice) * 0.11;
    }
  }

  const discountPrice = (amount * (discount?.discount_in_percent ?? 0)) / 100;
  const grossAmount = amount - discountPrice + shipmentCost + vat;

  return { amount, vat, discountPrice, itemDetails, grossAmount };
};

export const calculateCustomOrderAmounts = (
  customRequestItems: CustomRequestItem[],
  customRequests: CustomRequest[],
  shipmentCost: number,
  discount?: { discount_in_percent: number },
) => {
  let amount = 0;
  let vat = 0;
  const itemDetails: ItemDetail[] = [];

  for (const item of customRequestItems) {
    const product = customRequests.find((p) => p.id === item.id);

    const price = product?.price ?? 0;
    const totalItemPrice = item.quantity * price;
    amount += totalItemPrice;

    itemDetails.push({
      price,
      quantity: item.quantity,
      description: product?.model!,
    });

    if (product?.is_vat) {
      const discountItemPrice =
        (totalItemPrice * (discount?.discount_in_percent ?? 0)) / 100;
      vat += (totalItemPrice - discountItemPrice) * 0.11;
    }
  }

  const discountPrice = (amount * (discount?.discount_in_percent ?? 0)) / 100;
  const grossAmount = amount - discountPrice + shipmentCost + vat;

  return { amount, vat, discountPrice, itemDetails, grossAmount };
};

export const validateCartItems = async (
  cartItems: CartItem[],
  products: ProductWithVariant[],
) => {
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    const variant = item.variantId
      ? product?.variants.find((v) => v.id === item.variantId)
      : undefined;

    const availableStock = variant ? variant.stock : product?.stock;
    if (!availableStock || item.quantity > availableStock) {
      throw new Error(
        `Insufficient stock for ${item.name}. Requested: ${item.quantity}. Available: ${availableStock}`,
      );
    }
  }
};
