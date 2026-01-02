import { z } from "zod";

// ============================================================================
// Authentication Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, hyphens, and underscores",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Must be a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Order/Checkout Schemas
// ============================================================================

export const checkoutSchema = z
  .object({
    // Customer Data
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Must be a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(20, "Phone number must be at most 20 characters")
      .regex(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        "Please enter a valid phone number",
      ),
    customer_note: z
      .string()
      .max(500, "Note must be at most 500 characters")
      .optional()
      .or(z.literal("")),

    // Address Data
    street: z
      .string()
      .min(2, "Street must be at least 2 characters")
      .max(200, "Street must be at most 200 characters"),
    house_no: z
      .string()
      .min(1, "House number is required")
      .max(10, "House number must be at most 10 characters"),
    postal_code: z
      .string()
      .min(4, "Postal code must be at least 4 characters")
      .max(10, "Postal code must be at most 10 characters")
      .regex(
        /^[0-9]{4}\s?[A-Z]{2}$/i,
        "Please enter a valid Dutch postal code (e.g., 1234 AB)",
      ),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(100, "City must be at most 100 characters"),
    country: z
      .string()
      .length(2, "Country code must be exactly 2 characters")
      .optional(),
  })
  .transform((data) => ({
    ...data,
    country: data.country || "NL",
  }));

// ============================================================================
// Contact Form Schema
// ============================================================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email address"),
  subject: z.enum(["generalInquiry", "customOrder"]),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
  deadlineDate: z.date().optional(),
});

// ============================================================================
// Product Schemas (Admin)
// ============================================================================

export const productImageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  alt_text: z
    .string()
    .max(200, "Alt text must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  is_primary: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be at most 200 characters"),
  price: z
    .number()
    .int("Price must be an integer")
    .nonnegative("Price must be non-negative"),
  discount: z
    .number()
    .int("Discount must be an integer")
    .nonnegative("Discount must be non-negative")
    .optional()
    .or(z.literal(0)),
  tax: z
    .number()
    .int("Tax must be an integer")
    .nonnegative("Tax must be non-negative"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  is_active: z.boolean().default(true),
  images: z.array(productImageSchema).optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be at most 200 characters")
    .optional(),
  price: z
    .number()
    .int("Price must be an integer")
    .nonnegative("Price must be non-negative")
    .optional(),
  discount: z
    .number()
    .int("Discount must be an integer")
    .nonnegative("Discount must be non-negative")
    .optional(),
  tax: z
    .number()
    .int("Tax must be an integer")
    .nonnegative("Tax must be non-negative")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  is_active: z.boolean().optional(),
  images: z.array(productImageSchema).optional(),
});

// ============================================================================
// Admin Order Management Schemas
// ============================================================================

export const attachPaymentLinkSchema = z.object({
  payment_link: z.string().url("Must be a valid URL"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
});

// ============================================================================
// Type Exports
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type AttachPaymentLinkFormData = z.infer<typeof attachPaymentLinkSchema>;
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
