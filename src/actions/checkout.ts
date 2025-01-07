"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { formatPhoneNumber, generateInvoiceNumber } from "@/lib/utils";
import { CartItem, CustomRequestItem } from "@/types/cart";
import { ProductWithVariant } from "@/types/entityRelations";
import { CreateInvoiceSuccessResponse, ItemDetail } from "@/types/midtrans";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { calculateOrderAmounts, validateCartItems } from "@/utils/checkout";
import { getCostByCourierCode } from "@/utils/couriers";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { addDays, addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { updateCart } from "./cart";
import { createTransactionInvoice } from "./midtrans";
import { Service } from "./shippingPrice/scraper";

interface CartObject {
  cartItems?: CartItem[];
  customRequests?: CustomRequestItem[];
}

const BATCH_SIZE = 2; // Process items in smaller batches

const generateOrderId = (
  options: { prefix?: string; minLength?: number; maxLength?: number } = {},
): string => {
  const { prefix = "TRI", minLength = 9, maxLength = 12 } = options;

  // Generate random length between min and max
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // Create a timestamp component to help ensure uniqueness
  const timestamp = Math.floor(Date.now() * 0.001)
    .toString(16)
    .slice(-4);

  // Define character set for random string
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Generate random string (subtracting 4 to account for timestamp)
  let randomString = "";
  for (let i = 0; i < length - 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  // Combine timestamp and random string
  const uniquePart = timestamp + randomString;

  // Create the final order ID
  return `${prefix}-${uniquePart}`;
};

const processBatch = async (
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  items: CartItem[],
  products: ProductWithVariant[],
  orderId: string,
) => {
  await Promise.all(
    items.map(async (item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = item.variantId
        ? product?.variants.find((v) => v.id === item.variantId)
        : undefined;

      const operations = [];

      // Create order item
      operations.push(
        tx.orderItem.create({
          data: {
            order_id: orderId,
            product_id: item.productId,
            variant_id: variant?.id,
            quantity: item.quantity,
          },
        }),
      );

      // Update inventory
      if (variant) {
        operations.push(
          tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          }),
        );
      } else {
        operations.push(
          tx.product.update({
            where: { id: product?.id },
            data: { stock: { decrement: item.quantity } },
          }),
        );
      }

      await Promise.all(operations);
    }),
  );
};

