import { MetadataRoute } from "next";
import { fetchProducts } from "@/hooks/useProducts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const locales = ["nl", "en"];

  const routes = [
    "",
    "/about",
    "/contact",
    "/products",
    "/privacy",
    "/terms",
    "/wedding-bouquets/shop",
    "/funeral-flowers/shop",
    "/funeral-flowers",
    "/wedding-bouquets",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add all static routes for both locales
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            nl: `${baseUrl}/nl${route}`,
            en: `${baseUrl}/en${route}`,
            "x-default": `${baseUrl}/nl${route}`,
          },
        },
      });
    });
  });

  // Fetch all active products and add them to sitemap
  try {
    const { data, success } = await fetchProducts(1, 1000, false);

    if (success && data?.products) {
      for (const product of data.products) {
        // Only add active products to sitemap
        if (product.is_active) {
          locales.forEach((locale) => {
            sitemap.push({
              url: `${baseUrl}/${locale}/products/${product.id}`,
              lastModified: product.updated_at
                ? new Date(product.updated_at)
                : new Date(),
              changeFrequency: "weekly",
              priority: 0.9, // High priority for product pages
              alternates: {
                languages: {
                  nl: `${baseUrl}/nl/products/${product.id}`,
                  en: `${baseUrl}/en/products/${product.id}`,
                  "x-default": `${baseUrl}/nl/products/${product.id}`,
                },
              },
            });
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Continue generating sitemap even if products fetch fails
  }

  return sitemap;
}
