import { getTranslations } from "next-intl/server";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";

export default async function NotFound() {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "pages.404" });

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24">
      <div className="max-w-xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-8">
          <span className="h-1.5 w-1.5 bg-secondary" />
          Error 404
        </span>

        <h1
          className="text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-none mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          404
        </h1>

        <h2
          className="text-2xl font-semibold text-foreground mb-3"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          {t("title")}
        </h2>

        <p className="text-muted-foreground leading-relaxed mb-10 max-w-sm mx-auto">
          {t("description")}
        </p>

        <div className="border border-border">
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <LanguageAwareLink
              href="/"
              className="flex items-center justify-center gap-2 p-5 bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium"
            >
              {t("goToHome")}
            </LanguageAwareLink>
            <LanguageAwareLink
              href="/products"
              className="flex items-center justify-center gap-2 p-5 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
            >
              {t("goToProducts")}
            </LanguageAwareLink>
          </div>
        </div>

        <div className="mt-16 flex justify-center" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="w-24 h-24 opacity-40">
            <g transform="translate(60 60)">
              {Array.from({ length: 6 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx={0}
                  cy={-26}
                  rx={13}
                  ry={22}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  transform={`rotate(${60 * i})`}
                />
              ))}
              <circle
                cx={0}
                cy={0}
                r={10}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
