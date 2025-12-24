import { useAtom, useSetAtom } from "jotai";
import {
  cartItemsAtom,
  cartTotalAtom,
  cartDiscountAtom,
  removeFromCartAtom,
  clearCartAtom,
} from "@/store/cart";
import { useTranslation } from "react-i18next";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";

function CartPage() {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [totalDiscount] = useAtom(cartDiscountAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const clearCart = useSetAtom(clearCartAtom);
  const { t } = useTranslation();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-xl mb-4">
          {t("pages.cart.emptyCart")}
        </p>
        <LanguageAwareLink
          to="/"
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
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-2xl">
                  🌸
                </div>
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    €{(item.price - item.discount).toFixed(2)}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-muted-foreground line-through">
                      €{item.price.toFixed(2)}
                    </span>
                  )}
                  <span>× {item.quantity}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">
                €{((item.price - item.discount) * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-destructive hover:underline text-sm"
              >
                {t("pages.cart.remove")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="space-y-2">
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">
                {t("pages.cart.totalDiscount")}
              </span>
              <span className="font-semibold text-green-600">
                -€{totalDiscount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-2xl font-bold">
            <span>{t("pages.cart.total")}</span>
            <span>€{cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
          {t("pages.cart.proceedToCheckout")}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
