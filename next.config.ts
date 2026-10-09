import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  env: {
    // Keep the existing local variable name working in browser components.
    NEXT_PUBLIC_SUPABASE_ANON:
      process.env.NEXT_PUBLIC_SUPABASE_ANON
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wludcrzecbalaarykziw.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n.ts");
export default withNextIntl(nextConfig);