const handleStandardCheckout = async (
  cartItems: CartItem[],
  shipmentAddressId: string,
  courier: Service,
  userId: string,
  userRole: Role,
  referalCode?: string,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const [discount, products, shipmentAddress] = await Promise.all([
    findDiscountByRole(userRole),
    prisma.product.findMany({
      where: { id: { in: cartItems.map((item) => item.productId) } },
      include: { variants: true },
    }),
    prisma.shippingAddress.findUnique({ where: { id: shipmentAddressId } }),
  ]);

  if (!shipmentAddress) {
    return ActionResponses.notFound("Shipping address not found!");
  }

  const referal = await prisma.referal.findUnique({
    where: { code: referalCode },
  });

  if (referalCode && !referal) {
    return ActionResponses.notFound(
      "Kode referal yang anda pakai tidak valid!",
    );
  }

  const shipmentCost = await getCostByCourierCode({
    courierCode: courier.code,
    service: courier.service,
    originCity: process.env.NEXT_PUBLIC_ORIGIN_CITY as string,
    destinationCity: shipmentAddress.city.split(" ")[1] || shipmentAddress.city,
    weightInKg: calculateCartWeight(products, cartItems),
  });

  if (!shipmentCost) {
    return ActionResponses.serverError();
  }

  // Calculate amounts outside transaction
  const { amount, vat, discountPrice, itemDetails } = calculateOrderAmounts(
    cartItems,
    products,
    shipmentCost,
    {
      // Adds the referal discount + generic discount
      discount_in_percent:
        (discount?.discount_in_percent || 0) +
        (referal?.discount_in_percent || 0),
    },
  );

  // Process in transaction with batching
  return await prisma.$transaction(
    async (tx) => {
      // Validate stock first
      await validateCartItems(cartItems, products);

      const order = await tx.order.create({
        data: {
          id: generateOrderId(),
          shipping_address: buildShipmentAddressString(shipmentAddress),
          status: "UNPAID",
          user_id: userId,
          shipping_price: shipmentCost,
          phone_number: formatPhoneNumber(
            shipmentAddress.recipient_phone_number,
          ),
          total_price: amount - discountPrice + shipmentCost + vat,
          referal_id: referal?.id,
        },
      });

      await tx.shipment.create({
        data: {
          carrier: courier.code,
          estimated_finish_time: addDays(new Date(), 5),
          status: "PENDING",
          order_id: order.id,
        },
      });

      // Process inventory updates in batches
      for (let i = 0; i < cartItems.length; i += BATCH_SIZE) {
        const batch = cartItems.slice(i, i + BATCH_SIZE);
        await processBatch(tx, batch, products, order.id);
      }

      const result = await createTransactionInvoice({
        customer_details: {
          name: shipmentAddress.recipient_name,
          id: userId,
          phone: formatPhoneNumber(shipmentAddress.recipient_phone_number),
        },
        payment_link: {
          enabled_payments: [
            "bca_va",
            "gopay",
            "permata_va",
            "echannel",
            "other_qris",
          ],
        },
        order_id: order.id,
        due_date: addMinutes(new Date(), 10).toISOString(),
        invoice_date: new Date().toISOString(),
        invoice_number: generateInvoiceNumber(),
        item_details: itemDetails,
        payment_type: "payment_link",
        amount: {
          vat: vat.toString(),
          discount: discountPrice.toString(),
          shipping: shipmentCost.toString(),
        },
      });

      if (!result.success || result.error || !result.data) {
        throw new Error(result.error?.message || "Invoice creation failed");
      }

      await Promise.all([
        tx.order.update({
          where: { id: order.id },
          data: { invoice_link: result.data.pdf_url },
        }),
        tx.payment.create({
          data: {
            order_id: order.id,
            status: "PENDING",
            transaction_id: result.data.id,
          },
        }),
      ]);

      await updateCart({ type: "ready-stock", items: [] });
      revalidatePath("/", "layout");
      return ActionResponses.success(result.data);
    },
    {
      timeout: 5000,
      isolationLevel: "Serializable",
    },
  );
};

