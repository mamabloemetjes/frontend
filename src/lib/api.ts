import axios, { type AxiosInstance, type AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { QueryClient } from "@tanstack/react-query";
import type { User, RegisterData, LoginCredentials } from "@/types/auth";
import { csrfService } from "./csrf";

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

// ============================================================================
// TYPE DEFINITIONS - Aligned with Go backend
// ============================================================================

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface WrappedProducts {
  products: Product[];
}

// Product types (from structs/products.go)
export type Size = "small" | "medium" | "large";
export type ProductType = "flower" | "bouquet";
export type Color =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "black"
  | "white"
  | "purple"
  | "orange"
  | "pink";

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number; // in cents
  discount?: number; // in cents
  tax: number; // in cents
  subtotal: number; // in cents
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  size?: Size;
  colors?: Color[];
  product_type?: ProductType;
  stock?: number;
  images?: ProductImage[];
}

// Response from GET /products
export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
  filters: ProductListFilters;
  meta: {
    query_time_ms: number;
    count: number;
  };
}

// Response from GET /products/{id}
export interface ProductDetailResponse {
  product: Product;
}

// Response from GET /products/count
export interface ProductCountResponse {
  count: number;
  filters: ProductListFilters;
}

// Query parameters for product list
export interface ProductListFilters {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  in_stock?: boolean;
  product_type?: ProductType;
  size?: Size;
  search?: string;
  min_price?: number; // in cents
  max_price?: number; // in cents
  colors?: Color[];
  skus?: string[];
  exclude_skus?: string[];
  created_after?: string; // RFC3339 format
  created_before?: string; // RFC3339 format
  sort_by?: string;
  sort_direction?: "ASC" | "DESC";
  include_images?: boolean;
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Configure axios-retry to retry on 500 errors only
axiosRetry(apiClient, {
  retries: 3, // Retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff: 1s, 2s, 4s
  retryCondition: (error: AxiosError) => {
    // Only retry on 500-level errors (server errors)
    return error.response?.status ? error.response.status >= 500 : false;
  },
  onRetry: (retryCount: number, error: AxiosError) => {
    console.log(
      `[API] Retrying request (${retryCount}/3) after ${error.response?.status} error:`,
      error.config?.url,
    );
  },
});

// Request interceptor - add CSRF token to mutating requests
apiClient.interceptors.request.use(
  async (config) => {
    // Skip CSRF token for GET requests and the CSRF endpoint itself
    if (
      config.method &&
      !["get", "head", "options"].includes(config.method.toLowerCase()) &&
      !config.url?.includes("/auth/csrf")
    ) {
      try {
        const csrfToken = await csrfService.getToken();
        config.headers["X-CSRF-Token"] = csrfToken;
      } catch (error) {
        console.error("[API] Failed to get CSRF token:", error);
        // Continue without CSRF token - let the server reject it
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: ApiError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Response interceptor - unwrap gecho response and handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    const apiResponse: ApiResponse<unknown> = response.data;

    // Check if gecho indicates success
    if (!apiResponse.success) {
      throw new ApiError(
        apiResponse.message || "Request failed",
        apiResponse.status,
        apiResponse.data,
      );
    }

    // Return the response with validated data
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (error.response) {
      const apiResponse = error.response.data as
        | ApiResponse<unknown>
        | undefined;

      // Handle 403 Forbidden - might be CSRF token issue
      if (
        error.response.status === 403 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        const errorMessage = apiResponse?.message || error.message;

        // If it's a CSRF error, try to refresh the token and retry
        if (errorMessage.toLowerCase().includes("csrf")) {
          console.log("[API] CSRF token invalid, refreshing...");
          originalRequest._retry = true;

          try {
            await csrfService.refreshToken();
            return apiClient(originalRequest);
          } catch (csrfError) {
            console.error("[API] Failed to refresh CSRF token:", csrfError);
            throw new ApiError(
              "CSRF token refresh failed. Please reload the page.",
              403,
              apiResponse?.data,
            );
          }
        }
      }

      // Handle 401 Unauthorized - attempt to refresh token
      if (
        error.response.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        // Don't retry refresh or logout endpoints
        if (
          originalRequest.url?.includes("/auth/refresh") ||
          originalRequest.url?.includes("/auth/logout")
        ) {
          throw new ApiError(
            apiResponse?.message || error.message,
            error.response.status,
            apiResponse?.data,
          );
        }

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token
          await apiClient.post("/auth/refresh");

          // Token refreshed successfully, process queued requests
          processQueue(null);
          isRefreshing = false;

          // Retry the original request
          return apiClient(originalRequest);
        } catch {
          // Refresh failed - clear queue and reject all pending requests
          const apiErr = new ApiError(
            "Session expired. Please log in again.",
            401,
          );
          processQueue(apiErr);
          isRefreshing = false;

          // Clear any cached auth data
          queryClient.removeQueries({ queryKey: ["auth"] });

          return Promise.reject(apiErr);
        }
      }

      throw new ApiError(
        apiResponse?.message || error.message,
        error.response.status,
        apiResponse?.data,
      );
    } else if (error.request) {
      throw new ApiError("No response from server", 0);
    } else {
      throw new ApiError(error.message);
    }
  },
);

// ============================================================================
// ERROR CLASS
// ============================================================================
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number = 500, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ============================================================================
// API ENDPOINTS
// ============================================================================
export const api = {
  products: {
    getAll: async (
      filters?: ProductListFilters,
    ): Promise<ApiResponse<ProductListResponse>> => {
      const params: Record<string, unknown> = {};

      if (filters?.page) params.page = filters.page;
      if (filters?.page_size) params.page_size = filters.page_size;
      if (filters?.is_active !== undefined)
        params.is_active = filters.is_active;
      if (filters?.in_stock !== undefined) params.in_stock = filters.in_stock;
      if (filters?.product_type) params.product_type = filters.product_type;
      if (filters?.size) params.size = filters.size;
      if (filters?.search) params.search = filters.search;
      if (filters?.min_price) params.min_price = filters.min_price;
      if (filters?.max_price) params.max_price = filters.max_price;
      if (filters?.colors?.length) params.colors = filters.colors.join(",");
      if (filters?.skus?.length) params.skus = filters.skus.join(",");
      if (filters?.exclude_skus?.length)
        params.exclude_skus = filters.exclude_skus.join(",");
      if (filters?.created_after) params.created_after = filters.created_after;
      if (filters?.created_before)
        params.created_before = filters.created_before;
      if (filters?.sort_by) params.sort_by = filters.sort_by;
      if (filters?.sort_direction)
        params.sort_direction = filters.sort_direction;
      if (filters?.include_images !== undefined)
        params.include_images = filters.include_images;

      return apiClient.get("/products", { params });
    },

    /**
     * GET /products/{id}
     * Fetch a single product by ID
     */
    getById: async (
      id: string,
      includeImages: boolean = false,
    ): Promise<ApiResponse<ProductDetailResponse>> => {
      return apiClient.get(`/products/${id}`, {
        params: { include_images: includeImages },
      });
    },

    /**
     * GET /products/active
     * Fetch only active products
     */
    getActive: async (
      page: number = 1,
      pageSize: number = 20,
      includeImages: boolean = false,
    ): Promise<ApiResponse<ProductListResponse>> => {
      return apiClient.get("/products/active", {
        params: {
          page,
          page_size: pageSize,
          include_images: includeImages,
        },
      });
    },

    /**
     * GET /products/count
     * Get total count of products with optional filters
     */
    getCount: async (
      filters?: ProductListFilters,
    ): Promise<ApiResponse<ProductCountResponse>> => {
      const params: Record<string, unknown> = {};

      if (filters?.is_active !== undefined)
        params.is_active = filters.is_active;
      if (filters?.in_stock !== undefined) params.in_stock = filters.in_stock;
      if (filters?.product_type) params.product_type = filters.product_type;
      if (filters?.size) params.size = filters.size;
      if (filters?.search) params.search = filters.search;
      if (filters?.min_price) params.min_price = filters.min_price;
      if (filters?.max_price) params.max_price = filters.max_price;

      return apiClient.get("/products/count", { params });
    },
  },
  auth: {
    login: async (
      loginCredentials: LoginCredentials,
    ): Promise<ApiResponse<User>> => {
      return apiClient.post("/auth/login", {
        email: loginCredentials.email,
        password: loginCredentials.password,
      });
    },
    register: async (
      registerData: RegisterData,
    ): Promise<ApiResponse<User>> => {
      return apiClient.post("/auth/register", {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });
    },
    logout: async (): Promise<ApiResponse<null>> => {
      return apiClient.post("/auth/logout");
    },
    refreshToken: async (): Promise<ApiResponse<User>> => {
      return apiClient.post("/auth/refresh");
    },
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
      return apiClient.get("/auth/me");
    },
  },
  admin: {
    products: {
      /**
       * GET /admin/products
       * Fetch all products (admin only)
       */
      getAll: async (
        filters?: ProductListFilters,
      ): Promise<ApiResponse<WrappedProducts>> => {
        const params: Record<string, unknown> = {};

        if (filters?.page) params.page = filters.page;
        if (filters?.page_size) params.page_size = filters.page_size;
        if (filters?.is_active !== undefined)
          params.is_active = filters.is_active;
        if (filters?.in_stock !== undefined) params.in_stock = filters.in_stock;
        if (filters?.product_type) params.product_type = filters.product_type;
        if (filters?.size) params.size = filters.size;
        if (filters?.search) params.search = filters.search;
        if (filters?.min_price) params.min_price = filters.min_price;
        if (filters?.max_price) params.max_price = filters.max_price;
        if (filters?.colors?.length) params.colors = filters.colors.join(",");
        if (filters?.skus?.length) params.skus = filters.skus.join(",");
        if (filters?.exclude_skus?.length)
          params.exclude_skus = filters.exclude_skus.join(",");
        if (filters?.created_after)
          params.created_after = filters.created_after;
        if (filters?.created_before)
          params.created_before = filters.created_before;
        if (filters?.sort_by) params.sort_by = filters.sort_by;
        if (filters?.sort_direction)
          params.sort_direction = filters.sort_direction;
        if (filters?.include_images !== undefined)
          params.include_images = filters.include_images;

        return apiClient.get("/admin/products", { params });
      },

      /**
       * POST /admin/products
       * Create a new product
       */
      create: async (
        product: Omit<Product, "id" | "created_at" | "updated_at" | "subtotal">,
      ): Promise<ApiResponse<Product>> => {
        return apiClient.post("/admin/products", product);
      },

      /**
       * PUT /admin/products/{id}
       * Update a product
       */
      update: async (
        id: string,
        updates: Partial<Product>,
      ): Promise<ApiResponse<Product>> => {
        return apiClient.put(`/admin/products/${id}`, {
          products: {
            [id]: updates,
          },
        });
      },

      /**
       * PUT /admin/products/{id}/stock
       * Update product stock
       */
      updateStock: async (
        id: string,
        stock: number,
      ): Promise<ApiResponse<null>> => {
        return apiClient.put(`/admin/products/${id}/stock`, {
          stocks: {
            [id]: stock,
          },
        });
      },

      /**
       * DELETE /admin/products/{id}
       * Delete a product
       */
      delete: async (id: string): Promise<ApiResponse<null>> => {
        return apiClient.delete(`/admin/products/${id}`);
      },
    },
  },
};

// ============================================================================
// QUERY KEYS - For TanStack Query
// ============================================================================
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: ProductListFilters) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    active: (page?: number, pageSize?: number) =>
      [...queryKeys.products.all, "active", { page, pageSize }] as const,
    count: (filters?: ProductListFilters) =>
      [...queryKeys.products.all, "count", filters] as const,
  },
  auth: {
    currentUser: ["auth", "user"] as const,
  },
  admin: {
    products: {
      all: ["admin", "products"] as const,
      lists: () => [...queryKeys.admin.products.all, "list"] as const,
      list: (filters?: ProductListFilters) =>
        [...queryKeys.admin.products.lists(), filters] as const,
    },
  },
} as const;

// ============================================================================
// QUERY CLIENT
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Export axios instance
export { apiClient };
