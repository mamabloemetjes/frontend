"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Mail, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.bruidsboeketten" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/wedding-bouquets`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/wedding-bouquets`,
        en: `${baseUrl}/en/wedding-bouquets`,
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

const BruidsboekettenPage = async ({ params }: Props) => {
  const { locale } = await params;
  const p = await getTranslations({ locale, namespace: "paragraphs.wedding" });
  const appT = await getTranslations({ locale, namespace: "app" });

  const actOne = [
    { title: p("weddingTitle1"), body: p("weddingDesc1") },
    { title: p("weddingTitle2"), body: p("weddingDesc2") },
  ];

  const actTwo = [
    { title: p("weddingTitle3"), body: p("weddingDesc3") },
    { title: p("weddingTitle4"), body: p("weddingDesc4") },
    { title: p("weddingTitle5"), body: p("weddingDesc5") },
    { title: p("weddingTitle6"), body: p("weddingDesc6") },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-12">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-16 pb-10 border-b border-border">
        <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-6">
          <span className="h-1.5 w-1.5 bg-secondary" />
          Bruidsboeketten
        </span>
        <h1
          className="text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          {p("weddingTitle")}
        </h1>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* Act one */}
        {actOne.map((section, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 py-10 border-b border-border"
          >
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
            <p className="text-muted-foreground leading-relaxed text-base md:pt-7">
              {section.body}
            </p>
          </div>
        ))}

        {/* Subheader divider */}
        <div className="py-12 border-b border-border flex items-center gap-6">
          <span className="h-px flex-1 bg-border" />
          <h2
            className="text-2xl font-semibold text-foreground tracking-tight text-center"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {p("weddingSubheader")}
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Act two */}
        {actTwo.map((section, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 py-10 border-b border-border"
          >
            <div className="space-y-3">
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                {String(i + actOne.length + 1).padStart(2, "0")}
              </span>
              <h2
                className="text-xl font-semibold text-foreground leading-snug"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {section.title}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base md:pt-7">
              {section.body}
            </p>
          </div>
        ))}

        {/* Dual CTA band */}
        <div className="mt-16 border border-border">
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <LanguageAwareLink
              href="/contact"
              className="flex items-center justify-between gap-4 p-8 md:p-10 hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground group-hover:text-accent-foreground">
                  {appT("advice")}
                </p>
                <p
                  className="text-xl font-semibold text-foreground group-hover:text-accent-foreground"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {p("weddingContactButton")}
                </p>
              </div>
              <Mail className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground shrink-0" />
            </LanguageAwareLink>

            <LanguageAwareLink
              href="/wedding-bouquets/shop"
              className="flex items-center justify-between gap-4 p-8 md:p-10 bg-foreground text-background hover:opacity-90 transition-opacity group"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-widest uppercase opacity-60">
                  {appT("collection")}
                </p>
                <p
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {p("weddingBrowseButton")}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BruidsboekettenPage;
