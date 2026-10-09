import { fetchProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { createProductListingSchema } from "@/lib/structured-data";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ArrowRight } from "lucide-react";
import { ShopFilters } from "@/components/ShopFilters";
import { ProductListFilters } from "@/lib/api";
import { FlowerTypes } from "@/types";
import {
  createOpenGraphMetadata,
  createTwitterMetadata,
} from "@/lib/structured-data";
import {
  PUBLIC_PRODUCTS_PAGE_SIZE,
} from "@/lib/cache-config";

// Adjust this import to your actual location.
import { FlowerTypesList } from "@/types";
import { ProductPagination } from "@/components/ProductPagination";

// Keep public product pages fresh while allowing Next.js to reuse rendered output.
export const revalidate = 7200;

interface ProductsProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({
  params,
}: ProductsProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "seo.products",
  });

  const seoCommon = await getTranslations({
    locale,
    namespace: "seo.common",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";

  const pageUrl = `${baseUrl}/${locale}/products`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Francis van Wieringen" }],
    creator: "Francis van Wieringen",
    publisher: "Roos van Sharon",
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/products`,
        en: `${baseUrl}/en/products`,
      },
    },
    openGraph: createOpenGraphMetadata(
      locale,
      t("title"),
      t("description"),
      "",
      seoCommon("imageAlt"),
    ),
    twitter: createTwitterMetadata(t("title"), t("description")),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const ProductsPage = async ({
  params,
  searchParams,
}: ProductsProps) => {
  const { locale } = await params;

  const sp = searchParams ? await searchParams : {};

  const t = await getTranslations({
    locale,
    namespace: "pages.products",
  });

  const commonT = await getTranslations({
    locale,
    namespace: "common",
  });

  const flowerCategories = Object.entries(FlowerTypesList).map(
    ([slug, translationKey]) => ({
      slug,
      href: `/${slug}/shop`,
      label: commonT(translationKey),
    }),
  );

  const filters: ProductListFilters = {
    page: Number(sp?.page) > 0 ? Number(sp.page) : 1,
    page_size: PUBLIC_PRODUCTS_PAGE_SIZE,
    is_active: true,
    include_images: true,
    ...(sp?.search && { search: sp.search }),
    ...(sp?.category && {
      product_type: sp.category as FlowerTypes,
    }),
    ...(sp?.in_stock === "true" && { in_stock: true }),
  };

  const { data, success } = await fetchProducts(filters);

  const products = data?.products ?? [];
  const totalProducts = Math.max(
    data?.pagination.total_items ?? 0,
    data?.pagination.total ?? 0,
    products.length,
  );
  const totalPages =
    data?.pagination.total_pages ??
    Math.ceil(totalProducts / PUBLIC_PRODUCTS_PAGE_SIZE);

  const structuredData = createProductListingSchema(
    products,
    locale,
  );

  if (!success) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-24 text-center">
        <p className="text-muted-foreground">
          {t("errorFetchingProducts")}
        </p>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 lg:px-6 py-12">
        {/* Header */}
        <header className="mb-10 pb-8 border-b border-border">
          <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-5">
            <span className="h-1.5 w-1.5 bg-secondary" />
            {t("collection")}
          </span>

          <h1
            className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            {t("title")}
          </h1>

          <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
            {t("introDescription")}
          </p>
        </header>

        {/* Filters — client island */}
        <ShopFilters totalCount={totalProducts} />

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center border border-border">
            <p className="text-muted-foreground text-sm">
              {t("noProducts")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-background"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && data?.pagination && (
          <ProductPagination
            pagination={{ ...data.pagination, total_pages: totalPages }}
          />
        )}

        {/* Browse by category */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-5">
            {t("browseByCategory")}
          </p>

          <div className="flex flex-wrap gap-px bg-border w-fit">
            {flowerCategories.map(({ href, label }) => (
              <LanguageAwareLink
                key={href}
                href={href}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                {label}

                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </LanguageAwareLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
