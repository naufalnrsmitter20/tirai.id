"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { CartItem } from "@/types/cart";
import { CreateInvoiceSuccessResponse, ItemDetail } from "@/types/midtrans";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { generateToken } from "@/utils/random-string";
import { addMinutes } from "date-fns";
import { createTransactionInvoice } from "./midtrans";
import { Courier } from "@/types/courier";
import { getCostByCourierCode } from "@/utils/couriers";
import { calculateCartWeight } from "@/utils/calculate-cart-weight";
import { updateCart } from "./cart";

export const upsertCheckout = async (
  cart: CartItem[],
  shipmentAddressId: string,
  courier: Courier,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> => {
  const session = await getServerSession();

  const data = await prisma.$transaction(
    async (prisma) => {
      const itemIds = cart.map((i) => i.productId);

      const user = await prisma.user.findUnique({
        where: {
          id: session?.user?.id!,
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
        weightInKg: calculateCartWeight(products, cart),
      });

      if (!shipmentCost) {
        return ActionResponses.serverError();
      }

      const order = await prisma.order.create({
        data: {
          shipping_address: buildShipmentAddressString(shipmentAddress),
          status: "UNPAID",
          user_id: session?.user?.id!,
          phone_number: shipmentAddress.recipient_phone_number,
          total_price: 0,
          desired_carrier_name: courier.name + " - " + courier.service,
        },
      });

      let amount = 0;
      let itemDetail: ItemDetail[] = [];
      await prisma.orderItem.createMany({
        data: cart.map((item) => {
          const product = products.find((j) => item.productId === j.id);
          const variant = item.variantId
            ? product?.variants.find((j) => item.variantId === j.id)
            : null;

          amount +=
            item.quantity *
            (item.variantId ? variant?.price! : product?.price!);

          itemDetail.push({
            description: product?.name!,
            price: item.variantId ? variant?.price! : product?.price!,
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

      cart.forEach(async (item) => {
        const product = products.find((j) => item.productId === j.id);
        const variant = item.variantId
          ? product?.variants.find((j) => item.variantId === j.id)
          : null;

        if (variant) {
          return await prisma.productVariant.update({
            where: { id: variant?.id! },
            data: { stock: { decrement: item.quantity } },
          });
        }
        await prisma.product.update({
          where: { id: product?.id! },
          data: { stock: { decrement: item.quantity } },
        });
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { total_price: amount },
      });

      const result = await createTransactionInvoice({
        customer_details: {
          email: user?.email,
          name: user?.name!,
          id: user?.id!,
          phone: shipmentAddress.recipient_phone_number?.startsWith("0")
            ? shipmentAddress.recipient_phone_number.slice(1, 0)
            : shipmentAddress.recipient_phone_number!,
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
        invoice_number: `${process.env.NODE_ENV === "production" ? "TRX" : "DEV"}-${generateToken(12)}`,
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

      const data = result.data;

      await prisma.payment.create({
        data: {
          order_id: order.id,
          status: "PENDING",
          transaction_id: data.id,
        },
      });

      await updateCart([]);

      return ActionResponses.success(data);
    },
    { isolationLevel: "Serializable", timeout: 20000 },
  );

  return data;
};
