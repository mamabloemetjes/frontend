"use server";

import { fetchProductById } from "@/hooks/useProducts";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";
import { Props } from "@/types";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/utils";
import {
  Truck,
  ShieldCheck,
  ChevronRight,
  Mail,
  Palette,
  Box,
  Flower2,
  ClipboardEditIcon,
} from "lucide-react";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import PriceExplanation from "@/components/PriceExplanation";

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  if (!id) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
  const { data, success } = await fetchProductById(id, true);

  if (!success || !data?.product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const { product } = data;
  const primaryImage = product.images?.find((img) => img.is_primary);
  const mainImage = primaryImage || product.images?.[0];
  const priceInEuros = (product.subtotal / 100).toFixed(2);

  // Create a clean description (first 155 characters for meta description)
  const metaDescription = product.description.substring(0, 155).trim() + "...";

  const baseUrl = env.baseUrl || "https://mamabloemetjes.nl";
  const productUrl = `${baseUrl}/${locale}/products/${product.id}`;

  return {
    title: `${product.name} - €${priceInEuros} | Mama Bloemetjes`,
    description: metaDescription,
    keywords: [
      product.name,
      "handmade bouquet",
      "flowers",
      "bloemen",
      "boeket",
      "Mama Bloemetjes",
      "handgemaakt",
      "fresh flowers",
      "verse bloemen",
    ],
    authors: [{ name: "Mama Bloemetjes" }],
    creator: "Mama Bloemetjes",
    publisher: "Mama Bloemetjes",
    alternates: {
      canonical: productUrl,
      languages: {
        nl: `${baseUrl}/nl/products/${product.id}`,
        en: `${baseUrl}/en/products/${product.id}`,
      },
    },
    openGraph: {
      title: `${product.name} - Mama Bloemetjes`,
      description: product.description,
      url: productUrl,
      siteName: "Mama Bloemetjes",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      type: "website",
      images: mainImage
        ? [
            {
              url: mainImage.url,
              width: 800,
              height: 800,
              alt: mainImage.alt_text || product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Mama Bloemetjes`,
      description: metaDescription,
      images: mainImage ? [mainImage.url] : [],
    },
    robots: {
      index: product.is_active,
      follow: true,
      googleBot: {
        index: product.is_active,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const ProductDetailPage = async ({ params }: Props) => {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.product" });

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {t("productNotFound")}
        </h1>
      </div>
    );
  }

  const { data, success } = await fetchProductById(id, true);

  if (!success) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {t("errorFetchingProduct")}
        </h1>
        <p>{t("pleaseTryAgainLater")}</p>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {t("productNotFound")}
        </h1>
      </div>
    );
  }

  const { product } = data;
  const hasDiscount = product.discount > 0;
  const originalPrice = product.subtotal + product.discount;
  const discountPercentage = hasDiscount
    ? Math.round((product.discount / originalPrice) * 100)
    : 0;

  const primaryImage = product.images?.find((img) => img.is_primary);
  const allImages = product.images || [];
  const mainImage = primaryImage || allImages[0];
  const galleryImages = allImages.filter((img) => img.id !== mainImage?.id);

  // Generate JSON-LD structured data for SEO
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://mamabloemetjes.nl";
  const productUrl = `${baseUrl}/${locale}/products/${product.id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: allImages.map((img) => img.url),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Mama Bloemetjes",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: (product.subtotal / 100).toFixed(2),
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      )
        .toISOString()
        .split("T")[0],
      availability: product.is_active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Mama Bloemetjes",
      },
    },
    aggregateRating: product.is_active
      ? {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: "1",
        }
      : undefined,
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${baseUrl}/${locale}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="min-h-screen bg-background">
        <article
          itemScope
          itemType="https://schema.org/Product"
          className="container mx-auto px-4 py-8 max-w-7xl"
        >
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              className="flex items-center gap-2 text-sm text-muted-foreground"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <LanguageAwareLink
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  <span itemProp="name">Home</span>
                </LanguageAwareLink>
                <meta itemProp="position" content="1" />
              </li>
              <ChevronRight className="w-4 h-4" />
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <LanguageAwareLink
                  href="/products"
                  className="hover:text-foreground transition-colors"
                >
                  <span itemProp="name">Products</span>
                </LanguageAwareLink>
                <meta itemProp="position" content="2" />
              </li>
              <ChevronRight className="w-4 h-4" />
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <span
                  className="text-foreground font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {product.name}
                </span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {/* Pinterest-style masonry layout using CSS columns */}
          <div
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
            style={{ columnFill: "balance" }}
          >
            {/* Card 1: Main Product Image */}
            <div className="break-inside-avoid mb-6">
              <figure
                className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                itemProp="image"
                itemScope
                itemType="https://schema.org/ImageObject"
              >
                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10 bg-destructive text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{discountPercentage}%
                  </div>
                )}
                {mainImage ? (
                  <>
                    <Image
                      src={mainImage.url}
                      alt={mainImage.alt_text || product.name}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      width={800}
                      height={800}
                      priority
                      itemProp="contentUrl"
                    />
                    <meta itemProp="url" content={mainImage.url} />
                    <meta
                      itemProp="description"
                      content={mainImage.alt_text || product.name}
                    />
                  </>
                ) : (
                  <div className="bg-secondary/30 rounded-2xl h-96 flex items-center justify-center">
                    <span className="text-8xl" aria-label="Flower emoji">
                      🌸
                    </span>
                  </div>
                )}
              </figure>
            </div>

            {/* Card 2: Product Info & Price */}
            <div className="break-inside-avoid mb-6">
              <div className="bg-card rounded-2xl shadow-xl p-6 border border-border">
                <h1
                  className="text-3xl md:text-4xl font-bold leading-tight text-foreground mb-4"
                  itemProp="name"
                >
                  {product.name}
                </h1>

                <div
                  className="flex items-baseline gap-3 flex-wrap mb-4"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <meta itemProp="priceCurrency" content="EUR" />
                  <meta
                    itemProp="price"
                    content={(product.subtotal / 100).toFixed(2)}
                  />
                  <meta itemProp="url" content={productUrl} />
                  <meta
                    itemProp="availability"
                    content={
                      product.is_active
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock"
                    }
                  />
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.subtotal)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="text-sm font-semibold text-destructive bg-destructive/10 px-3 py-1 rounded-full">
                        {t("save")} {formatPrice(product.discount)}
                      </span>
                    </>
                  )}
                </div>

                {product.tax > 0 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("taxIncluded")}: {formatPrice(product.tax)}
                  </p>
                )}

                <AddToCart
                  product={product}
                  title={t("addToCart")}
                  className="w-full"
                />
              </div>
            </div>

            {/* Card 3: Description */}
            <div className="break-inside-avoid mb-6">
              <section className="bg-card rounded-2xl shadow-xl p-6 border border-border">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ClipboardEditIcon className="w-8 h-8 text-primary" />
                  {t("aboutThisProduct")}
                </h2>
                <p
                  className="text-base leading-relaxed text-muted-foreground whitespace-pre-line"
                  itemProp="description"
                >
                  {product.description}
                </p>
              </section>
            </div>

            <PriceExplanation t={t} />

            {/* Card 4: Handmade with Love */}
            <div className="break-inside-avoid mb-6">
              <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Flower2 className="w-8 h-8 shrink-0 text-primary" />
                  <h3 className="text-xl font-bold pt-1">
                    {t("handmadeWithLove")}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t("handmadeWithLoveDesc")}
                </p>
              </section>
            </div>

            {/* Card 5: Trust Badges */}
            <div className="break-inside-avoid mb-6">
              <aside
                className="bg-card rounded-2xl shadow-xl p-6 border border-border space-y-4"
                aria-label="Product guarantees"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="bg-primary/10 p-3 rounded-full"
                    aria-hidden="true"
                  >
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("freeShipping")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("freeShippingDesc", {
                        threshold: env.freeShippingThreshold.toFixed(2),
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="bg-primary/10 p-3 rounded-full"
                    aria-hidden="true"
                  >
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("securePayment")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("securePaymentDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="bg-primary/10 p-3 rounded-full"
                    aria-hidden="true"
                  >
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("easyContact")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("easyContactDesc")}
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            {/* Gallery Images */}
            {galleryImages.map((image, index) => (
              <div key={image.id} className="break-inside-avoid mb-6">
                <figure className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <Image
                    src={image.url}
                    alt={
                      image.alt_text || `${product.name} - Image ${index + 2}`
                    }
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    width={600}
                    height={600}
                  />
                </figure>
              </div>
            ))}

            {/* Card 7: Unique Design */}
            <div className="break-inside-avoid mb-6">
              <section className="bg-primary/20 dark:bg-primary/10 rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Palette className="w-6 h-6 mt-1 text-primary shrink-0" />
                  <h3 className="text-xl font-bold pt-1">
                    {t("uniqueDesign")}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t("uniqueDesignDesc")}
                </p>
              </section>
            </div>

            {/* Card 8: Carefully Packaged */}
            <div className="break-inside-avoid mb-6">
              <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-6 shadow-lg border border-muted-foreground/20 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Box className="w-6 h-6 mt-1 text-primary shrink-0" />
                  <h3 className="text-xl font-bold pt-1">
                    {t("carefullyPackaged")}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t("carefullyPackagedDesc")}
                </p>
              </section>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default ProductDetailPage;
