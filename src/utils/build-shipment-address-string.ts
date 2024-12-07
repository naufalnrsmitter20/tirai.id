import { ShippingAddress } from "@prisma/client";

export const buildShipmentAddressString = (
  shipping_address: ShippingAddress,
) => {
  const { street, city, region, postal_code } = shipping_address;

  return `${street}, ${city}, ${region}, Indonesia, ${postal_code}`;
};
