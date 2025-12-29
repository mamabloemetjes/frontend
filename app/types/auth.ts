/**
 * User role enumeration defining access levels in the ELO system
 */
export type UserRole = "user" | "admin";

/**
 * User interface representing system users
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

/**
 * Authentication credentials for login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data with validation requirements
 */
export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Current authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}
