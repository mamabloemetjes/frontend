"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.home" });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">{t("hero.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag />
              {t("premade.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{t("premade.description")}</p>
            <Button asChild>
              <LanguageAwareLink href="/products">
                {t("premade.cta")}
              </LanguageAwareLink>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail />
              {t("custom.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{t("custom.description")}</p>
            <Button asChild>
              <LanguageAwareLink href="/contact">
                {t("custom.cta")}
              </LanguageAwareLink>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
