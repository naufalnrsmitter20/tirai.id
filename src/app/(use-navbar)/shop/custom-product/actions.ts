"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponses } from "@/lib/actions";
import { createProductCustom } from "@/utils/database/customProduct.query";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { updateCart } from "@/actions/cart";

export const saveAddress = async (
  address: Prisma.ShippingAddressUncheckedCreateInput,
) => {
  const newAddress = await prisma.shippingAddress.create({ data: address });

  revalidatePath("/", "layout");
  return newAddress;
};

export const addCustomProductByUser = async (data: FormData) => {
  const width = data.get("width") as string;
  const height = data.get("length") as string;
  const material = data.get("material") as string;
  const model = data.get("model") as string;
  const price = parseFloat(data.get("price") as string);
  const color = data.get("color") as string;
  const recipientName = data.get("recipient_name") as string;
  const recipientPhoneNumber = data.get("recipient_phone_number") as string;
  const street = data.get("street") as string;
  const village = data.get("village") as string;
  const district = data.get("district") as string;
  const city = data.get("city") as string;
  const province = data.get("province") as string;
  const postalCode = data.get("postal_code") as string;
  const additionalInfo = data.get("additional_info") as string | null;
  const userId = data.get("user_id") as string;

  try {
    if (
      !width ||
      !height ||
      !material ||
      !model ||
      !price ||
      !color ||
      !recipientName ||
      !recipientPhoneNumber ||
      !street ||
      !city ||
      !province ||
      !postalCode
    ) {
      return ActionResponses.serverError("Missing required fields");
    }

    const address = buildShipmentAddressString({
      additional_info: additionalInfo,
      city,
      created_at: new Date(),
      district,
      id: "",
      is_primary: false,
      postal_code: postalCode,
      province,
      recipient_name: recipientName,
      recipient_phone_number: recipientPhoneNumber,
      street,
      updated_at: new Date(),
      user_id: "",
      village,
    });

    const productCustom = await createProductCustom({
      width,
      height,
      color,
      price,
      material,
      model,
      address,
      userId,
      recipient_name: recipientName,
      recipient_phone_number: recipientPhoneNumber,
    });

    if (!productCustom) {
      return ActionResponses.serverError("Failed to create Product Custom");
    }

    await updateCart({
      type: "custom",
      item: {
        ...productCustom,
        shipping_price: productCustom.shipping_price
          ? productCustom.shipping_price
          : undefined,
      },
    });

    revalidatePath("/");

    return ActionResponses.success(productCustom);
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to create Product Custom");
  }
};
