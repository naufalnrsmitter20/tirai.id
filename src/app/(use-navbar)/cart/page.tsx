import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { isCustomCart, isReadyStockCart } from "@/lib/utils";
import { CartItems } from "./components/Cart";
import { EmptyCart } from "./components/EmptyCart";

export default async function CartPage() {
  const session = await getServerSession();

  const cart = session?.user?.id
    ? await prisma.cart.findUnique({
        where: { user_id: session.user.id },
      })
    : "not found";

  if (cart === null) {
    return (
      <SectionContainer id="cart">
        <EmptyCart />
      </SectionContainer>
    );
  }

  const products =
    cart !== "not found" && isReadyStockCart(cart.json_content)
      ? await prisma.product.findMany({
          where: {
            id: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              in: cart.json_content.items.map((item) => item.productId),
            },
          },
          include: { variants: true },
        })
      : null;

  const customRequestCart =
    cart !== "not found" && isCustomCart(cart.json_content)
      ? cart.json_content.item
      : null;

  const customRequest = customRequestCart
    ? await prisma.customRequest.findUnique({
        where: { id: customRequestCart.id },
      })
    : null;

  return (
    <PageContainer>
      <CartItems
        products={products}
        customRequest={
          customRequest
            ? {
                ...customRequest,
                shipping_price: customRequest?.shipping_price ?? undefined,
              }
            : null
        }
      />
    </PageContainer>
  );
}
