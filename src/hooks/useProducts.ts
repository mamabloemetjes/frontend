import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys, ApiError } from "@/lib/api";
import type {
  ProductListFilters,
  ProductListResponse,
  ProductDetailResponse,
  ProductCountResponse,
  Product,
} from "@/lib/api";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useProducts(filters?: ProductListFilters) {
  return useQuery<ProductListResponse, ApiError>({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const res = await api.products.getAll(filters);
      return res.data;
    },
  });
}

export function useProduct(id: string, includeImages: boolean = false) {
  return useQuery<ProductDetailResponse, ApiError>({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const res = await api.products.getById(id, includeImages);
      return res.data;
    },
    enabled: !!id, // Only fetch if ID exists
  });
}

export function useActiveProducts(
  page: number = 1,
  pageSize: number = 20,
  includeImages: boolean = false,
) {
  return useQuery<ProductListResponse, ApiError>({
    queryKey: queryKeys.products.active(page, pageSize),
    queryFn: async () => {
      const res = await api.products.getActive(page, pageSize, includeImages);
      return res.data;
    },
  });
}

export function useProductCount(filters?: ProductListFilters) {
  return useQuery<ProductCountResponse, ApiError>({
    queryKey: queryKeys.products.count(filters),
    queryFn: async () => {
      const response = await api.products.getCount(filters);
      return response.data;
    },
  });
}

// ============================================================================
// MUTATION HOOKS (add POST/PUT/DELETE endpoints later)
// ============================================================================

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Product) => {
      console.log("Creating product:", newProduct);
      throw new Error(
        "Not implemented yet - TODO: add POST /products to backend",
      );
    },
    onSuccess: () => {
      // Invalidate and refetch all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      id: string;
      updates: Partial<unknown>;
    }) => {
      console.log("Updating product:", variables.id, variables.updates);
      throw new Error(
        "Not implemented yet - TODO: add PUT /products/{id} to backend",
      );
    },
    onSuccess: (_: never, variables) => {
      // Invalidate the specific product query
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      });
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting product:", id);
      throw new Error(
        "Not implemented yet - TODO: add DELETE /products/{id} to backend",
      );
    },
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================
export function usePrefetchProducts() {
  const queryClient = useQueryClient();

  return (filters?: ProductListFilters) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(filters),
      queryFn: () => api.products.getAll(filters),
    });
  };
}

export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (id: string, includeImages: boolean = false) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => api.products.getById(id, includeImages),
    });
  };
}
