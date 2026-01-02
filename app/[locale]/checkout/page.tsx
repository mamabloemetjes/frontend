"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cartItemsAtom, cartTotalAtom, clearCartAtom } from "@/store/cart";
import { api, type OrderRequest } from "@/lib/api";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import Image from "next/image";
import { useSetAtom } from "jotai";
import type { AxiosError } from "axios";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const clearCart = useSetAtom(clearCartAtom);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    house_no: "",
    postal_code: "",
    city: "",
    country: "NL",
    customer_note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = t("order.checkout.validationError");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = t("order.checkout.validationError");
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = t("order.checkout.validationError");
    }

    if (!formData.street.trim() || formData.street.length < 2) {
      newErrors.street = t("order.checkout.validationError");
    }

    if (!formData.house_no.trim()) {
      newErrors.house_no = t("order.checkout.validationError");
    }

    if (!formData.postal_code.trim() || formData.postal_code.length < 4) {
      newErrors.postal_code = t("order.checkout.validationError");
    }

    if (!formData.city.trim() || formData.city.length < 2) {
      newErrors.city = t("order.checkout.validationError");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setError(t("order.checkout.emptyCart"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert cart items to products map
      const products: Record<string, number> = {};
      cartItems.forEach((item) => {
        products[item.id] = item.quantity;
      });

      const orderData: OrderRequest = {
        ...formData,
        products,
      };

      console.log("[Checkout] Creating order with data:", orderData);
      const response = await api.orders.create(orderData);
      console.log("[Checkout] Received response:", response);

      if (response.success) {
        console.log(
          "[Checkout] Order created successfully, clearing cart and redirecting",
        );
        // Clear cart
        clearCart();

        // Redirect to confirmation page
        router.push(
          `/order-confirmation/${response.data.order_number}?orderPlaced=true`,
        );
      } else {
        console.error(
          "[Checkout] Order creation failed - success=false:",
          response,
        );
        setError(response.message || t("order.checkout.orderFailed"));
      }
    } catch (err) {
      const error = err as AxiosError<{
        message?: string;
        data?: { cooldown_minutes?: number };
      }>;
      console.error("[Checkout] Order creation exception:", error);
      console.error("[Checkout] Error response:", error.response);
      console.error("[Checkout] Error data:", error.response?.data);

      // Check for rate limit error
      if (error.response?.status === 429) {
        const cooldownMinutes =
          error.response?.data?.data?.cooldown_minutes || 30;
        setError(
          t("order.checkout.rateLimitError", { minutes: cooldownMinutes }) ||
            `Please wait ${cooldownMinutes} minutes before placing another order.`,
        );
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            t("order.checkout.orderFailedDescription"),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("order.checkout.customerInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.phone")} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+31 612345678"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("order.checkout.deliveryAddress")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.street")} *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.street ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.houseNumber")} *
                  </label>
                  <input
                    type="text"
                    name="house_no"
                    value={formData.house_no}
                    onChange={handleInputChange}
                    placeholder="12A"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.house_no ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.house_no && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.house_no}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.postalCode")} *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="1234 AB"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.postal_code ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.postal_code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postal_code}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.city")} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.city ? "border-red-500" : "border-input"
                    }`}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    {t("order.checkout.customerNote")}
                  </label>
                  <textarea
                    name="customer_note"
                    value={formData.customer_note}
                    onChange={handleInputChange}
                    placeholder={t("order.checkout.customerNotePlaceholder")}
                    rows={3}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("order.checkout.placingOrder")
                : t("order.checkout.placeOrder")}
            </button>
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
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
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
