/**
 * Environment configuration for feature flags and application settings.
 *
 * This module provides type-safe access to environment variables and feature flags.
 * Variables prefixed with VITE_ are available in the browser.
 */

export interface FeatureFlags {
  /** Enable/disable login functionality */
  enableLogin: boolean;
  /** Enable/disable registration functionality */
  enableRegister: boolean;
}

function parseBooleanEnv(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value === "") {
    return defaultValue;
  }

  const normalizedValue = value.toLowerCase().trim();
  const truthyValues = ["true", "1", "yes", "on", "enabled"];
  const falsyValues = ["false", "0", "no", "off", "disabled"];

  if (truthyValues.includes(normalizedValue)) {
    return true;
  }

  if (falsyValues.includes(normalizedValue)) {
    return false;
  }

  return defaultValue;
}

// Environment configuration object.
export const env = {
  /** API base URL */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082",

  /** Node environment */
  nodeEnv: process.env.NODE_ENV || "development",

  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON || "",

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",

  shopOwnerEmail: process.env.NEXT_PUBLIC_SHOP_OWNER_EMAIL || "",

  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  freeShippingThreshold: parseFloat(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "50",
  ),

  /** Feature flags */
  features: {
    enableLogin: parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_LOGIN, true),
    enableRegister: parseBooleanEnv(
      process.env.NEXT_PUBLIC_ENABLE_REGISTER,
      true,
    ),
  },
} as const;

export type Env = typeof env;
