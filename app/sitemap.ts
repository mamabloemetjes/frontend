import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const locales = ["nl", "en"];

  const routes = [
    "",
    "/about",
    "/contact",
    "/products",
    "/cart",
    "/privacy",
    "/terms",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add all routes for both locales
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            nl: `${baseUrl}/nl${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    });
  });

  return sitemap;
}
