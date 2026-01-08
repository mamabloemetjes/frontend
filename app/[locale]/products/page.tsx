"use server";

import { fetchProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components";
import { getTranslations } from "next-intl/server";
import { Props } from "@/types";
import { Metadata } from "next";
import { createProductListingSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.products" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

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
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: common("siteName"),
      locale: common("locale"),
      type: "website",
      images: [
        {
          url: `${baseUrl}/flower.webp`,
          width: 1200,
          height: 630,
          alt: common("imageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/flower.webp`],
    },
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

const ProductsPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.products" });

  // Fetch active products with images
  const { data, success } = await fetchProducts(1, 20, true);

  const products = data?.products || [];

  if (!success) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {t("errorFetchingProducts")}
        </h1>
        <p>{t("pleaseTryAgainLater")}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground mb-8">
          {t("noProducts")}
        </p>
      </div>
    );
  }

  // Structured Data for Product Listing
  const structuredData = createProductListingSchema(products, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-2 text-muted-foreground">
              {t("introTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("introDescription")}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
