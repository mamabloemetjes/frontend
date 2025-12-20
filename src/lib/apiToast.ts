import { toast } from "sonner";
import { ApiError } from "./api";
import i18n from "@/i18n";
/**
 * Show a toast notification for API errors
 * Prefers backend messages when available, falls back to user-friendly defaults
 */
export function showApiError(
  error: unknown,
  fallbackMessage = i18n.t("toasts.apiErrors.requestFailed"),
) {
  if (error instanceof ApiError) {
    // Always prefer the backend message if it exists and is user-friendly
    const backendMessage = error.message;

    // Handle rate limiting specifically
    if (error.status === 429) {
      toast.error(i18n.t("toasts.apiErrors.tooManyRequests"), {
        description:
          backendMessage || i18n.t("toasts.apiErrors.rateLimitDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle CSRF errors
    if (error.status === 403 && backendMessage.toLowerCase().includes("csrf")) {
      toast.error(i18n.t("toasts.apiErrors.sessionExpired"), {
        description: i18n.t("toasts.apiErrors.sessionExpiredDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle authentication errors (401)
    if (error.status === 401) {
      toast.error(i18n.t("toasts.apiErrors.authenticationRequired"), {
        description:
          backendMessage ||
          i18n.t("toasts.apiErrors.authenticationRequiredDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle forbidden errors (403)
    if (error.status === 403) {
      toast.error(i18n.t("toasts.apiErrors.accessDenied"), {
        description:
          backendMessage || i18n.t("toasts.apiErrors.accessDeniedDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle validation errors (400)
    if (error.status === 400) {
      toast.error(i18n.t("toasts.apiErrors.invalidRequest"), {
        description:
          backendMessage ||
          i18n.t("toasts.apiErrors.invalidRequestDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle not found errors (404)
    if (error.status === 404) {
      toast.error(i18n.t("toasts.apiErrors.notFound"), {
        description:
          backendMessage || i18n.t("toasts.apiErrors.notFoundDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle conflict errors (409)
    if (error.status === 409) {
      toast.error(i18n.t("toasts.apiErrors.alreadyExists"), {
        description:
          backendMessage || i18n.t("toasts.apiErrors.alreadyExistsDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle server errors (500+)
    if (error.status >= 500) {
      toast.error(i18n.t("toasts.apiErrors.serverError"), {
        description:
          backendMessage || i18n.t("toasts.apiErrors.serverErrorDescription"),
        duration: 10000,
      });
      return;
    }

    // Generic API error with backend message
    toast.error(i18n.t("toasts.apiErrors.requestFailed"), {
      description: backendMessage || fallbackMessage,
      duration: 10000,
    });
    return;
  }

  // Handle network errors
  if (error instanceof Error) {
    if (
      error.message.includes("Network Error") ||
      error.message.includes("timeout")
    ) {
      toast.error(i18n.t("toasts.apiErrors.connectionProblem"), {
        description: i18n.t("toasts.apiErrors.connectionProblemDescription"),
        duration: 10000,
      });
      return;
    }

    toast.error(error.message || i18n.t("toasts.apiErrors.error"), {
      description: fallbackMessage || error.message,
      duration: 10000,
    });
    return;
  }

  // Fallback for unknown errors
  toast.error(i18n.t("toasts.apiErrors.error"), {
    description: fallbackMessage,
    duration: 10000,
  });
}

/**
 * Show a success toast for API operations
 */
export function showApiSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 10000,
  });
}

/**
 * Show a loading toast that can be updated
 */
export function showApiLoading(message: string) {
  return toast.loading(message);
}

/**
 * Update an existing toast (useful for loading states)
 */
export function updateToast(
  toastId: string | number,
  type: "success" | "error",
  message: string,
  description?: string,
) {
  if (type === "success") {
    toast.success(message, {
      id: toastId,
      description,
      duration: 10000,
    });
  } else {
    toast.error(message, {
      id: toastId,
      description,
      duration: 10000,
    });
  }
}
