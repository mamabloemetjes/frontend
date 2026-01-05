import { toast } from "sonner";
import { ApiError } from "@/lib/api";

/**
 * Show a toast notification for API errors
 * Handles backend error codes and translates them using i18n
 */
export async function showApiError(
  error: unknown,
  t: (key: string) => string,
  fallbackMessage?: string,
) {
  const requestFailed = fallbackMessage || t("toasts.apiErrors.requestFailed");

  if (error instanceof ApiError) {
    // Get the backend message (which should be an error code like "error.auth.invalidCredentials")
    const backendMessage = error.message;

    // Check if the backend message is an error code (starts with "error." or "success.")
    const isErrorCode =
      backendMessage.startsWith("error.") ||
      backendMessage.startsWith("success.");

    // If it's an error code, translate it using the backend namespace
    // The backend sends codes like "error.uniqueViolation.email"
    // We need to translate them as "backend.error.uniqueViolation.email"
    let translatedMessage = backendMessage;

    if (isErrorCode) {
      try {
        translatedMessage = t(`backend.${backendMessage}`);
        // If translation returns the same key, it wasn't found - use the original message
        if (translatedMessage === `backend.${backendMessage}`) {
          translatedMessage = backendMessage;
        }
      } catch {
        // Translation failed, use original message
        translatedMessage = backendMessage;
      }
    }

    // Handle rate limiting specifically
    if (error.status === 429) {
      toast.error(t("toasts.apiErrors.tooManyRequests"), {
        description:
          translatedMessage || t("toasts.apiErrors.rateLimitDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle CSRF errors
    if (error.status === 403 && backendMessage.toLowerCase().includes("csrf")) {
      toast.error(t("toasts.apiErrors.sessionExpired"), {
        description: t("toasts.apiErrors.sessionExpiredDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle authentication errors (401)
    if (error.status === 401) {
      toast.error(t("toasts.apiErrors.authenticationRequired"), {
        description:
          translatedMessage ||
          t("toasts.apiErrors.authenticationRequiredDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle forbidden errors (403)
    if (error.status === 403) {
      toast.error(t("toasts.apiErrors.accessDenied"), {
        description:
          translatedMessage || t("toasts.apiErrors.accessDeniedDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle validation errors (400)
    if (error.status === 400) {
      toast.error(t("toasts.apiErrors.invalidRequest"), {
        description:
          translatedMessage || t("toasts.apiErrors.invalidRequestDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle not found errors (404)
    if (error.status === 404) {
      toast.error(t("toasts.apiErrors.notFound"), {
        description:
          translatedMessage || t("toasts.apiErrors.notFoundDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle conflict errors (409)
    if (error.status === 409) {
      toast.error(t("toasts.apiErrors.alreadyExists"), {
        description:
          translatedMessage || t("toasts.apiErrors.alreadyExistsDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle server errors (500+)
    if (error.status >= 500) {
      toast.error(t("toasts.apiErrors.serverError"), {
        description:
          translatedMessage || t("toasts.apiErrors.serverErrorDescription"),
        duration: 10000,
      });
      return;
    }

    // Generic API error with backend message
    toast.error(requestFailed, {
      description: translatedMessage || requestFailed,
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
      toast.error(t("toasts.apiErrors.connectionProblem"), {
        description: t("toasts.apiErrors.connectionProblemDescription"),
        duration: 10000,
      });
      return;
    }

    toast.error(error.message || t("toasts.apiErrors.error"), {
      description: requestFailed || error.message,
      duration: 10000,
    });
    return;
  }

  // Fallback for unknown errors
  toast.error(t("toasts.apiErrors.error"), {
    description: requestFailed,
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
