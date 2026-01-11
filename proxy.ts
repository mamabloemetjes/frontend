import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use the default locale for the root path
  localePrefix: "always",
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico).*)",
  ],
};
