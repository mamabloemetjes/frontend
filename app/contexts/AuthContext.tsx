"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useAuth";
import { AuthContext, type AuthContextType } from "@/contexts/auth-context";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useCurrentUser();
  const [authError, setAuthError] = useState<string | undefined>();

  // Handle authentication failures from API client
  useEffect(() => {
    // Define which routes are protected and require authentication
    const handleAuthFailure = () => {
      // Clear all auth data
      queryClient.removeQueries({ queryKey: ["auth"] });
      setAuthError("Your session has expired. Please log in again.");
    };

    // Listen for auth failure events from API client
    window.addEventListener("auth:failure", handleAuthFailure);

    return () => {
      window.removeEventListener("auth:failure", handleAuthFailure);
    };
  }, [router, queryClient, pathname]);

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user && !isLoading,
    isLoading,
    error: authError || (error as Error)?.message,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
