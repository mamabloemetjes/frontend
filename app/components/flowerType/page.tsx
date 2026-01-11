"use server";

import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components";
import {
  createProductListingSchema,
  createLocalBusinessSchema,
} from "@/lib/structured-data";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { fetchProducts } from "@/hooks/useProducts";

type FlowerTypePageProps = {
  type: "funeral" | "wedding";
  locale: string;
};

const FlowerTypePage = async ({ type, locale }: FlowerTypePageProps) => {
  // Get translations based on type
  const namespace =
    type === "funeral" ? "pages.funeral.shop" : "pages.wedding.shop";
  const t = await getTranslations({ locale, namespace });
  const productsT = await getTranslations({
    locale,
    namespace: "pages.products",
  });
  const paragraphsNamespace =
    type === "funeral" ? "paragraphs.mourning" : "paragraphs.wedding";
  const paragraphsT = await getTranslations({
    locale,
    namespace: paragraphsNamespace,
  });

  // Fetch products by type
  const res = await fetchProducts(1, 50, true, type);
  const { data, success } = res;

  if (!success) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {t("errorFetchingProducts")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {productsT("pleaseTryAgainLater")}
        </p>
      </div>
    );
  }

  const products = data?.products || [];

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {type === "funeral"
              ? paragraphsT("mournPiecesTitle")
              : paragraphsT("weddingTitle")}
          </h1>
        </header>
        <p className="text-center text-muted-foreground mb-8">
          {t("noProductsFound")}
        </p>
      </div>
    );
  }

  // Base URL for structured data
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";

  // Conditional rendering based on type
  const pageTitle =
    type === "funeral"
      ? paragraphsT("mournPiecesTitle")
      : paragraphsT("weddingTitle");

  const introTitle =
    type === "funeral"
      ? paragraphsT("mournPiecesTitle1")
      : paragraphsT("weddingTitle1");

  const introDescription =
    type === "funeral"
      ? paragraphsT("mournPiecesDesc1")
      : paragraphsT("weddingDesc1");

  const borderColor =
    type === "funeral" ? "border-muted-foreground/30" : "border-primary/50";

  // Structured Data for Product Listing
  const productListingSchema = createProductListingSchema(products, locale);

  // Collection Page Structured Data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: introDescription,
    url: `${baseUrl}/${locale}/${type === "funeral" ? "funeral-flowers" : "wedding-bouquets"}/shop`,
    inLanguage: locale === "nl" ? "nl-NL" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Roos van Sharon",
      url: baseUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/${locale}/${type === "funeral" ? "funeral-flowers" : "wedding-bouquets"}/shop#breadcrumb`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/${locale}/products/${product.id}`,
      })),
    },
  };

  // Organization Schema
  const organizationSchema = createLocalBusinessSchema(locale);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListingSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <article>
          {/* Back to All Products Link */}
          <div className="mb-6">
            <LanguageAwareLink
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
            >
              {paragraphsT("backToAllProducts")}
            </LanguageAwareLink>
          </div>

          <header className="mb-8">
            <h1
              className={`text-3xl font-bold mb-4 pb-4 border-b-4 ${borderColor}`}
            >
              {pageTitle}
            </h1>
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold mb-2 text-muted-foreground">
                {introTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {introDescription}
              </p>
            </div>
          </header>

          <section aria-label="Product List">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Product Count for Accessibility */}
          <p className="sr-only" aria-live="polite">
            {products.length}{" "}
            {products.length === 1
              ? locale === "nl"
                ? "product gevonden"
                : "product found"
              : locale === "nl"
                ? "producten gevonden"
                : "products found"}
          </p>
        </article>
      </div>
    </>
  );
};

export default FlowerTypePage;
