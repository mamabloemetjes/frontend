"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";
import React from "react";

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

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.replace("/login");
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== "admin") {
    router.replace("/");
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
}
