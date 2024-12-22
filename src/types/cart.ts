export type Cart =
  | {
      type: "custom";
      item: CustomRequestItem;
    }
  | { type: "ready-stock"; items: CartItem[] };

export type CustomRequestItem = {
  material: string;
  model: string;
  color: string;
  width: string;
  height: string;
  price: number;
  size: string;
  shipping_price?: number;
};

export type CartItem = {
  id: string; // Unique identifier for the cart item
  categoryName: string;
  photo: string;
  productId: string;
  variantId?: string; // Variant ID (if adding a variant)
  name: string; // Product or variant name
  variantName?: string; // Optional variant name (if applicable)
  pricePerItem: number; // Price per product or variant
  quantity: number; // Quantity of the item
};
