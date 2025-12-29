import { toast } from "sonner";
import { ApiError } from "@/lib/api";

/**
 * Show a toast notification for API errors
 * Prefers backend messages when available, falls back to user-friendly defaults
 */
export async function showApiError(error: unknown, fallbackMessage?: string) {
  const t = (key: string) => {
    // Simple translation function placeholder
    const translations: Record<string, string> = {
      "toasts.apiErrors.requestFailed": "Request failed.",
      "toasts.apiErrors.tooManyRequests": "Too Many Requests",
      "toasts.apiErrors.rateLimitDescription":
        "You have made too many requests in a short period. Please try again later.",
      "toasts.apiErrors.sessionExpired": "Session Expired",
      "toasts.apiErrors.sessionExpiredDescription":
        "Your session has expired. Please refresh the page and try again.",
      "toasts.apiErrors.authenticationRequired": "Authentication Required",
      "toasts.apiErrors.authenticationRequiredDescription":
        "You need to be logged in to perform this action.",
      "toasts.apiErrors.accessDenied": "Access Denied",
      "toasts.apiErrors.accessDeniedDescription":
        "You do not have permission to access this resource.",
      "toasts.apiErrors.invalidRequest": "Invalid Request",
      "toasts.apiErrors.invalidRequestDescription":
        "The request was invalid. Please check your input and try again.",
      "toasts.apiErrors.notFound": "Not Found",
      "toasts.apiErrors.notFoundDescription":
        "The requested resource could not be found.",
      "toasts.apiErrors.alreadyExists": "Already Exists",
      "toasts.apiErrors.alreadyExistsDescription":
        "The resource you are trying to create already exists.",
      "toasts.apiErrors.serverError": "Server Error",
      "toasts.apiErrors.serverErrorDescription":
        "An error occurred on the server. Please try again later.",
      "toasts.apiErrors.connectionProblem": "Connection Problem",
      "toasts.apiErrors.connectionProblemDescription":
        "There was a problem connecting to the server. Please check your internet connection and try again.",
      "toasts.apiErrors.error": "An error occurred.",
    };
    return translations[key] || key;
  };
  const requestFailed = fallbackMessage || t("toasts.apiErrors.requestFailed");

  if (error instanceof ApiError) {
    // Always prefer the backend message if it exists and is user-friendly
    const backendMessage = error.message;

    // Handle rate limiting specifically
    if (error.status === 429) {
      toast.error(t("toasts.apiErrors.tooManyRequests"), {
        description:
          backendMessage || t("toasts.apiErrors.rateLimitDescription"),
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
          backendMessage ||
          t("toasts.apiErrors.authenticationRequiredDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle forbidden errors (403)
    if (error.status === 403) {
      toast.error(t("toasts.apiErrors.accessDenied"), {
        description:
          backendMessage || t("toasts.apiErrors.accessDeniedDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle validation errors (400)
    if (error.status === 400) {
      toast.error(t("toasts.apiErrors.invalidRequest"), {
        description:
          backendMessage || t("toasts.apiErrors.invalidRequestDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle not found errors (404)
    if (error.status === 404) {
      toast.error(t("toasts.apiErrors.notFound"), {
        description:
          backendMessage || t("toasts.apiErrors.notFoundDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle conflict errors (409)
    if (error.status === 409) {
      toast.error(t("toasts.apiErrors.alreadyExists"), {
        description:
          backendMessage || t("toasts.apiErrors.alreadyExistsDescription"),
        duration: 10000,
      });
      return;
    }

    // Handle server errors (500+)
    if (error.status >= 500) {
      toast.error(t("toasts.apiErrors.serverError"), {
        description:
          backendMessage || t("toasts.apiErrors.serverErrorDescription"),
        duration: 10000,
      });
      return;
    }

    // Generic API error with backend message
    toast.error(requestFailed, {
      description: backendMessage || requestFailed,
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
