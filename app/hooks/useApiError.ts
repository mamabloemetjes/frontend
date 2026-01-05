"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { showApiError, showApiSuccess } from "@/lib/apiToast";

/**
 * Hook to handle API errors with automatic translation support
 */
export function useApiError() {
  const t = useTranslations();

  const handleError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      showApiError(error, t, fallbackMessage);
    },
    [t],
  );

  const handleSuccess = useCallback(
    (message: string, description?: string) => {
      showApiSuccess(message, description);
    },
    [],
  );

  return {
    handleError,
    handleSuccess,
  };
}
