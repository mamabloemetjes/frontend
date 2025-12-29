"use client";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  image?: string;
  availableStock: number;
}

type CartToast =
  | {
      type: "error";
      titleKey: "insufficientStock";
      descriptionKey: "insufficientStockDescription";
      params: { name: string };
    }
  | {
      type: "success";
      titleKey: "addedToCart";
      params: { name: string };
    };

// Persist cart to localStorage
export const cartItemsAtom = atomWithStorage<CartItem[]>("cart", []);
export const cartToastAtom = atom<CartToast | null>(null);

// Derived atom - calculate total price
export const cartTotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce(
    (sum, item) => sum + (item.price - item.discount) * item.quantity,
    0,
  );
});

// Derived atom - calculate total discount
export const cartDiscountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.discount * item.quantity, 0);
});

// Derived atom - count total items
export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.quantity, 0);
});

// Action atom - add item to cart
export const addToCartAtom = atom(
  null,
  (get, set, product: Omit<CartItem, "quantity">) => {
    const items = get(cartItemsAtom);
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= existingItem.availableStock) {
        set(cartToastAtom, {
          type: "error",
          titleKey: "insufficientStock",
          descriptionKey: "insufficientStockDescription",
          params: { name: product.name },
        });
        return;
      }

      set(
        cartItemsAtom,
        items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      set(cartItemsAtom, [...items, { ...product, quantity: 1 }]);
    }

    set(cartToastAtom, {
      type: "success",
      titleKey: "addedToCart",
      params: { name: product.name },
    });
  },
);

// Action atom - remove item from cart
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const items = get(cartItemsAtom);
  set(
    cartItemsAtom,
    items.filter((item) => item.id !== productId),
  );
});

// Action atom - update quantity
export const updateQuantityAtom = atom(
  null,
  (get, set, { id, quantity }: { id: string; quantity: number }) => {
    const items = get(cartItemsAtom);
    if (quantity <= 0) {
      set(
        cartItemsAtom,
        items.filter((item) => item.id !== id),
      );
    } else {
      set(
        cartItemsAtom,
        items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  },
);

// Action atom - clear cart
export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, []);
});
