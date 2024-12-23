import { updateCart } from "@/actions/cart";
import { PageContainer } from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { Cart } from "@/types/cart";
import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "./components/CheckoutForm";
import { isCustomCart } from "@/lib/utils";

export default async function Checkout() {
  const session = await getServerSession();
  if (!session?.user) return notFound();

  const addresses = await prisma.shippingAddress.findMany({
    where: {
      user_id: session?.user?.id,
    },
  });
  const cartFetch = await prisma.cart.findUnique({
    where: {
      user_id: session.user.id,
    },
  });

  if (!cartFetch) return redirect("/cart");

  const cart = isCustomCart(cartFetch.json_content)
    ? cartFetch.json_content
    : (cartFetch.json_content as Cart & { type: "ready-stock" });

  const products =
    cart.type === "ready-stock"
      ? await prisma.product.findMany({
          where: {
            id: {
              in: cart.items.map((i) => i.productId),
            },
          },
          include: {
            variants: true,
          },
        })
      : undefined;

  // Update the cart in case the user does not come from the cart page
  const filteredCart =
    cart.type === "ready-stock"
      ? cart.items.filter((item) => {
          const product = products!.find(
            (product) => product.id === item.productId,
          );
          if (!product) return false;

          if (product.price !== null) return true;

          return product.variants.some(
            (variant) => variant.id === item.variantId,
          );
        })
      : undefined;

  if (
    cart.type === "ready-stock" &&
    filteredCart!.length !== cart.items.length
  ) {
    await updateCart({ type: "ready-stock", items: filteredCart! });
  }

  if (cart.type === "ready-stock" && filteredCart!.length === 0) {
    return redirect("/cart");
  }

  const customRequest =
    cart.type === "custom"
      ? await prisma.customRequest.findUnique({ where: { id: cart.item?.id } })
      : undefined;

  return (
    <PageContainer className="flex h-[90vh] px-4 text-black">
      <CheckoutForm
        addresses={addresses}
        cartItems={cart.type === "ready-stock" ? cart.items : undefined}
        products={products}
        customRequest={
          customRequest
            ? {
                ...customRequest,
                shipping_price: customRequest.shipping_price ?? undefined,
              }
            : undefined
        }
      />
    </PageContainer>
  );
}
