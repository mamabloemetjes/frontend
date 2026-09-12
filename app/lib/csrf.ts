import { apiClient, type ApiResponse } from "@/lib/api";

interface CSRFTokenData {
  csrf_token: string;
}

class CSRFService {
  private token: string | null = null;
  private fetchPromise: Promise<string> | null = null;

  /**
   * Fetch a new CSRF token from the server.
   * The server also sets a cookie for its own double-submit comparison,
   * but that cookie is scoped to the API's own host and can't be read
   * from JS running on a different origin (document.cookie won't see it
   * cross-site) — so we take the token value from the response body
   * instead, which is the value the server expects back in the header.
   */
   private async fetchToken(): Promise<string> {
     const res = (await apiClient.get(
       "/auth/csrf",
     )) as unknown as ApiResponse<CSRFTokenData>;

     const token = res.data.csrf_token;
     this.token = token;
     return token;
   }

  /**
   * Ensure we have a CSRF token, fetching one if needed.
   */
  async ensureToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = this.fetchToken();

    try {
      return await this.fetchPromise;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Get the current CSRF token, fetching one first if needed.
   */
  async getToken(): Promise<string> {
    return this.ensureToken();
  }

  /**
   * Force a fresh token from the server (e.g. after a mismatch/expiry).
   */
  async refreshToken(): Promise<string> {
    this.token = null;
    this.fetchPromise = null;
    return this.ensureToken();
  }

  /**
   * Clear the cached token (e.g. on logout).
   */
  clearCache(): void {
    this.token = null;
    this.fetchPromise = null;
  }
}

export const csrfService = new CSRFService();
