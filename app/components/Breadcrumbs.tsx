"use client";

import { usePathname } from "next/navigation";
import { LanguageAwareLink } from "./LanguageAwareLink";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [productName, setProductName] = useState<string | null>(null);

  // Remove locale from pathname
  const pathWithoutLocale = pathname.replace(/^\/(nl|en)/, "");

  // Split path into segments
  const segments = pathWithoutLocale.split("/").filter(Boolean);

  // Check if we're on a product detail page
  const isProductDetail = segments[0] === "products" && segments.length === 2;
  const productId = isProductDetail ? segments[1] : null;

  // Fetch product name if on product detail page
  useEffect(() => {
    if (productId) {
      api.products
        .getById(productId, false)
        .then((response) => {
          if (response.success && response.data?.product) {
            setProductName(response.data.product.name);
          }
        })
        .catch(() => {
          // Silently fail
        });
    }
  }, [productId]);

  // Don't show breadcrumbs on home page
  if (segments.length === 0) {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [{ label: t("home"), href: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Handle product detail page
    if (isProductDetail && index === 1) {
      if (productName) {
        breadcrumbs.push({
          label: productName,
          href: currentPath,
        });
      }
      return;
    }

    // Skip other dynamic segments like IDs
    if (segment.match(/^[0-9a-f-]{36}$/i) || !isNaN(Number(segment))) {
      return;
    }

    // Map segment to translated label
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Use translations for known routes
    const translationMap: Record<string, string> = {
      products: t("products"),
      cart: t("cart"),
      contact: "Contact",
      about: "Over ons",
      checkout: t("checkout"),
      account: t("account"),
      dashboard: t("dashboard"),
      orders: t("orders"),
      privacy: "Privacy",
      terms: "Voorwaarden",
    };

    if (translationMap[segment]) {
      label = translationMap[segment];
    }

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="container mx-auto px-4 py-4"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={breadcrumb.href}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index === 0 ? (
                <LanguageAwareLink
                  href={breadcrumb.href}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span itemProp="name">{breadcrumb.label}</span>
                  <meta itemProp="item" content={breadcrumb.href} />
                </LanguageAwareLink>
              ) : isLast ? (
                <span
                  className="text-foreground font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {breadcrumb.label}
                </span>
              ) : (
                <LanguageAwareLink
                  href={breadcrumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  <span itemProp="name">{breadcrumb.label}</span>
                  <meta itemProp="item" content={breadcrumb.href} />
                </LanguageAwareLink>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
