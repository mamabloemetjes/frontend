import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext, type AuthContextType } from "./auth-context";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth(): AuthContextType {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  return auth;
}
