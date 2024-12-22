import { ShippingAddress } from "@prisma/client";

export const buildShipmentAddressString = (
  shipping_address: ShippingAddress,
) => {
  const { street, city, village, district, province, postal_code } =
    shipping_address;

  return `${street}, ${village}, ${district}, ${city}, ${province}, Indonesia, ${postal_code} (${shipping_address.additional_info}) ${shipping_address.recipient_name} (${shipping_address.recipient_phone_number})`;
};
