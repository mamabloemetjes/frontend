import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  env: {
    // Keep the existing local variable name working in browser components.
    NEXT_PUBLIC_SUPABASE_ANON:
      process.env.NEXT_PUBLIC_SUPABASE_ANON
  },
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wludcrzecbalaarykziw.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.roosvansharon.nl",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n.ts");
export default withNextIntl(nextConfig);
