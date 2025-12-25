import { useActiveProducts } from "@/hooks/useProducts";
import { useSetAtom } from "jotai";
import { addToCartAtom } from "@/store/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

function ProductsPage() {
  const { t } = useTranslation();
  // Fetch active products with images
  const { data, isLoading, error } = useActiveProducts(1, 20, true);
  const addToCart = useSetAtom(addToCartAtom);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          {t("pages.home.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p className="font-medium">
            {t("pages.dashboard.errorLoadingProducts")}
          </p>
          <p className="text-sm mt-1">{t("pages.dashboard.tryAgainLater")}</p>
          <p className="text-xs mt-2 font-mono">{error.message}</p>
        </div>
      </div>
    );
  }

  const products = data?.products || [];

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground mb-8">
          {t("pages.home.noProducts")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("pages.home.title")}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price / 100, // Convert cents to euros
                discount: (product.discount || 0) / 100, // Convert cents to euros
                image: product.images?.[0]?.url,
                availableStock: 1,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
