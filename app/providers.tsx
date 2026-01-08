"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./lib/api";
import { cartToastAtom } from "./store/cart";
import { showApiError, showApiSuccess } from "./lib/apiToast";
import { Provider as JotaiProvider } from "jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Analytics } from "@vercel/analytics/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster />
          <Analytics />
          <AuthProvider>
            {children}
            <CartToastListener />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}

const CartToastListener = () => {
  const [toast, setToast] = useAtom(cartToastAtom);
  const t = useTranslations("pages.cart");

  useEffect(() => {
    if (!toast) return;

    // Clear immediately to prevent re-triggering
    setToast(null);

    const { type, titleKey, params } = toast;

    // Get translations
    const title = t(titleKey, params);
    const description =
      "descriptionKey" in toast ? t(toast.descriptionKey, params) : undefined;

    if (type === "error") {
      // Create a simple wrapper function for the translation
      const translateFn = (key: string) => t(key);
      showApiError(new Error(title), translateFn, description);
    }

    if (type === "success") {
      showApiSuccess(title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return null;
};
