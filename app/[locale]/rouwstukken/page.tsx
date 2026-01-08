"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.rouwstukken" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/rouwstukken`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/rouwstukken`,
        en: `${baseUrl}/en/rouwstukken`,
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

const RouwstukkenPage = async ({ params }: Props) => {
  const { locale } = await params;
  const paragraphsT = await getTranslations({
    locale,
    namespace: "paragraphs",
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 pb-4 border-b-4 border-muted-foreground/30">
          {paragraphsT("mourning.mournPiecesTitle")}
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {paragraphsT("mourning.mournPiecesTitle1")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {paragraphsT("mourning.mournPiecesDesc1")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {paragraphsT("mourning.mournPiecesTitle2")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {paragraphsT("mourning.mournPiecesDesc2")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {paragraphsT("mourning.mournPiecesTitle3")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {paragraphsT("mourning.mournPiecesDesc3")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {paragraphsT("mourning.mournPiecesTitle4")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {paragraphsT("mourning.mournPiecesDesc4")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {paragraphsT("mourning.mournPiecesTitle5")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {paragraphsT("mourning.mournPiecesDesc5")}
            </p>
          </div>

          <div className="pt-6">
            <Button asChild size="lg">
              <LanguageAwareLink href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Bekijk Rouwstukken
              </LanguageAwareLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouwstukkenPage;
