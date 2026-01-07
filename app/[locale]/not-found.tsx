import { getTranslations } from "next-intl/server";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default async function NotFound() {
  // Default to Dutch locale for not-found pages
  const locale = "nl";
  const t = await getTranslations({ locale, namespace: "pages.404" });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg">
            <LanguageAwareLink href="/">
              <Home className="mr-2 h-5 w-5" />
              {t("goToHome")}
            </LanguageAwareLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LanguageAwareLink href="/products">
              <Search className="mr-2 h-5 w-5" />
              Bekijk Producten
            </LanguageAwareLink>
          </Button>
        </div>

        <div className="mt-12">
          <div className="text-9xl opacity-20" aria-hidden="true">
            🌸
          </div>
        </div>
      </div>
    </div>
  );
}
