"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import {
  CheckCircle,
  Mail,
  CreditCard,
  Package,
  Home,
  ShoppingBag,
  ChevronRight,
  Truck,
  Clock,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function OrderConfirmationPage() {
  const t = useTranslations();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const orderPlaced = searchParams.get("orderPlaced") === "true";
  useEffect(() => {
    // Only show confetti if coming directly from checkout
    if (orderPlaced) {
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [orderPlaced]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <LanguageAwareLink
                href="/"
                className="hover:text-foreground transition-colors"
              >
                {t("navigation.home")}
              </LanguageAwareLink>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li>
              <LanguageAwareLink
                href="/products"
                className="hover:text-foreground transition-colors"
              >
                {t("navigation.products")}
              </LanguageAwareLink>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li>
              <LanguageAwareLink
                href="/checkout"
                className="hover:text-foreground transition-colors"
              >
                {t("navigation.checkout")}
              </LanguageAwareLink>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li className="text-foreground font-medium" aria-current="page">
              {t("order.confirmation.title")}
            </li>
          </ol>
        </nav>

        {/* Pinterest-style masonry layout */}
        <div
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          style={{ columnFill: "balance" }}
        >
          {/* Card 1: Success Header with Order Number */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-linear-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 rounded-2xl shadow-xl p-8 border border-primary/30 dark:border-primary/50 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4 shadow-lg">
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {t("order.confirmation.thankYou")}
              </h1>
              <p className="text-lg text-primary/90 dark:text-primary/80 mb-6">
                {t("order.confirmation.orderPlaced")}
              </p>

              <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-primary/40 dark:border-primary/60">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("order.confirmation.orderNumber")}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-foreground tracking-wide">
                  {orderNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Email Confirmation */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-card rounded-2xl shadow-xl p-6 border border-border hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full shrink-0">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    {t("order.confirmation.emailSent")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("order.confirmation.orderPlaced")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payment Information */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-500/10 p-3 rounded-full shrink-0">
                  <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                    💳 {t("order.confirmation.paymentInfo")}
                  </h2>
                  <p className="text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                    {t("order.confirmation.tikkiePayment")}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    {t("order.confirmation.waitingForPayment")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: What Happens Next - Step by Step */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-card rounded-2xl shadow-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-8 h-8 text-primary" />
                {t("order.confirmation.orderDetails")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <span className="text-sm font-bold text-primary-foreground">
                      1
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      {t("order.confirmation.steps.checkEmail")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("order.confirmation.emailSent")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <span className="text-sm font-bold text-primary-foreground">
                      2
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      {t("order.confirmation.steps.payViaTikkie")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("order.confirmation.tikkiePayment")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <span className="text-sm font-bold text-primary-foreground">
                      3
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      {t("order.confirmation.steps.wePrepare")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("order.confirmation.waitingForPayment")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <span className="text-sm font-bold text-primary-foreground">
                      4
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      {t("order.confirmation.steps.delivery")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("order.confirmation.steps.deliveryDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Quick Actions */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-card rounded-2xl shadow-xl p-6 border border-border space-y-3">
              <h3 className="text-lg font-semibold mb-4">
                {t("order.confirmation.quickActions")}
              </h3>
              <LanguageAwareLink
                href="/"
                className="flex items-center gap-3 w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg"
              >
                <Home className="w-5 h-5" />
                {t("order.confirmation.backToHome")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/account"
                className="flex items-center gap-3 w-full border border-input py-3 px-4 rounded-lg font-semibold hover:bg-accent transition-all hover:shadow-md"
              >
                <Package className="w-5 h-5" />
                {t("order.confirmation.viewOrders")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/products"
                className="flex items-center gap-3 w-full border border-input py-3 px-4 rounded-lg font-semibold hover:bg-accent transition-all hover:shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                {t("order.confirmation.continueShopping")}
              </LanguageAwareLink>
            </div>
          </div>

          {/* Card 6: Handmade with Love */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-8 h-8 shrink-0 text-primary" />
                <h3 className="text-xl font-bold pt-1">
                  {t("order.confirmation.handmadeWithLove")}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("order.confirmation.handmadeWithLoveDescription")}
              </p>
            </div>
          </div>

          {/* Card 7: Need Help? */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-primary/20 dark:bg-primary/10 rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Mail className="w-6 h-6 text-primary" />
                {t("order.confirmation.needHelp")}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("order.confirmation.needHelpDescription")}
              </p>
              <LanguageAwareLink
                href="/contact"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                {t("order.confirmation.contactUs")}
              </LanguageAwareLink>
            </div>
          </div>

          {/* Card 8: Estimated Timeline */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-6 shadow-lg border border-muted-foreground/20 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-6 h-6 mt-1 text-primary shrink-0" />
                <h3 className="text-xl font-bold pt-1">
                  {t("order.confirmation.whatToExpect")}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("order.confirmation.timeline.paymentLink")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("order.confirmation.timeline.preparation")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("order.confirmation.timeline.packaging")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("order.confirmation.timeline.tracking")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
