"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface ProductPaginationProps {
  pagination: {
    page: number;
    total_pages: number;
  };
}

export function ProductPagination({ pagination }: ProductPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <nav
      className="mt-12 flex flex-col items-center justify-center gap-4 border-y border-border bg-muted/20 px-4 py-5 sm:flex-row"
      aria-label={t("pagination")}
    >
      <button
        type="button"
        onClick={() => goToPage(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="min-w-28 border border-foreground bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
      >
        {t("previous")}
      </button>
      <span className="min-w-28 text-center text-sm font-medium text-foreground">
        {t("page")} {pagination.page} {t("of")} {pagination.total_pages}
      </span>
      <button
        type="button"
        onClick={() => goToPage(pagination.page + 1)}
        disabled={pagination.page >= pagination.total_pages}
        className="min-w-28 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:text-muted-foreground disabled:opacity-50"
      >
        {t("next")}
      </button>
    </nav>
  );
}