const handleCustomRequestCheckout = async (
  customRequestItem: CustomRequestItem[],
  userId: string,
  referalCode?: string,
  userRole?: Role,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  try {
    // Fetch the custom request and validate its existence and shipping details
    const customRequest = await prisma.customRequest.findMany({
      where: { id: { in: customRequestItem.map((i) => i.id) } },
    });

    const referal = await prisma.referal.findUnique({
      where: { code: referalCode },
    });

    if (referalCode && !referal) {
      return ActionResponses.notFound(
        "Kode referal yang anda pakai tidak valid!",
      );
    }

    const discount = await findDiscountByRole(userRole!);

    if (
      !customRequest ||
      !customRequest.every((i) => Boolean(i.shipping_price)) ||
      !customRequest.every((i) => Boolean(i.carrier_code))
    ) {
      return ActionResponses.serverError("Order has not been approved!");
    }

    // Fetch the user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return ActionResponses.serverError("User not found!");
    }

    // Prepare item details for the invoice
    // TODO: Change this according to the new schema
    let itemDetails: ItemDetail[] = [];

    const {
      totalPrice,
      totalVat,
      totalShipping,
      totalDiscount,
      totalReferral,
    } = customRequest.reduce(
      (sum, i) => {
        const totalPrice = i.quantity * i.price;

        itemDetails.push({
          description: `${i.model} ${i.material} (Custom Product)`,
          price: i.price,
          quantity: i.quantity,
        });
        sum.totalPrice += i.price * i.quantity;
        sum.totalShipping += i.shipping_price ?? 0;

        const discountPrice = discount?.discount_in_percent
          ? totalPrice * (discount.discount_in_percent / 100)
          : 0;

        const referralDiscount = referal?.discount_in_percent
          ? (totalPrice - discountPrice) * (referal.discount_in_percent / 100)
          : 0;

        sum.totalDiscount += discountPrice;
        sum.totalReferral += referralDiscount;

        if (i.is_vat)
          sum.totalVat +=
            ((totalPrice - (referralDiscount + discountPrice)) * 11) / 100;
        return sum;
      },
      {
        totalPrice: 0,
        totalVat: 0,
        totalShipping: 0,
        totalReferral: 0,
        totalDiscount: 0,
      },
    );

    const order = await prisma.order.create({
      data: {
        id: generateOrderId(),
        shipping_address: customRequest[0].address,
        status: "UNPAID",
        user_id: userId,
        phone_number: customRequest[0].recipient_phone_number,
        total_price: totalPrice - (totalDiscount + totalReferral) + totalVat,
        shipping_price: totalShipping,
        referal_id: referal?.id,
      },
    });

    // Create a shipment entry
    await prisma.shipment.create({
      data: {
        carrier: customRequest[0].carrier_code!,
        estimated_finish_time: addDays(new Date(), 5),
        status: "PENDING",
        order_id: order.id,
        is_custom_carrier: customRequest[0].is_custom_carrier,
      },
    });

    // Create an order item entry
    await prisma.orderItem.createMany({
      data: customRequest.map((i) => ({
        quantity: i.quantity,
        custom_request_id: i.id,
        order_id: order.id,
      })),
    });

    // Generate the transaction invoice
    const result = await createTransactionInvoice({
      customer_details: {
        email: user.email,
        name: customRequest[0].recipient_name,
        id: user.id,
        phone: formatPhoneNumber(customRequest[0].recipient_phone_number),
      },
      payment_link: {
        enabled_payments: [
          "bca_va",
          "gopay",
          "permata_va",
          "echannel",
          "other_qris",
        ],
      },
      order_id: order.id,
      due_date: addMinutes(new Date(), 10).toISOString(),
      invoice_date: new Date().toISOString(),
      invoice_number: generateInvoiceNumber(),
      item_details: itemDetails,
      payment_type: "payment_link",
      amount: {
        vat: totalVat.toString(),
        discount: (totalDiscount + totalReferral).toString(),
        shipping: totalShipping.toString(),
      },
    });

    if (!result.success || result.error || !result.data) {
      console.log(result);
      return ActionResponses.serverError(
        "Failed to create transaction invoice.",
      );
    }

    // Update the order with the invoice link
    await prisma.order.update({
      where: { id: order.id },
      data: { invoice_link: result.data.pdf_url },
    });

    // Record the payment details
    await prisma.payment.create({
      data: {
        order_id: order.id,
        status: "PENDING",
        transaction_id: result.data.id,
      },
    });

    // Clear the user's cart
    await updateCart({ type: "ready-stock", items: [] });
    revalidatePath("/", "layout");
    return ActionResponses.success(result.data);
  } catch (error) {
    console.error("Error in handleCustomRequestCheckout:", error);
    return ActionResponses.serverError("An unexpected error occurred.");
  }
};

export const applyReferalCode = async (
  referalCode: string,
): Promise<
  ActionResponse<{ message: string; discount_in_percent: number }>
> => {
  try {
    const referal = await prisma.referal.findUnique({
      where: { code: referalCode },
    });

    if (!referal) return ActionResponses.notFound("Kode referal tidak valid!");

    return ActionResponses.success({
      message: "Berhasil mengaplikasikan kode referal!",
      discount_in_percent: referal.discount_in_percent,
    });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError();
  }
};

export const upsertCheckout = async (
  cart: CartObject,
  shipmentAddressId?: string,
  courier?: Service,
  referalCode?: string,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const session = await getServerSession();
  if (!session?.user) return ActionResponses.unauthorized();

  if (cart.cartItems && shipmentAddressId && courier) {
    return await handleStandardCheckout(
      cart.cartItems,
      shipmentAddressId,
      courier,
      session.user.id,
      session.user.role,
      referalCode ?? "",
    );
  }

  if (cart.customRequests) {
    return await handleCustomRequestCheckout(
      cart.customRequests,
      session.user.id,
      referalCode ?? "",
      session.user.role,
    );
  }

  revalidatePath("/", "layout");
  return ActionResponses.badRequest("Invalid cart data.");
};
