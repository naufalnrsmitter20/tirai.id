"use server";

import { updateCart } from "@/actions/cart";
import { ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { isCustomCart } from "@/lib/utils";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { createProductCustom } from "@/utils/database/customProduct.query";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CustomProductData {
  width: string;
  height: string;
  material: string;
  model: string;
  price: number;
  quantity: number;
  recipient: {
    name: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    village?: string;
    district?: string;
    city: string;
    province: string;
    postalCode: string;
    additionalInfo?: string;
  };
  userId: string;
}

export const saveAddress = async (
  address: Prisma.ShippingAddressUncheckedCreateInput,
) => {
  const newAddress = await prisma.shippingAddress.create({ data: address });

  revalidatePath("/", "layout");
  return newAddress;
};

const extractFormData = (data: FormData): CustomProductData | null => {
  try {
    return {
      width: data.get("width") as string,
      height: data.get("length") as string,
      material: data.get("material") as string,
      model: data.get("model") as string,
      price: parseFloat(data.get("price") as string),
      quantity: Number(data.get("quantity") as string),
      recipient: {
        name: data.get("recipient_name") as string,
        phoneNumber: data.get("recipient_phone_number") as string,
      },
      address: {
        street: data.get("street") as string,
        village: data.get("village") as string,
        district: data.get("district") as string,
        city: data.get("city") as string,
        province: data.get("province") as string,
        postalCode: data.get("postal_code") as string,
        additionalInfo: data.get("additional_info") as string,
      },
      userId: data.get("user_id") as string,
    };
  } catch (error) {
    console.error("Error extracting form data:", error);
    return null;
  }
};

const validateCustomProductData = (data: CustomProductData): boolean => {
  const requiredFields = [
    data.width,
    data.height,
    data.material,
    data.model,
    data.price,
    data.quantity,
    data.recipient.name,
    data.recipient.phoneNumber,
    data.address.street,
    data.address.city,
    data.address.province,
    data.address.postalCode,
  ];

  return requiredFields.every(
    (field) => field !== undefined && field !== null && field !== "",
  );
};

export const addCustomProductByUser = async (formData: FormData) => {
  try {
    const data = extractFormData(formData);

    if (!data) {
      return ActionResponses.serverError("Failed to process form data");
    }

    if (!validateCustomProductData(data)) {
      return ActionResponses.serverError("Missing required fields");
    }

    const address = buildShipmentAddressString({
      additional_info: data.address.additionalInfo ?? null,
      city: data.address.city,
      created_at: new Date(),
      district: data.address.district || "-",
      id: "",
      is_primary: false,
      postal_code: data.address.postalCode,
      province: data.address.province,
      recipient_name: data.recipient.name,
      recipient_phone_number: data.recipient.phoneNumber,
      street: data.address.street,
      updated_at: new Date(),
      user_id: "",
      village: data.address.village || "-",
    });

    const productCustom = await createProductCustom({
      width: data.width,
      height: data.height,
      price: data.price,
      material: data.material,
      model: data.model,
      address,
      userId: data.userId,
      recipient_name: data.recipient.name,
      recipient_phone_number: data.recipient.phoneNumber,
      quantity: data.quantity,
      is_custom_carrier: false,
    });

    if (!productCustom) {
      return ActionResponses.serverError("Failed to create Product Custom");
    }

    // Update the user's cart
    const cart = await prisma.cart.findUnique({
      where: { user_id: data.userId },
    });
    if (!cart || (cart.json_content as unknown as any).items.length === 0) {
      await updateCart({
        type: "custom",
        items: [
          {
            ...productCustom,
            shipping_price: productCustom.shipping_price ?? undefined,
          },
        ],
      });
      revalidatePath("/");
      return ActionResponses.success(productCustom);
    }

    if (!isCustomCart(cart.json_content))
      return ActionResponses.badRequest("Cart is not a custom request cart");

    await updateCart({
      type: "custom",
      items: [
        ...cart.json_content.items,
        {
          ...productCustom,
          shipping_price: productCustom.shipping_price ?? undefined,
        },
      ],
    });

    revalidatePath("/", "layout");
    return ActionResponses.success(productCustom);
  } catch (error) {
    console.error("Error creating custom product:", error);
    return ActionResponses.serverError("Failed to create Product Custom");
  }
};
