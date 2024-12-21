import { PageContainer } from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Cart } from "./components/Cart";
import { CartItem } from "@/types/cart";
import { updateCart } from "@/actions/cart";

export default async function CartPage() {
  const session = await getServerSession();

  const cart = session?.user?.id
    ? await prisma.cart.findUnique({
        where: { user_id: session.user.id },
      })
    : "not found";

  if (cart === null) {
    await updateCart([]);
    return redirect("/cart");
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

  return (
    <PageContainer>
      <Cart products={products} />
    </PageContainer>
  );
}
