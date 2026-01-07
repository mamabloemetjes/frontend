import { z } from "zod";

// ============================================================================
// Authentication Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "validation.email.required")
    .email("validation.email.invalid"),
  password: z
    .string()
    .min(8, "validation.password.minLength")
    .max(100, "validation.password.maxLength"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "validation.username.minLength")
      .max(50, "validation.username.maxLength")
      .regex(/^[a-zA-Z0-9_-]+$/, "validation.username.invalid"),
    email: z
      .string()
      .min(1, "validation.email.required")
      .email("validation.email.invalid"),
    password: z
      .string()
      .min(8, "validation.password.minLength")
      .max(100, "validation.password.maxLength"),
    confirmPassword: z.string().min(1, "validation.confirmPassword.required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.confirmPassword.noMatch",
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
      .min(2, "validation.name.minLength")
      .max(100, "validation.name.maxLength"),
    email: z
      .string()
      .min(1, "validation.email.required")
      .email("validation.email.invalid"),
    phone: z
      .string()
      .min(10, "validation.phone.minLength")
      .max(20, "validation.phone.maxLength")
      .regex(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        "validation.phone.invalid",
      ),
    customer_note: z
      .string()
      .max(500, "validation.customerNote.maxLength")
      .optional()
      .or(z.literal("")),

    // Address Data
    street: z
      .string()
      .min(2, "validation.street.minLength")
      .max(200, "validation.street.maxLength"),
    house_no: z
      .string()
      .min(1, "validation.houseNumber.required")
      .max(10, "validation.houseNumber.maxLength"),
    postal_code: z
      .string()
      .min(7, "validation.postalCode.minLength")
      .max(7, "validation.postalCode.maxLength")
      .regex(/^[0-9]{4}\s[A-Z]{2}$/i, "validation.postalCode.invalid"),
    city: z
      .string()
      .min(2, "validation.city.minLength")
      .max(100, "validation.city.maxLength"),
    country: z.string().length(2, "validation.country.invalid").optional(),
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
    .min(2, "validation.name.minLength")
    .max(100, "validation.name.maxLength"),
  email: z
    .string()
    .min(1, "validation.email.required")
    .email("validation.email.invalid"),
  subject: z.enum(["generalInquiry", "customOrder"], {
    message: "validation.subject.required",
  }),
  message: z
    .string()
    .min(10, "validation.message.minLength")
    .max(2000, "validation.message.maxLength"),
  deadlineDate: z.date().optional(),
});

// ============================================================================
// Product Schemas (Admin)
// ============================================================================

export const productImageSchema = z.object({
  url: z.string().url("validation.product.image.url"),
  alt_text: z
    .string()
    .max(200, "validation.product.image.altText.maxLength")
    .optional()
    .or(z.literal("")),
  is_primary: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "validation.product.name.minLength")
    .max(200, "validation.product.name.maxLength"),
  price: z
    .number()
    .int("validation.product.price.integer")
    .nonnegative("validation.product.price.nonNegative"),
  discount: z
    .number()
    .int("validation.product.discount.integer")
    .nonnegative("validation.product.discount.nonNegative")
    .optional()
    .or(z.literal(0)),
  tax: z
    .number()
    .int("validation.product.tax.integer")
    .nonnegative("validation.product.tax.nonNegative"),
  description: z
    .string()
    .min(10, "validation.product.description.minLength")
    .max(2000, "validation.product.description.maxLength"),
  is_active: z.boolean().default(true),
  images: z.array(productImageSchema).optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "validation.product.name.minLength")
    .max(200, "validation.product.name.maxLength")
    .optional(),
  price: z
    .number()
    .int("validation.product.price.integer")
    .nonnegative("validation.product.price.nonNegative")
    .optional(),
  discount: z
    .number()
    .int("validation.product.discount.integer")
    .nonnegative("validation.product.discount.nonNegative")
    .optional(),
  tax: z
    .number()
    .int("validation.product.tax.integer")
    .nonnegative("validation.product.tax.nonNegative")
    .optional(),
  description: z
    .string()
    .refine(
      (val) => val.length === 0 || val.length >= 10,
      "validation.product.description.minLength",
    )
    .refine(
      (val) => val.length <= 2000,
      "validation.product.description.maxLength",
    )
    .optional()
    .or(z.literal("")),
  is_active: z.boolean().optional(),
  images: z.array(productImageSchema).optional(),
});

// ============================================================================
// Admin Order Management Schemas
// ============================================================================

export const attachPaymentLinkSchema = z.object({
  payment_link: z.string().url("validation.paymentLink.url"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(
    [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
    {
      message: "validation.orderStatus.invalid",
    },
  ),
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
