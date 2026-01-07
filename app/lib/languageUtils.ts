/**
 * Utility functions for language-aware navigation
 */

/**
 * Get the current language from the pathname
 */
export function getCurrentLanguage(pathname: string): "nl" | "en" {
  return pathname.startsWith("/en") ? "en" : "nl";
}

/**
 * Create a language-aware path
 */
export function createLanguagePath(
  path: string,
  currentLanguage: "nl" | "en"
): string {
  if (currentLanguage === "en") {
    // Ensure path doesn't start with /en if it already does
    if (path.startsWith("/en")) {
      return path;
    }
    return `/en${path}`;
  }
  // For Dutch, ensure path doesn't have /nl prefix
  return path.startsWith("/en") ? path.replace(/^\/en/, "") : path;
}

/**
 * Get the language-aware version of a path based on current location
 */
export function getLanguageAwarePath(
  path: string,
  currentPathname: string
): string {
  const currentLanguage = getCurrentLanguage(currentPathname);
  return createLanguagePath(path, currentLanguage);
}
