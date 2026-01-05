"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./lib/api";
import { cartToastAtom } from "./store/cart";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { showApiError, showApiSuccess } from "./lib/apiToast";
import { useTranslations } from "next-intl";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster />
        <AuthProvider>
          {children}
          <CartToastListener />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const CartToastListener = () => {
  const [toast, setToast] = useAtom(cartToastAtom);
  const t = useTranslations("toasts.cart");
  const tGeneral = useTranslations();

  useEffect(() => {
    if (!toast) return;

    if (toast.type === "error") {
      showApiError(
        new Error(t(toast.titleKey)),
        tGeneral,
        toast.descriptionKey
          ? t(toast.descriptionKey, toast.params)
          : undefined,
      );
    }

    if (toast.type === "success") {
      showApiSuccess(t(toast.titleKey, toast.params));
    }

    // Clear the toast so it doesn't trigger again
    setToast(null);
  }, [toast, t, tGeneral, setToast]);

  return null;
};
