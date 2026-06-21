"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.decobloemen" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/flowers-pieces`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/flowers-pieces`,
        en: `${baseUrl}/en/flowers-pieces`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      type: "website",
    },
  };
}

const FlowersPage = async ({ params }: Props) => {
  const { locale } = await params;
  const paragraphsT = await getTranslations({
    locale,
    namespace: "paragraphs",
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 pb-4 border-b-4 border-blue-500/50">
          {paragraphsT("flowers.flowersTitle")}
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {paragraphsT("flowers.flowersTitle1")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {paragraphsT("flowers.flowersDesc1")}
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button asChild size="lg">
              <LanguageAwareLink href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                {paragraphsT("flowers.flowersContactButton")}
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg">
              <LanguageAwareLink
                href="/flowers-pieces/shop"
                className="flex items-center"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {paragraphsT("flowers.flowersShopButton")}
              </LanguageAwareLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowersPage;
