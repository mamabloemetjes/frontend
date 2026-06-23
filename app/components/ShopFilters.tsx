"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export function ShopFilters({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const t = useTranslations("navigation");

  const CATEGORY_OPTIONS = [
    { value: "", label: t("all") },
    { value: "funeral", label: t("funeral-flowers") },
    { value: "wedding", label: t("wedding-bouquets") },
    { value: "birth", label: t("birth-pieces") },
    { value: "flowers", label: t("flowers") },
  ];

  const currentSort = searchParams.get("sort") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentSearch = searchParams.get("search") ?? "";
  const currentInStock = searchParams.get("in_stock") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParam("search", searchValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAll = () => {
    setSearchValue("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentSort || currentCategory || currentSearch || currentInStock;

  return (
    <div className="space-y-4 mb-10">
      {/* Category pills + in-stock */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          {t("category")}
        </span>

        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => updateParam("category", value)}
            className={`px-3 py-1 text-xs font-medium border transition-colors ${
              currentCategory === value
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
              {t("clearAll")}
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{totalCount}</span>{" "}
          {totalCount === 1 ? t("product") : t("products")}
          {hasActiveFilters && `${" "} ${t("found").toLocaleLowerCase()}`}
        </p>
      </div>
    </div>
  );
}
