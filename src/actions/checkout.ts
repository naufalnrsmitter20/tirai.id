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
import { updateCart } from "./cart";
import { createTransactionInvoice } from "./midtrans";
import { Service } from "./shippingPrice/scraper";

interface CartObject {
  cartItems?: CartItem[];
  customRequest?: CustomRequestItem;
}

const BATCH_SIZE = 2; // Process items in smaller batches

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
    discount ?? undefined,
  );

  // Process in transaction with batching
  return await prisma.$transaction(
    async (tx) => {
      // Validate stock first
      await validateCartItems(cartItems, products);

      const order = await tx.order.create({
        data: {
          shipping_address: buildShipmentAddressString(shipmentAddress),
          status: "UNPAID",
          user_id: userId,
          shipping_price: shipmentCost,
          phone_number: formatPhoneNumber(
            shipmentAddress.recipient_phone_number,
          ),
          total_price: amount - discountPrice + shipmentCost + vat,
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
          // TODO: Fix the gross_amount not match itemDetails
          vat: "0",
          discount: "0",
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
      return ActionResponses.success(result.data);
    },
    {
      timeout: 5000,
      isolationLevel: "Serializable",
    },
  );
};

const handleCustomRequestCheckout = async (
  customRequestItem: CustomRequestItem,
  userId: string,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  try {
    // Fetch the custom request and validate its existence and shipping details
    const customRequest = await prisma.customRequest.findUnique({
      where: { id: customRequestItem.id },
    });

    if (
      !customRequest ||
      !customRequest.shipping_price ||
      !customRequest.carrier_code
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

    // Calculate VAT if applicable
    const vat = customRequest.is_vat ? (customRequest.price * 11) / 100 : 0;

    // Create an order entry
    const totalPrice = customRequest.shipping_price + customRequest.price + vat;
    const order = await prisma.order.create({
      data: {
        shipping_address: customRequest.address,
        status: "UNPAID",
        user_id: userId,
        phone_number: customRequest.recipient_phone_number,
        total_price: totalPrice,
        shipping_price: customRequest.shipping_price,
      },
    });

    // Create a shipment entry
    await prisma.shipment.create({
      data: {
        carrier: customRequest.carrier_code,
        estimated_finish_time: addDays(new Date(), 5),
        status: "PENDING",
        order_id: order.id,
      },
    });

    // Prepare item details for the invoice
    const itemDetails: ItemDetail[] = [
      {
        description: `${customRequest.model} ${customRequest.material} ${customRequest.color} (Custom Product)`,
        price: customRequest.price,
        quantity: 1,
      },
    ];

    // Create an order item entry
    await prisma.orderItem.create({
      data: {
        quantity: 1,
        custom_request_id: customRequest.id,
        order_id: order.id,
      },
    });

    // Generate the transaction invoice
    const result = await createTransactionInvoice({
      customer_details: {
        email: user.email,
        name: customRequest.recipient_name,
        id: user.id,
        phone: formatPhoneNumber(customRequest.recipient_phone_number),
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
        discount: "0",
        shipping: customRequest.shipping_price.toString(),
      },
    });

    if (!result.success || result.error || !result.data) {
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

    return ActionResponses.success(result.data);
  } catch (error) {
    console.error("Error in handleCustomRequestCheckout:", error);
    return ActionResponses.serverError("An unexpected error occurred.");
  }
};

export const upsertCheckout = async (
  cart: CartObject,
  shipmentAddressId?: string,
  courier?: Service,
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
    );
  }

  if (cart.customRequest) {
    return await handleCustomRequestCheckout(
      cart.customRequest,
      session.user.id,
    );
  }

  return ActionResponses.badRequest("Invalid cart data.");
};
