"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { CartItem, CustomRequestItem } from "@/types/cart";
import { CreateInvoiceSuccessResponse, ItemDetail } from "@/types/midtrans";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { generateToken } from "@/utils/random-string";
import { addDays, addMinutes } from "date-fns";
import { createTransactionInvoice } from "./midtrans";
import { Courier } from "@/types/courier";
import { getCostByCourierCode } from "@/utils/couriers";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { updateCart } from "./cart";

interface CartObject {
  cartItems?: CartItem[];
  customRequest?: CustomRequestItem;
}

export const upsertCheckout = async (
  cart: CartObject,
  shipmentAddressId?: string,
  courier?: Courier,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const session = await getServerSession();

  const data = await prisma.$transaction(
    async (prisma) => {
      if (cart.cartItems && session?.user && shipmentAddressId && courier) {
        const itemIds = cart.cartItems.map((i) => i.productId);

        const user = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
        });

        const products = await prisma.product.findMany({
          where: {
            id: {
              in: itemIds,
            },
          },
          include: {
            variants: true,
          },
        });

        const shipmentAddress = await prisma.shippingAddress.findUnique({
          where: { id: shipmentAddressId },
        });

        if (!shipmentAddress) {
          return ActionResponses.notFound("Alamat pengiriman tidak ditemukan!");
        }

        const shipmentCost = await getCostByCourierCode({
          courierCode: courier.code,
          service: courier.service,
          originCity: process.env.NEXT_PUBLIC_ORIGIN_CITY as string,
          destinationCity:
            shipmentAddress.city.split(" ").length > 1
              ? shipmentAddress.city.split(" ")[1]
              : shipmentAddress.city,
          weightInKg: calculateCartWeight(products, cart.cartItems),
        });

        if (!shipmentCost) {
          return ActionResponses.serverError();
        }

        const order = await prisma.order.create({
          data: {
            shipping_address: buildShipmentAddressString(shipmentAddress),
            status: "UNPAID",
            user_id: session.user.id,
            shipping_price: shipmentCost,
            phone_number: shipmentAddress.recipient_phone_number,
            total_price: 0,
          },
        });

        await prisma.shipment.create({
          data: {
            carrier: courier.code + " - " + courier.service,
            estimated_finish_time: addDays(new Date(), 5),
            status: "PENDING",
            order_id: order.id,
          },
        });

        let amount = 0;
        const itemDetail: ItemDetail[] = [];
        await prisma.orderItem.createMany({
          data: cart.cartItems.map((item) => {
            const product = products.find((j) => item.productId === j.id);
            const variant = item.variantId
              ? product?.variants.find((j) => item.variantId === j.id)
              : null;

            amount +=
              item.quantity *
              (item.variantId ? variant!.price : product!.price!);

            itemDetail.push({
              description: product!.name,
              price: item.variantId ? variant!.price : product!.price!,
              quantity: item.quantity,
            });

            return {
              order_id: order.id,
              ...(variant
                ? { variant_id: variant.id }
                : { product_id: product?.id }),
              quantity: item.quantity,
            };
          }),
        });

        cart.cartItems.forEach(async (item) => {
          const product = products.find((j) => item.productId === j.id);
          const variant = item.variantId
            ? product?.variants.find((j) => item.variantId === j.id)
            : null;

          if (variant) {
            return await prisma.productVariant.update({
              where: { id: variant?.id },
              data: { stock: { decrement: item.quantity } },
            });
          }
          await prisma.product.update({
            where: { id: product?.id },
            data: { stock: { decrement: item.quantity } },
          });
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { total_price: amount + shipmentCost },
        });

        const result = await createTransactionInvoice({
          customer_details: {
            email: user?.email,
            name: shipmentAddress.recipient_name,
            id: user?.id,
            phone: shipmentAddress.recipient_phone_number?.startsWith("0")
              ? shipmentAddress.recipient_phone_number.slice(1, 0)
              : shipmentAddress.recipient_phone_number,
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
          invoice_number: `${
            process.env.APP_ENV === "production" ? "TRX" : "DEV"
          }-${generateToken(12)}`,
          item_details: itemDetail,
          payment_type: "payment_link",
          amount: {
            vat: "0",
            discount: "0",
            shipping: shipmentCost.toString(),
          },
        });

        if (!result.success || result.error || !result.data) {
          return ActionResponses.serverError();
        }

        await prisma.order.update({
          where: { id: order.id },
          data: {
            invoice_link: result.data.pdf_url,
          },
        });

        const data = result.data;

        await prisma.payment.create({
          data: {
            order_id: order.id,
            status: "PENDING",
            transaction_id: data.id,
          },
        });

        await updateCart({ type: "ready-stock", items: [] });

        return ActionResponses.success(data);
      }

      if (cart.customRequest && session?.user) {
        const customRequest = await prisma.customRequest.findUnique({
          where: {
            id: cart.customRequest.id,
          },
        });

        if (
          !customRequest?.shipping_price ||
          !customRequest.carrier_code ||
          !customRequest
        )
          return ActionResponses.serverError("Order has not been approved!");

        const user = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
        });

        const order = await prisma.order.create({
          data: {
            shipping_address: customRequest.address,
            status: "UNPAID",
            user_id: session.user.id,
            phone_number: customRequest.recipient_phone_number,
            total_price: customRequest.shipping_price + customRequest.price,
            shipping_price: customRequest.shipping_price,
          },
        });

        await prisma.shipment.create({
          data: {
            carrier: customRequest.carrier_code,
            estimated_finish_time: addDays(new Date(), 5),
            status: "PENDING",
            order_id: order.id,
          },
        });

        const itemDetail: ItemDetail[] = [
          {
            description: `${customRequest.model} ${customRequest.material} ${customRequest.color} (Custom Product)`,
            price: customRequest.price,
            quantity: 1,
          },
        ];
        await prisma.orderItem.create({
          data: {
            quantity: 1,
            custom_request_id: customRequest.id,
            order_id: order.id,
          },
        });

        const result = await createTransactionInvoice({
          customer_details: {
            email: user?.email,
            name: customRequest.recipient_name,
            id: user?.id,
            phone: customRequest.recipient_phone_number?.startsWith("0")
              ? customRequest.recipient_phone_number.slice(1, 0)
              : customRequest.recipient_phone_number,
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
          invoice_number: `${
            process.env.NODE_ENV === "production" ? "TRX" : "DEV"
          }-${generateToken(12)}`,
          item_details: itemDetail,
          payment_type: "payment_link",
          amount: {
            vat: "0",
            discount: "0",
            shipping: customRequest.shipping_price.toString(),
          },
        });

        if (!result.success || result.error || !result.data) {
          return ActionResponses.serverError();
        }

        await prisma.order.update({
          where: { id: order.id },
          data: {
            invoice_link: result.data.pdf_url,
          },
        });

        const data = result.data;

        await prisma.payment.create({
          data: {
            order_id: order.id,
            status: "PENDING",
            transaction_id: data.id,
          },
        });

        await updateCart({ type: "custom", item: undefined });

        return ActionResponses.success(data);
      }

      return ActionResponses.badRequest("Need order item/custom order!");
    },
    { isolationLevel: "Serializable", timeout: 20000 },
  );

  return data;
};
