"use client";

import { useAtom, useSetAtom } from "jotai";
import {
  cartItemsAtom,
  cartTotalAtom,
  cartDiscountAtom,
  removeFromCartAtom,
  clearCartAtom,
} from "@/store/cart";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

function CartPage() {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [totalDiscount] = useAtom(cartDiscountAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const clearCart = useSetAtom(clearCartAtom);
  const t = useTranslations();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-xl mb-4">
          {t("pages.cart.emptyCart")}
        </p>
        <LanguageAwareLink
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors"
        >
          {t("pages.cart.continueShopping")}
        </LanguageAwareLink>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("pages.cart.title")}</h1>
        <button
          onClick={() => clearCart()}
          className="text-destructive hover:underline"
        >
          {t("pages.cart.clearCart")}
        </button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => {
          return (
            <ProductCard
              key={item.id}
              product={item}
              variant="compact"
              quantity={item.quantity}
              onRemove={() => removeFromCart(item.id)}
              removeLabel={t("pages.cart.remove")}
            />
          );
        })}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="space-y-2">
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">
                {t("pages.cart.totalDiscount")}
              </span>
              <span className="font-semibold text-green-600">
                -{formatPrice(totalDiscount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-2xl font-bold">
            <span>{t("pages.cart.total")}</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>
        <LanguageAwareLink
          href="/checkout"
          className="block w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors text-center"
        >
          {t("pages.cart.proceedToCheckout")}
        </LanguageAwareLink>
      </div>
    </div>
  );
}

export default CartPage;
