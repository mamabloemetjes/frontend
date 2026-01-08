"use client";

import { useQuery } from "@tanstack/react-query";
import { api, queryKeys } from "@/lib/api";
import type { UserAddressesResponse } from "@/lib/api";
import { useIsAuthenticated } from "./useAuth";

/**
 * Hook to fetch user addresses for autofill
 * Only fetches when user is authenticated
 */
export function useUserAddresses() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.auth.addresses,
    queryFn: async (): Promise<UserAddressesResponse | null> => {
      const response = await api.auth.getUserAddresses();

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    },
    enabled: isAuthenticated, // Only fetch when user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
  });
}
