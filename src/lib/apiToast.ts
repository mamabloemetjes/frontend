import { toast } from "sonner";
import { ApiError } from "./api";

/**
 * Show a toast notification for API errors
 * Prefers backend messages when available, falls back to user-friendly defaults
 */
export function showApiError(
  error: unknown,
  fallbackMessage = "Something went wrong",
) {
  if (error instanceof ApiError) {
    // Always prefer the backend message if it exists and is user-friendly
    const backendMessage = error.message;

    // Handle rate limiting specifically
    if (error.status === 429) {
      toast.error("Too many requests", {
        description:
          backendMessage ||
          "You're making too many requests. Please wait a moment and try again.",
        duration: 5000,
      });
      return;
    }

    // Handle CSRF errors
    if (error.status === 403 && backendMessage.toLowerCase().includes("csrf")) {
      toast.error("Session expired", {
        description: "Please refresh the page and try again.",
        duration: 5000,
      });
      return;
    }

    // Handle authentication errors (401)
    if (error.status === 401) {
      toast.error("Authentication required", {
        description: backendMessage || "Please log in to continue.",
        duration: 4000,
      });
      return;
    }

    // Handle forbidden errors (403)
    if (error.status === 403) {
      toast.error("Access denied", {
        description:
          backendMessage || "You don't have permission to perform this action.",
        duration: 4000,
      });
      return;
    }

    // Handle validation errors (400)
    if (error.status === 400) {
      toast.error("Invalid request", {
        description: backendMessage || "Please check your input and try again.",
        duration: 4000,
      });
      return;
    }

    // Handle not found errors (404)
    if (error.status === 404) {
      toast.error("Not found", {
        description: backendMessage || "The requested item could not be found.",
        duration: 4000,
      });
      return;
    }

    // Handle conflict errors (409)
    if (error.status === 409) {
      toast.error("Already exists", {
        description: backendMessage || "This item already exists.",
        duration: 4000,
      });
      return;
    }

    // Handle server errors (500+)
    if (error.status >= 500) {
      toast.error("Server error", {
        description:
          backendMessage ||
          "Something went wrong on our end. Please try again in a moment.",
        duration: 5000,
      });
      return;
    }

    // Generic API error with backend message
    toast.error("Request failed", {
      description: backendMessage || fallbackMessage,
      duration: 4000,
    });
    return;
  }

  // Handle network errors
  if (error instanceof Error) {
    if (
      error.message.includes("Network Error") ||
      error.message.includes("timeout")
    ) {
      toast.error("Connection problem", {
        description:
          "Unable to reach the server. Please check your internet connection.",
        duration: 5000,
      });
      return;
    }

    toast.error(error.message || "Error", {
      description: fallbackMessage || error.message,
      duration: 4000,
    });
    return;
  }

  // Fallback for unknown errors
  toast.error("Error", {
    description: fallbackMessage,
    duration: 4000,
  });
}

/**
 * Show a success toast for API operations
 */
export function showApiSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000,
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
      duration: 3000,
    });
  } else {
    toast.error(message, {
      id: toastId,
      description,
      duration: 4000,
    });
  }
}
