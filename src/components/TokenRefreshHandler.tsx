import { useEffect, useRef } from "react";
import { useAuthStatus } from "@/hooks/useAuth";
import { api } from "@/lib/api";

/**
 * TokenRefreshHandler component
 *
 * This component handles proactive token refresh to prevent session expiration.
 * It refreshes the access token before it expires (15 minutes on backend).
 *
 * Strategy:
 * - Refresh every 10 minutes (5 minutes before expiry)
 * - Only refresh when user is authenticated
 * - Stop refreshing when user logs out
 * - Handle page visibility to refresh when user returns to tab
 */
export function TokenRefreshHandler() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const refreshIntervalRef = useRef<number | null>(null);
  const lastRefreshRef = useRef<number>(0);

  useEffect(() => {
    // Don't set up refresh if still loading or not authenticated
    if (isLoading || !isAuthenticated) {
      // Clear any existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Initialize last refresh time on first setup
    if (lastRefreshRef.current === 0) {
      lastRefreshRef.current = Date.now();
    }

    // Function to refresh the token
    const refreshToken = async () => {
      try {
        await api.auth.refreshToken();
        lastRefreshRef.current = Date.now();
        console.log("[TokenRefresh] Access token refreshed successfully");
      } catch (error) {
        console.error("[TokenRefresh] Failed to refresh token:", error);
        // Error will be handled by the API interceptor
      }
    };

    // Set up interval to refresh every 10 minutes (600,000 ms)
    // This gives us a 5-minute buffer before the 15-minute expiry
    const REFRESH_INTERVAL: number = 10 * 60 * 1000;

    refreshIntervalRef.current = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if it's been more than 10 minutes since last refresh
        const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
        const TEN_MINUTES = 10 * 60 * 1000;

        if (timeSinceLastRefresh > TEN_MINUTES) {
          console.log(
            "[TokenRefresh] Page became visible after 10+ minutes, refreshing token",
          );
          refreshToken();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount or when auth state changes
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, isLoading]);

  // This component doesn't render anything
  return null;
}
