"use client";

import { getCart, updateCart } from "@/actions/cart";
import { CartItem } from "@/types/cart";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";
import { isReadyStockCart } from "@/lib/utils";

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart");
  const { status } = useSession();

  const addItem = async (item: Omit<CartItem, "id">) => {
    if (cart === undefined) return;

    const existingItem = cart.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );

    if (existingItem) {
      setCart(
        cart.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        ),
      );
      await updateCart({
        type: "ready-stock",
        items: cart.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        ),
      });
      return;
    }

    console.log();
    setCart([...cart, { ...item, id: (cart.length + 1).toString() }]);
    await updateCart({
      type: "ready-stock",
      items: [...cart, { ...item, id: (cart.length + 1).toString() }],
    });
  };

  const editItem = async (
    id: string,
    updates: Partial<Omit<CartItem, "id">>,
  ) => {
    if (cart === undefined) return;

    setCart(
      cart.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );

    await updateCart({
      type: "ready-stock",
      items: cart.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  };

  const removeItem = async (id: string) => {
    if (cart === undefined) return;

    setCart(cart.filter((item) => item.id !== id));
    await updateCart({
      type: "ready-stock",
      items: cart.filter((item) => item.id !== id),
    });
  };

  const clearCart = async () => {
    if (cart === undefined) return;

    setCart([]);
    await updateCart({ type: "ready-stock", items: [] });
  };

  useEffect(() => {
    const initializeCart = async () => {
      if (status !== "loading" && status !== "authenticated") {
        setCart([]);
        return;
      }

      try {
        const { data } = await getCart();
        setCart(isReadyStockCart(data?.cart) ? data.cart.items : []);
      } catch (error) {
        console.error("Failed to initialize cart:", error);
        setCart([]);
      }
    };

    initializeCart();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cart, setCart, addItem, editItem, removeItem, clearCart };
}
