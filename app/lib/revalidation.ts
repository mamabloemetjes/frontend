import {
  revalidatePaths as revalidatePathsOnServer,
  revalidateProductTag,
} from "@/actions/revalidation";

/**
 * Trigger cache invalidation through a server action. This module can be
 * imported by client mutations without exposing server-only secrets.
 */
export function revalidatePath(path: string): Promise<boolean> {
  return revalidatePathsOnServer([path]);
}

export function revalidatePaths(paths: string[]): Promise<boolean> {
  return revalidatePathsOnServer(paths);
}

export function revalidateTag(tag: string): Promise<boolean> {
  return revalidateProductTag(tag);
}

export async function revalidateProducts(): Promise<boolean> {
  return revalidatePaths([
    "/products",
    "/en/products",
    "/nl/products",
    "/nl/funeral-flowers/shop",
    "/funeral-flowers/shop",
    "/en/funeral-flowers/shop",
    "/nl/wedding-bouquets/shop",
    "/wedding-bouquets/shop",
    "/en/wedding-bouquets/shop",
    "/birth/shop",
    "/nl/birth/shop",
    "/en/birth/shop",
  ]);
}

export function revalidateProduct(productId: string): Promise<boolean> {
  return revalidatePaths([
    `/products/${productId}`,
    `/en/products/${productId}`,
    `/nl/products/${productId}`,
  ]);
}
