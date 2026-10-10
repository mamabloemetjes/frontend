
import "server-only";
import { unstable_cache } from "next/cache";
import { fetchProducts } from "@/hooks/useProducts";

export const getCachedProductCatalog = unstable_cache(
  async () => fetchProducts({ include_images: true, page_size: 1000 }),
  ["product-catalog"],
  { revalidate: 7200 },
);
