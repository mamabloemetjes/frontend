"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { CheckCircle, Mail, CreditCard, Package, Home } from "lucide-react";

export default function OrderConfirmationPage() {
  const t = useTranslations();
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          {t("order.confirmation.thankYou")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("order.confirmation.orderPlaced")}
        </p>
      </div>

      {/* Order Number */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {t("order.confirmation.orderNumber")}
            </p>
            <p className="text-2xl font-bold">{orderNumber}</p>
          </div>
          <Package className="w-12 h-12 text-primary" />
        </div>
      </div>

      {/* Email Confirmation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex gap-4">
          <Mail className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              {t("order.confirmation.emailSent")}
            </h3>
            <p className="text-sm text-blue-800">
              {t("order.confirmation.orderPlaced")}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex gap-4">
          <CreditCard className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">
              {t("order.confirmation.paymentInfo")}
            </h3>
            <p className="text-sm text-yellow-800 mb-2">
              {t("order.confirmation.tikkiePayment")}
            </p>
            <p className="text-sm text-yellow-800">
              {t("order.confirmation.waitingForPayment")}
            </p>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          📋 {t("order.confirmation.orderDetails")}
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium">{t("order.confirmation.emailSent")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium">
                {t("order.confirmation.tikkiePayment")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium">
                {t("order.confirmation.waitingForPayment")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <LanguageAwareLink
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          {t("order.confirmation.backToHome")}
        </LanguageAwareLink>
        <LanguageAwareLink
          href="/account"
          className="flex-1 flex items-center justify-center gap-2 border border-input py-3 px-6 rounded-lg font-semibold hover:bg-accent transition-colors"
        >
          <Package className="w-5 h-5" />
          {t("order.confirmation.viewOrders")}
        </LanguageAwareLink>
      </div>
    </div>
  );
}
