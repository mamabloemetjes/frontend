"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cartItemsAtom, cartTotalAtom, clearCartAtom } from "@/store/cart";
import { api, type OrderRequest } from "@/lib/api";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import Image from "next/image";
import { useSetAtom } from "jotai";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/lib/validation/schemas";
import { showSuccess, showError } from "@/lib/validation/utils";
import { useApiError } from "@/hooks/useApiError";

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const clearCart = useSetAtom(clearCartAtom);
  const { handleError } = useApiError();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      country: "NL",
    },
  });

  const onSubmit = async (data: typeof checkoutSchema._output) => {
    if (cartItems.length === 0) {
      showError(t("order.checkout.emptyCart"));
      return;
    }

    try {
      // Convert cart items to products map
      const products: Record<string, number> = {};
      cartItems.forEach((item) => {
        products[item.id] = item.quantity;
      });

      const orderData: OrderRequest = {
        ...data,
        products,
      };

      const response = await api.orders.create(orderData);

      showSuccess(
        t("order.checkout.orderSuccess"),
        t("order.checkout.orderSuccessDescription"),
      );

      // Clear cart
      clearCart();

      // Redirect to confirmation page
      router.push(
        `/order-confirmation/${response.data.order_number}?orderPlaced=true`,
      );
    } catch (error) {
      // Handle error with translation
      handleError(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {t("order.checkout.emptyCart")}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t("order.checkout.emptyCart")}
        </p>
        <LanguageAwareLink
          href="/products"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t("order.checkout.goToProducts")}
        </LanguageAwareLink>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("order.checkout.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("order.checkout.customerInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput
                    label={t("order.checkout.name")}
                    placeholder="John Doe"
                    error={errors.name?.message}
                    required
                    {...register("name")}
                  />
                </div>

                <FormInput
                  label={t("order.checkout.email")}
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  required
                  {...register("email")}
                />

                <FormInput
                  label={t("order.checkout.phone")}
                  type="tel"
                  placeholder="+31 612345678"
                  error={errors.phone?.message}
                  required
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("order.checkout.deliveryAddress")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label={t("order.checkout.street")}
                  placeholder="Kalverstraat"
                  error={errors.street?.message}
                  required
                  {...register("street")}
                />

                <FormInput
                  label={t("order.checkout.houseNumber")}
                  placeholder="12A"
                  error={errors.house_no?.message}
                  required
                  {...register("house_no")}
                />

                <FormInput
                  label={t("order.checkout.postalCode")}
                  placeholder="1234 AB"
                  error={errors.postal_code?.message}
                  required
                  {...register("postal_code")}
                />

                <FormInput
                  label={t("order.checkout.city")}
                  placeholder="Amsterdam"
                  error={errors.city?.message}
                  required
                  {...register("city")}
                />

                <div className="md:col-span-2">
                  <FormTextarea
                    label={t("order.checkout.customerNote")}
                    placeholder={t("order.checkout.customerNotePlaceholder")}
                    rows={3}
                    error={errors.customer_note?.message}
                    {...register("customer_note")}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold"
            >
              {isSubmitting
                ? t("order.checkout.placingOrder")
                : t("order.checkout.placeOrder")}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">
              {t("order.checkout.orderSummary")}
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      🌸
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.subtotal)}
                    </p>
                  </div>
                  <div className="font-semibold text-sm">
                    {formatPrice(item.subtotal * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t("order.checkout.total")}</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">
                💳 {t("order.confirmation.paymentInfo")}
              </p>
              <p>{t("order.confirmation.tikkiePayment")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
