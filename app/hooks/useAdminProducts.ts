import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  queryKeys,
  type ProductInput,
  type ProductListFilters,
} from "@/lib/api";
import { showApiError, showApiSuccess } from "@/lib/apiToast";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { revalidateProducts, revalidateProduct } from "@/lib/revalidation";

/**
 * Hook to fetch all products (admin only)
 */
export function useAdminProducts(filters?: ProductListFilters) {
  return useQuery({
    queryKey: queryKeys.admin.products.list(filters),
    queryFn: async () => {
      const response = await api.admin.products.getAll(filters);
      return response.data;
    },
  });
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("pages.dashboard");
  const tGeneral = useTranslations();

  const handleError = useCallback(
    (error: unknown) => {
      showApiError(error, tGeneral);
    },
    [tGeneral],
  );

  return useMutation({
    mutationFn: async (product: ProductInput) => {
      const response = await api.admin.products.create(product);
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate React Query cache (client-side)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

      // Invalidate Next.js cache (server-side)
      await revalidateProducts();

      showApiSuccess(t("productCreated"));
    },
    onError: (error) => {
      handleError(error);
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("pages.dashboard");
  const tGeneral = useTranslations();

  const handleError = useCallback(
    (error: unknown) => {
      showApiError(error, tGeneral);
    },
    [tGeneral],
  );

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ProductInput>;
    }) => {
      const response = await api.admin.products.update(id, updates);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      // Invalidate React Query cache (client-side)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

      // Invalidate Next.js cache (server-side)
      await revalidateProducts();
      await revalidateProduct(variables.id);

      showApiSuccess(t("productUpdated"));
    },
    onError: (error) => {
      handleError(error);
    },
  });
}
