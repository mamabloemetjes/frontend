"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ShoppingBag, ArrowRight } from "lucide-react";
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
  const pageUrl = `${baseUrl}/${locale}/funeral-flowers`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/funeral-flowers`,
        en: `${baseUrl}/en/funeral-flowers`,
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
  const p = await getTranslations({ locale, namespace: "paragraphs.mourning" });

  const sections = [
    { title: p("mournPiecesTitle1"), body: p("mournPiecesDesc1") },
    { title: p("mournPiecesTitle2"), body: p("mournPiecesDesc2") },
    { title: p("mournPiecesTitle3"), body: p("mournPiecesDesc3") },
    { title: p("mournPiecesTitle4"), body: p("mournPiecesDesc4") },
    { title: p("mournPiecesTitle5"), body: p("mournPiecesDesc5") },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-12">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-16 pb-10 border-b border-border">
        <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-6">
          <span className="h-1.5 w-1.5 bg-secondary" />
          Rouwstukken
        </span>
        <h1
          className="text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          {p("mournPiecesTitle")}
        </h1>
      </header>

      {/* Article sections */}
      <div className="max-w-5xl mx-auto">
        {sections.map((section, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 py-10 border-b border-border"
          >
            {/* Left: number + title */}
            <div className="space-y-3">
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                className="text-xl font-semibold text-foreground leading-snug"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {section.title}
              </h2>
            </div>

            {/* Right: body */}
            <p className="text-muted-foreground leading-relaxed text-base md:pt-7">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      {/* CTA band */}
      <div className="max-w-5xl mx-auto mt-16 border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 md:p-10">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Collectie
            </p>
            <p
              className="text-2xl font-semibold text-foreground"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {p("mournPiecesShopButton")}
            </p>
          </div>
          <LanguageAwareLink
            href="/funeral-flowers/shop"
            className="flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity group shrink-0"
          >
            <ShoppingBag className="h-4 w-4" />
            Bekijk de collectie
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </LanguageAwareLink>
        </div>
      </div>
    </div>
  );
};

export default RouwstukkenPage;
