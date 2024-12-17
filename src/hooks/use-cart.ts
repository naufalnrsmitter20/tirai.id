"use client";

import { getCart, updateCart } from "@/actions/cart";
import { CartItem } from "@/types/cart";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [pendingUpdate, setPendingUpdate] = useState(false);

  const addItem = (item: CartItem) => {
    const existingItem = cart.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );

    if (existingItem) {
      return cart.map((i) =>
        i === existingItem ? { ...i, quantity: i.quantity + item.quantity } : i,
      );
    }

    setCart([...cart, item]);
    setPendingUpdate(true);
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    setPendingUpdate(true);
  };

  const clearCart = () => {
    setCart([]);
    setPendingUpdate(true);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await getCart();

      if (data) {
        setCart(data.cart);
      }
    };

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const syncCart = async () => {
      await updateCart(cart);
      setPendingUpdate(false);
    };

    if (pendingUpdate) {
      timer = setTimeout(() => {
        syncCart();
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [cart, pendingUpdate]);

  return { cart, setCart, addItem, removeItem, clearCart };
}
