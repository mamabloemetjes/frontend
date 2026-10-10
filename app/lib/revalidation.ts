export async function revalidatePath(path: string): Promise<boolean> {
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret) {
    console.warn("[Revalidation] REVALIDATION_SECRET not set");
    return false;
  }

  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Revalidation] Failed:", error);
      return false;
    }

    const result = await response.json();
    console.log("[Revalidation] Success:", result);
    return true;
  } catch (error) {
    console.error("[Revalidation] Error:", error);
    return false;
  }
}

export async function revalidatePaths(paths: string[]): Promise<boolean> {
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret) {
    console.warn("[Revalidation] REVALIDATION_SECRET not set");
    return false;
  }

  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ paths }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Revalidation] Failed:", error);
      return false;
    }

    const result = await response.json();
    console.log("[Revalidation] Success:", result);
    return true;
  } catch (error) {
    console.error("[Revalidation] Error:", error);
    return false;
  }
}

export async function revalidateTag(tag: string): Promise<boolean> {
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret) {
    console.warn("[Revalidation] REVALIDATION_SECRET not set");
    return false;
  }

  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ tag }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Revalidation] Failed:", error);
      return false;
    }

    const result = await response.json();
    console.log("[Revalidation] Success:", result);
    return true;
  } catch (error) {
    console.error("[Revalidation] Error:", error);
    return false;
  }
}

/**
 * Revalidate product-related pages
 * Useful after creating, updating, or deleting products
 */
export async function revalidateProducts(): Promise<boolean> {
  const pathsRevalidated = await revalidatePaths([
    // Main product listing pages
    "/products",
    "/en/products",
    "/nl/products",
    // Also revalidate category pages
    "/nl/funeral-flowers/shop",
    "/funeral-flowers/shop",
    "/en/funeral-flowers/shop",

    "/nl/wedding-bouquets/shop",
    "/wedding-bouquets/shop",
    "/en/wedding-bouquets/shop",

    "/birth/shop",
    "/nl/birth/shop",
    "/en/birth/shop",
    // Also revalidate homepage as it does show some products
    "/en",
    "/nl",
    "/",
  ]);
  const tagRevalidated = await revalidateTag("products:active-catalog");
  return pathsRevalidated && tagRevalidated;
}

/**
 * Revalidate order-related pages
 * Useful after order status updates
 */
export async function revalidateOrders(): Promise<boolean> {
  return await revalidatePaths([
    "/account/orders",
    "/en/account/orders",
    "/nl/account/orders",
    "/dashboard/orders",
    "/en/dashboard/orders",
    "/nl/dashboard/orders",
  ]);
}

export async function revalidateProduct(productId: string): Promise<boolean> {
  const pathsRevalidated = await revalidatePaths([
    `/products/${productId}`,
    `/en/products/${productId}`,
    `/nl/products/${productId}`,
    "/nl/wedding-bouquets/shop",
    "/wedding-bouquets/shop",
    "/en/wedding-bouquets/shop",
    "/nl/funeral-flowers/shop",
    "/funeral-flowers/shop",
    "/en/funeral-flowers/shop",
    "/birth/shop",
    "/nl/birth/shop",
    "/en/birth/shop",
  ]);
  const tagRevalidated = await revalidateTag("products:active-catalog");
  return pathsRevalidated && tagRevalidated;
}

export async function revalidateOrder(orderId: string): Promise<boolean> {
  return await revalidatePaths([
    `/account/orders/${orderId}`,
    `/en/account/orders/${orderId}`,
    `/nl/account/orders/${orderId}`,
    `/dashboard/orders/${orderId}`,
    `/en/dashboard/orders/${orderId}`,
    `/nl/dashboard/orders/${orderId}`,
  ]);
}
