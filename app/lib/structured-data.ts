import { env } from "@/lib/env";

/**
 * Shared Structured Data Constants
 *
 * This file contains reusable structured data snippets for SEO and rich snippets
 * across the entire application. Import these constants to ensure consistency.
 */

const BASE_URL = env.baseUrl || "https://roosvansharon.nl";

// ============================================================================
// Business Information
// ============================================================================

export const BUSINESS_INFO = {
  name: "Roos van Sharon",
  description: "Handgemaakte viltbloemen voor rouwstukken en bruidsboeketten",
  logo: `${BASE_URL}/favicon.ico`,
  image: `${BASE_URL}/flower.webp`,
  founderName: "Francis van Wieringen",
  addressCountry: "NL",
  areaServed: "Nederland",
  priceRange: "€€",
  paymentAccepted: "Tikkie, Bank Transfer",
} as const;

// ============================================================================
// Brand Information (for Product schema)
// ============================================================================

export const BRAND_SCHEMA = {
  "@type": "Brand",
  name: BUSINESS_INFO.name,
} as const;

// ============================================================================
// Organization/Seller Information
// ============================================================================

export const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  name: BUSINESS_INFO.name,
} as const;

// ============================================================================
// Merchant Return Policy
// ============================================================================

export const MERCHANT_RETURN_POLICY_SCHEMA = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "NL",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
} as const;

// ============================================================================
// Shipping Details (for Netherlands)
// ============================================================================

export const SHIPPING_DETAILS_SCHEMA = {
  "@type": "OfferShippingDetails",
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "NL",
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate price valid until date (1 year from now)
 */
export const getPriceValidUntil = (): string => {
  return new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split("T")[0];
};

/**
 * Get full URL for a locale-specific path
 */
export const getFullUrl = (locale: string, path: string = ""): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
};

/**
 * Create a complete LocalBusiness schema
 */
export const createLocalBusinessSchema = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS_INFO.name,
  description: BUSINESS_INFO.description,
  url: getFullUrl(locale),
  logo: BUSINESS_INFO.logo,
  image: BUSINESS_INFO.image,
  founder: {
    "@type": "Person",
    name: BUSINESS_INFO.founderName,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: BUSINESS_INFO.addressCountry,
  },
  areaServed: BUSINESS_INFO.areaServed,
  priceRange: BUSINESS_INFO.priceRange,
  paymentAccepted: BUSINESS_INFO.paymentAccepted,
});

/**
 * Create a product offer schema with all required fields
 */
export const createProductOfferSchema = (
  productUrl: string,
  price: number,
  isActive: boolean = true,
) => ({
  "@type": "Offer",
  url: productUrl,
  priceCurrency: "EUR",
  price: (price / 100).toFixed(2),
  priceValidUntil: getPriceValidUntil(),
  availability: isActive
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock",
  itemCondition: "https://schema.org/NewCondition",
  seller: ORGANIZATION_SCHEMA,
  shippingDetails: SHIPPING_DETAILS_SCHEMA,
  hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY_SCHEMA,
});

/**
 * Create a basic product schema (for catalog items)
 */
export const createBasicProductSchema = (
  name: string,
  description: string,
  price: string,
  imageUrl?: string,
) => ({
  "@type": "Product",
  name,
  description,
  image: imageUrl || BUSINESS_INFO.image,
  brand: BRAND_SCHEMA,
  offers: {
    "@type": "Offer",
    price,
    priceCurrency: "EUR",
    priceValidUntil: getPriceValidUntil(),
    availability: "https://schema.org/InStock",
    hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY_SCHEMA,
  },
});

/**
 * Create a complete product schema with all details
 */
export const createProductSchema = (
  product: {
    id: string;
    name: string;
    description: string;
    sku: string;
    subtotal: number;
    discount?: number;
    is_active: boolean;
    images?: Array<{ url: string; alt_text?: string }>;
  },
  locale: string,
) => {
  const productUrl = getFullUrl(locale, `products/${product.id}`);
  const allImages = product.images || [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: allImages.map((img) => img.url),
    sku: product.sku,
    mpn: product.sku,
    brand: BRAND_SCHEMA,
    manufacturer: ORGANIZATION_SCHEMA,
    category: "Handmade Felt Flowers",
    offers: createProductOfferSchema(
      productUrl,
      product.subtotal,
      product.is_active,
    ),
    aggregateRating: product.is_active
      ? {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: "1",
        }
      : undefined,
  };
};

/**
 * Create breadcrumb structured data
 */
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Create product listing schema (ItemList)
 */
export const createProductListingSchema = (
  products: Array<{
    id: string;
    name: string;
    description: string;
    sku: string;
    subtotal: number;
    is_active: boolean;
    images?: Array<{ url: string }>;
  }>,
  locale: string,
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      "@id": getFullUrl(locale, `products/${product.id}`),
      url: getFullUrl(locale, `products/${product.id}`),
      name: product.name,
      description: product.description,
      image: product.images?.[0]?.url || BUSINESS_INFO.image,
      sku: product.sku,
      offers: createProductOfferSchema(
        getFullUrl(locale, `products/${product.id}`),
        product.subtotal,
        product.is_active,
      ),
    },
  })),
});

/**
 * Create about page structured data
 */
export const createAboutPageSchema = (locale: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Person",
    name: BUSINESS_INFO.founderName,
    jobTitle: "Felt Flower Artist",
    worksFor: {
      "@type": "Organization",
      name: BUSINESS_INFO.name,
      url: getFullUrl(locale),
    },
    description,
  },
});

/**
 * Create Open Graph metadata for a page
 */
export const createOpenGraphMetadata = (
  locale: string,
  title: string,
  description: string,
  path: string = "",
  imageAlt?: string,
) => ({
  title,
  description,
  url: getFullUrl(locale, path),
  siteName: BUSINESS_INFO.name,
  locale: locale === "nl" ? "nl_NL" : "en_US",
  type: "website" as const,
  images: [
    {
      url: `${BASE_URL}/flower.webp`,
      width: 1371,
      height: 1600,
      alt: imageAlt || `${BUSINESS_INFO.name} - ${title}`,
    },
  ],
});

/**
 * Create Twitter card metadata for a page
 */
export const createTwitterMetadata = (
  title: string,
  description: string,
  imageUrl?: string,
) => ({
  card: "summary_large_image" as const,
  title,
  description,
  images: [imageUrl || `${BASE_URL}/flower.webp`],
});
