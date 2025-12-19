import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  queryKeys,
  type Product,
  type ProductImage,
  type ProductInput,
  type ProductListFilters,
} from "@/lib/api";
import { showApiError, showApiSuccess } from "@/lib/apiToast";

/**
 * Hook to fetch all products (admin only)
 */
export function useAdminProducts(filters?: ProductListFilters) {
  return useQuery({
    queryKey: queryKeys.admin.products.list(filters),
    queryFn: async () => {
      const response = await api.admin.products.getAll(filters);
      // Admin endpoint returns products directly as an array, not wrapped in ProductListResponse
      return {
        products: response.data.products as Product[],
        pagination: {
          page: 1,
          page_size: (response.data.products as Product[]).length,
          total_items: (response.data.products as Product[]).length,
          total_pages: 1,
        },
      };
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
      showApiSuccess("Product created");
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
      showApiSuccess("Product updated");
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

/**
 * Hook to update product stock
 */
export function useUpdateProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stock }: { id: string; stock: number }) => {
      const response = await api.admin.products.updateStock(id, stock);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showApiSuccess("Stock updated");
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.admin.products.delete(id);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showApiSuccess("Product deleted");
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

/**
 * Hook to upload images to a product
 */
export function useUploadProductImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      images,
    }: {
      productId: string;
      images: Omit<ProductImage, "id" | "product_id">[];
    }) => {
      const response = await api.admin.products.uploadImages(productId, images);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showApiSuccess("Images uploaded successfully");
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
