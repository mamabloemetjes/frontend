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
  async headers() {
         return [
             {
                 source: '/:path*', // Match all routes
                 headers: [
                     { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                     { key: 'Pragma', value: 'no-cache' },
                     { key: 'Expires', value: '0' },
                 ],
             },
         ];
     },
};

const withNextIntl = createNextIntlPlugin("./i18n.ts");
export default withNextIntl(nextConfig);
