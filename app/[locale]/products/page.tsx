"use server";

import { fetchProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components";
import { getTranslations } from "next-intl/server";
import { Props } from "@/types";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
