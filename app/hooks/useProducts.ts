import { useQuery } from "@tanstack/react-query";
import { api, queryKeys, ApiError } from "@/lib/api";
import type {
  ProductListFilters,
  ProductListResponse,
  ProductDetailResponse,
  ProductCountResponse,
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

export const fetchProductById = async (
  id: string,
  includeImages: boolean = false,
) => {
  const res = await api.products.getById(id, includeImages);
  return res;
};

export const fetchProducts = async (
  page = 1,
  pageSize = 20,
  includeImages = false,
) => {
  const res = await api.products.getActive(page, pageSize, includeImages);
  return res;
};

export const fetchNewestProducts = async (
  pageSize = 5,
  includeImages = false,
) => {
  const res = await api.products.getNewest(pageSize, includeImages);
  return res;
};

export function useProduct(id: string, includeImages: boolean = false) {
  return useQuery<ProductDetailResponse, ApiError>({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await api.products.getById(id, includeImages);
      return response.data;
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
      const response = await api.products.getActive(
        page,
        pageSize,
        includeImages,
      );
      return response.data;
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
