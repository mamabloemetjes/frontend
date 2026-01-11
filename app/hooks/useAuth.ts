"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api as apiClient, apiClient as axiosClient } from "@/lib/api";
import { env } from "@/lib/env";
import type { User, LoginCredentials, RegisterData } from "@/types/auth";
import { useRouter } from "next/navigation";
import { showApiError, showApiSuccess } from "@/lib/apiToast";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Track authentication state across app lifecycle
 * This helps minimize unnecessary API calls for unauthenticated users
 */
let hasAttemptedAuth = false;
let lastAuthResult: boolean | null = null;

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const t = useTranslations("auth.login");
  const tGeneral = useTranslations();

  const handleError = useCallback(
    (error: unknown) => {
      showApiError(error, tGeneral);
    },
    [tGeneral],
  );

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<User> => {
      // Check if login feature is enabled
      if (!env.features.enableLogin) {
        throw new Error("Login functionaliteit is uitgeschakeld");
      }

      const response = await apiClient.auth.login(credentials);
      // API client will throw ApiError if response is not successful
      return response.data!;
    },
    onSuccess: (user: User) => {
      // Reset auth tracking on successful login
      hasAttemptedAuth = true;
      lastAuthResult = true;
      // Cache user data - tokens are now handled via cookies
      queryClient.setQueryData(["auth", "user"], user);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      showApiSuccess(
        t("welcomeBack"),
        t("loggedInAs", { username: user.username }),
      );
    },
    onError: (error) => {
      // Clear any existing auth data on login failure
      queryClient.removeQueries({ queryKey: ["auth"] });
      handleError(error);
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const t = useTranslations("auth.register");
  const tGeneral = useTranslations();

  const handleError = useCallback(
    (error: unknown) => {
      showApiError(error, tGeneral);
    },
    [tGeneral],
  );

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      // Check if registration feature is enabled
      if (!env.features.enableRegister) {
        throw new Error("Registratie functionaliteit is uitgeschakeld");
      }

      const response = await apiClient.auth.register(userData);
      // API client will throw ApiError if response is not successful
      return response.data;
    },
    onSuccess: () => {
      // Don't log user in - they need to verify their email first
      // Success toast will be shown by the RegisterPage component
      showApiSuccess(t("accountCreated"), t("pleaseVerifyEmail"));
    },
    onError: (error) => {
      handleError(error);
    },
  });
}

/**
 * Hook for resending verification email
 */
export function useResendVerification() {
  const t = useTranslations("auth.emailVerification");
  const tGeneral = useTranslations();

  const handleError = useCallback(
    (error: unknown) => {
      showApiError(error, tGeneral);
    },
    [tGeneral],
  );

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosClient.post("/auth/resend-verification", {
        email,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("resendSuccess"), {
        description: t("resendSuccessDescription"),
        duration: 5000,
      });
    },
    onError: (error: unknown) => {
      // Check for rate limit error
      const apiError = error as {
        status?: number;
        data?: { retry_after_seconds?: number };
      };
      if (apiError?.status === 429) {
        toast.error(t("rateLimitError"), {
          description: apiError?.data?.retry_after_seconds
            ? `Please wait ${apiError.data.retry_after_seconds} seconds`
            : t("resendErrorDescription"),
          duration: 5000,
        });
      } else {
        handleError(error);
      }
    },
  });
}

/**
 * Hook for checking email verification status
 */
export function useCheckVerification(userId: string | null) {
  return useQuery({
    queryKey: ["emailVerification", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await axiosClient.get(
        `/auth/check-verification?user_id=${userId}`,
      );
      return response.data as { verified: boolean; email?: string };
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 0, // Always fetch fresh data
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth");
  const tGeneral = useTranslations();

  const handleError = useCallback(
    (error: unknown) => {
      showApiError(error, tGeneral);
    },
    [tGeneral],
  );

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.auth.logout();
      // API client will throw ApiError if logout fails
    },
    onSuccess: () => {
      // Reset auth tracking on logout
      hasAttemptedAuth = true;
      lastAuthResult = false;
      // Clear all cached data
      queryClient.clear();

      showApiSuccess(t("success"), t("seeYouNextTime"));
      // Redirect to login page after logout with language awareness
      const currentLanguage = window.location.pathname.startsWith("/en")
        ? "en"
        : "nl";
      navigate.push(`/${currentLanguage}/login`);
    },
    onError: (error) => {
      // Reset auth tracking even if logout fails
      hasAttemptedAuth = true;
      lastAuthResult = false;
      // Even if logout API fails, clear local data
      queryClient.clear();
      handleError(error);
    },
  });
}

/**
 * Hook to get current user data
 */
export function useCurrentUser() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async (): Promise<User | null> => {
      const response = await apiClient.auth.getCurrentUser();

      if (!response.success || !response.data) {
        // Track failed auth attempt
        hasAttemptedAuth = true;
        lastAuthResult = false;
        return null;
      }

      // Track successful auth
      hasAttemptedAuth = true;
      lastAuthResult = true;
      return response.data;
    },
    enabled: () => {
      // SSR check - don't run on server
      if (typeof document === "undefined") return false;

      // Always allow first attempt since we can't read HttpOnly cookies
      if (!hasAttemptedAuth) return true;

      // If last attempt was successful, allow refetch (user might still be authenticated)
      if (lastAuthResult === true) return true;

      // If we have cached user data, allow refetch to check if still valid
      const cachedUser = queryClient.getQueryData(["auth", "user"]);
      if (cachedUser) return true;

      // If last attempt failed and no cached user, don't spam the API
      return false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retry: (failureCount: number, error: any) => {
      // Don't retry on 401 errors (handled by API client)
      if (error?.message?.includes("Authentication failed")) {
        hasAttemptedAuth = true;
        lastAuthResult = false;
        return false;
      }
      return failureCount < 3;
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: true, // Always refetch on mount to get fresh data
    // Don't refetch on reconnect for auth queries to avoid spam
    refetchOnReconnect: false,
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { data: user, isLoading } = useCurrentUser();

  // Don't consider user authenticated while loading
  if (isLoading) return false;

  return !!user;
}

/**
 * Hook to check authentication status without triggering queries
 */
export function useAuthStatus() {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isAuthenticated: !!user && !isLoading,
    isLoading,
    error,
  };
}

/**
 * Hook for token refresh (manual trigger if needed)
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<User | null> => {
      const response = await apiClient.auth.refreshToken();

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    },
    onSuccess: (user: User | null) => {
      if (user) {
        // Update auth tracking
        hasAttemptedAuth = true;
        lastAuthResult = true;
        // Cache the refreshed user data
        queryClient.setQueryData(["auth", "user"], user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      } else {
        // Clear auth data if refresh failed
        hasAttemptedAuth = true;
        lastAuthResult = false;
        queryClient.removeQueries({ queryKey: ["auth"] });
      }
    },
    onError: () => {
      // Clear auth data on error
      hasAttemptedAuth = true;
      lastAuthResult = false;
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
  });
}
