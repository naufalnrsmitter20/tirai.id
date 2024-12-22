import { updateCart } from "@/actions/cart";
import { PageContainer } from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { CartItem } from "@/types/cart";
import { redirect } from "next/navigation";
import { CartItems } from "./components/Cart";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { EmptyCart } from "./components/EmptyCart";
import { type Cart } from "@/types/cart";

const isCustomCart = (
  content: unknown,
): content is Cart & { type: "custom" } => {
  return (
    typeof content === "object" &&
    content !== null &&
    (content as Cart).type === "custom"
  );
};

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
    cart !== "not found"
      ? await prisma.product.findMany({
          where: {
            id: {
              in: (cart.json_content as CartItem[]).map(
                (item) => item.productId,
              ),
            },
          },
          include: { variants: true },
        })
      : null;

  const customRequest =
    cart !== "not found" && isCustomCart(cart.json_content)
      ? cart.json_content.item
      : null;

  return (
    <PageContainer>
      <CartItems products={products} customRequest={customRequest} />
    </PageContainer>
  );
}
