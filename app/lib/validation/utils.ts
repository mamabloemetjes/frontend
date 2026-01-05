import { toast } from "sonner";
import type { ZodError } from "zod";

/**
 * Translate validation error message if it's an i18n key
 * @param message - The error message (could be an i18n key like "validation.email.required")
 * @param t - Translation function from next-intl
 * @returns Translated message or original message if not a translation key
 */
export function translateValidationError(
  message: string,
  t: (key: string) => string,
): string {
  // Check if the message looks like an i18n key (contains dots and starts with "validation")
  if (message.startsWith("validation.")) {
    try {
      return t(message);
    } catch {
      // If translation fails, return the original message
      return message;
    }
  }
  return message;
}

/**
 * Format field name for display (converts snake_case to Title Case)
 */
export function formatFieldName(field: string): string {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get field errors from Zod validation error
 * @param error - ZodError object
 * @param t - Optional translation function to translate i18n keys
 */
export function getFieldErrors(
  error: ZodError,
  t?: (key: string) => string,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const field = err.path.join(".");
    const message = t ? translateValidationError(err.message, t) : err.message;
    fieldErrors[field] = message;
  });

  return fieldErrors;
}

/**
 * Show validation errors using Sonner toast
 * @param error - ZodError object
 * @param options - Optional settings including translation function
 */
export function showValidationErrors(
  error: ZodError,
  options?: { duration?: number; t?: (key: string) => string },
) {
  const fieldErrors = getFieldErrors(error, options?.t);
  const errorCount = Object.keys(fieldErrors).length;

  // Create a formatted error message
  const errorMessages = Object.entries(fieldErrors).map(([field, message]) => {
    const formattedField = formatFieldName(field);
    return `• ${formattedField}: ${message}`;
  });

  toast.error(
    errorCount === 1 ? "Validation Error" : `${errorCount} Validation Errors`,
    {
      description: errorMessages.join("\n"),
      duration: options?.duration || 5000,
    },
  );
}

/**
 * Show a single field error using Sonner toast
 */
export function showFieldError(field: string, message: string) {
  const formattedField = formatFieldName(field);

  toast.error("Validation Error", {
    description: `${formattedField}: ${message}`,
    duration: 4000,
  });
}

/**
 * Show success message using Sonner toast
 */
export function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show error message using Sonner toast
 */
export function showError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 5000,
  });
}

/**
 * Show info message using Sonner toast
 */
export function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 4000,
  });
}

/**
 * Get CSS classes for input based on error state
 */
export function getInputClassName(
  hasError: boolean,
  baseClassName?: string,
): string {
  const base =
    baseClassName ||
    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent";
  const errorClass = hasError
    ? "border-red-500 focus:ring-red-500"
    : "border-input";

  return `${base} ${errorClass}`;
}

/**
 * Get CSS classes for label based on error state
 */
export function getLabelClassName(
  hasError: boolean,
  baseClassName?: string,
): string {
  const base = baseClassName || "block text-sm font-medium mb-2";
  const errorClass = hasError ? "text-red-500" : "";

  return `${base} ${errorClass}`.trim();
}

/**
 * Validate form data and show errors
 * Returns the validated data if successful, null otherwise
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param options - Optional settings including translation function
 */
export function validateAndShowErrors<T>(
  schema: {
    safeParse: (data: unknown) => {
      success: boolean;
      data?: T;
      error?: ZodError;
    };
  },
  data: unknown,
  options?: {
    showToast?: boolean;
    duration?: number;
    t?: (key: string) => string;
  },
): T | null {
  const result = schema.safeParse(data);

  if (!result.success) {
    if (options?.showToast !== false && result.error) {
      showValidationErrors(result.error, {
        duration: options?.duration,
        t: options?.t,
      });
    }
    return null;
  }

  return result.data as T;
}

/**
 * Handle API errors and show appropriate toast
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "An error occurred",
) {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
          data?: {
            errors?: Array<{ field: string; message: string }>;
          };
        };
      };
    };

    // Check for validation errors from backend
    const backendErrors = apiError.response?.data?.data?.errors;
    if (backendErrors && Array.isArray(backendErrors)) {
      const errorMessages = backendErrors.map(
        (err) => `• ${formatFieldName(err.field)}: ${err.message}`,
      );

      toast.error(
        backendErrors.length === 1
          ? "Validation Error"
          : `${backendErrors.length} Validation Errors`,
        {
          description: errorMessages.join("\n"),
          duration: 5000,
        },
      );
      return;
    }

    // Show generic API error message
    const message = apiError.response?.data?.message || defaultMessage;
    showError(message);
  } else if (error instanceof Error) {
    showError(error.message);
  } else {
    showError(defaultMessage);
  }
}
