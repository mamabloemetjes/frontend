import { useEffect, useState } from 'react';
import { csrfService } from '@/lib/csrf';

/**
 * Hook to initialize and manage CSRF token
 * Call this once at the app level to ensure CSRF token is loaded
 */
export function useCSRF() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeCSRF = async () => {
      try {
        await csrfService.getToken();
        setIsLoading(false);
      } catch (err) {
        console.error('[CSRF] Failed to initialize token:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize CSRF token'));
        setIsLoading(false);
      }
    };

    initializeCSRF();
  }, []);

  const refreshToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await csrfService.refreshToken();
      setIsLoading(false);
    } catch (err) {
      console.error('[CSRF] Failed to refresh token:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh CSRF token'));
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    refreshToken,
  };
}
