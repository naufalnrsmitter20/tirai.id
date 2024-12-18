export type CartItem = {
  id: string; // Unique identifier for the cart item
  categoryName: string;
  photo: string;
  productId?: string; // Product ID (if adding a product)
  variantId?: string; // Variant ID (if adding a variant)
  name: string; // Product or variant name
  variantName?: string; // Optional variant name (if applicable)
  pricePerItem: number; // Price per product or variant
  quantity: number; // Quantity of the item
};
