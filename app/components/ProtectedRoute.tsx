"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";
import React from "react";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, requireAdmin, router, user?.role]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || (requireAdmin && user?.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
}
