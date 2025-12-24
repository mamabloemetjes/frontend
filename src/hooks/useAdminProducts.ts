import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  queryKeys,
  type ProductInput,
  type ProductListFilters,
} from "@/lib/api";
import { showApiError, showApiSuccess } from "@/lib/apiToast";
import i18n from "@/i18n";

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

  return useMutation({
    mutationFn: async (product: ProductInput) => {
      const response = await api.admin.products.create(product);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showApiSuccess(i18n.t("pages.dashboard.productCreated"));
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showApiSuccess(i18n.t("pages.dashboard.productUpdated"));
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
