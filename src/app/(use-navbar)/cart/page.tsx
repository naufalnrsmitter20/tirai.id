import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { isCustomCart, isReadyStockCart } from "@/lib/utils";
import { CartItems } from "./components/Cart";
import { EmptyCart } from "./components/EmptyCart";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { findCustomRequests } from "@/utils/database/customRequest.query";

export default async function CartPage() {
  const session = await getServerSession();

  const discount =
    session && session.user
      ? await findDiscountByRole(session.user.role)
      : null;

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
      ? await findCustomRequests({
          id: { in: cart.json_content.items.map((i) => i.id) },
        })
      : null;

  return (
    <PageContainer>
      <CartItems
        products={products}
        customRequests={customRequestCart ? customRequestCart : null}
        discount={discount}
      />
    </PageContainer>
  );
}
