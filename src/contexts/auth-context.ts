import { createContext } from "react";
import type { AuthState } from "@/types/auth";

export interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  refreshAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
