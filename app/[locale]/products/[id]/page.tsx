"use server";

import { fetchProductById } from "@/hooks/useProducts";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";
import { Props } from "@/types";
import { getTranslations } from "next-intl/server";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              className="rounded-lg shadow-lg object-cover w-full h-96"
              width={600}
              height={400}
              priority
            />
          ) : (
            <div className="bg-card rounded-lg h-96 flex items-center justify-center">
              <span className="text-primary-foreground">{t("noImage")}</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-xl text-muted-foreground">{product.description}</p>
          <p className="text-3xl font-bold text-primary">
            €{(product.price / 100).toFixed(2)}
          </p>
          <AddToCart product={product} title={t("addToCart")} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
