"use server";

import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components";
import {
  createProductListingSchema,
  createLocalBusinessSchema,
} from "@/lib/structured-data";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { fetchProducts } from "@/hooks/useProducts";
import { type ProductListFilters } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

type FlowerTypePageProps = {
  type: "funeral" | "wedding" | "birth" | "flowers";
  locale: string;
};

const TYPE_BADGE_LABELS: Record<FlowerTypePageProps["type"], string> = {
  funeral: "Rouwstukken",
  wedding: "Bruidsboeketten",
  birth: "Geboortestukken",
  flowers: "Bloemen",
};

const FlowerTypePage = async ({ type, locale }: FlowerTypePageProps) => {
  const namespace =
    type === "funeral"
      ? "pages.funeral.shop"
      : type === "wedding"
        ? "pages.wedding.shop"
        : type === "birth"
          ? "pages.birth.shop"
          : "pages.flowers.shop";
  const t = await getTranslations({ locale, namespace });
  const productsT = await getTranslations({
    locale,
    namespace: "pages.products",
  });
  const paragraphsNamespace =
    type === "funeral"
      ? "paragraphs.mourning"
      : type === "wedding"
        ? "paragraphs.wedding"
        : type === "birth"
          ? "paragraphs.birth"
          : "paragraphs.flowers";
  const paragraphsT = await getTranslations({
    locale,
    namespace: paragraphsNamespace,
  });

  const filters: ProductListFilters = {
    page: 1,
    page_size: 100,
    product_type: type as ProductListFilters["product_type"],
    include_images: true,
  };
  const { data, success } = await fetchProducts(filters);

  if (!success) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-24 text-center">
        <p className="text-muted-foreground">{t("errorFetchingProducts")}</p>
      </div>
    );
  }

  const products = data?.products ?? [];

  const pageTitle =
    type === "funeral"
      ? paragraphsT("mournPiecesTitle")
      : type === "wedding"
        ? paragraphsT("weddingTitle")
        : type === "birth"
          ? paragraphsT("birthTitle")
          : paragraphsT("flowersTitle");

  const introTitle =
    type === "funeral"
      ? paragraphsT("mournPiecesTitle1")
      : type === "wedding"
        ? paragraphsT("weddingTitle1")
        : type === "birth"
          ? paragraphsT("birthTitle1")
          : paragraphsT("flowersTitle1");

  const introDescription =
    type === "funeral"
      ? paragraphsT("mournPiecesDesc1")
      : type === "wedding"
        ? paragraphsT("weddingDesc1")
        : type === "birth"
          ? paragraphsT("birthDesc1")
          : paragraphsT("flowersDesc1");

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const productListingSchema = createProductListingSchema(products, locale);
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: introDescription,
    url: `${baseUrl}/${locale}/${type === "funeral" ? "funeral-flowers" : type === "wedding" ? "wedding-bouquets" : "birth-pieces"}/shop`,
    inLanguage: locale === "nl" ? "nl-NL" : "en-US",
    isPartOf: { "@type": "WebSite", name: "Roos van Sharon", url: baseUrl },
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
  const organizationSchema = createLocalBusinessSchema(locale);

  return (
    <>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="container mx-auto px-4 lg:px-6 py-12">
        <article>
          {/* Back link */}
          <LanguageAwareLink
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            {paragraphsT("backToAllProducts")}
          </LanguageAwareLink>

          {/* Header */}
          <header className="mb-10 pb-8 border-b border-border">
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {pageTitle}
            </h1>
            <div className="max-w-2xl space-y-2">
              <p className="text-base font-medium text-muted-foreground">
                {introTitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {introDescription}
              </p>
            </div>
          </header>

          {/* Product count */}
          <p className="text-xs text-muted-foreground mb-6">
            <span className="text-foreground font-medium">
              {products.length}
            </span>{" "}
            {products.length === 1
              ? locale === "nl"
                ? "product"
                : "product"
              : locale === "nl"
                ? "producten"
                : "products"}
          </p>

          {/* Grid */}
          <section aria-label="Product List">
            {products.length === 0 ? (
              <div className="py-24 text-center border border-border">
                <p className="text-muted-foreground text-sm">
                  {t("noProductsFound")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
                {products.map((product) => (
                  <div key={product.id} className="bg-background">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </section>

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
