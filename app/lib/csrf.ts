import { apiClient } from "@/lib/api";

class CSRFService {
  private fetchPromise: Promise<void> | null = null;

  /**
   * Get the CSRF token from cookie
   */
  getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const name = trimmed.substring(0, separatorIndex);
      const value = trimmed.substring(separatorIndex + 1);

      if (name === "csrf") {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Fetch a new CSRF token from the server
   * This will set the CSRF cookie, which we'll read from document.cookie
   */
  private async fetchToken(): Promise<void> {
    try {
      await apiClient.get("/auth/csrf");
      console.log("[CSRF] Token fetched successfully");
    } catch (error) {
      console.error("[CSRF] Failed to fetch token:", error);
      throw error;
    }
  }

  /**
   * Ensure we have a CSRF token, fetching one if needed
   */
  async ensureToken(): Promise<void> {
    // Check if we already have a token in cookie
    const cookieToken = this.getTokenFromCookie();
    if (cookieToken) {
      return;
    }

    // If we're already fetching a token, wait for that request
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Fetch a new token
    this.fetchPromise = this.fetchToken();

    try {
      await this.fetchPromise;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Get the current CSRF token from cookie
   * Always returns the cookie value to ensure consistency with backend
   */
  async getToken(): Promise<string> {
    await this.ensureToken();

    const token = this.getTokenFromCookie();
    if (!token) {
      throw new Error("CSRF token not found in cookie after fetch");
    }

    return token;
  }

  /**
   * Refresh the CSRF token
   */
  async refreshToken(): Promise<string> {
    this.fetchPromise = null;
    await this.fetchToken();
    return this.getToken();
  }

  /**
   * Clear the fetch promise (used when cookie is cleared)
   */
  clearCache(): void {
    this.fetchPromise = null;
  }
}

export const csrfService = new CSRFService();
