// flowers/page.tsx
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
  const t = await getTranslations({ locale, namespace: "seo.decobloemen" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/flowers`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/flowers`,
        en: `${baseUrl}/en/flowers`,
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
  const p = await getTranslations({ locale, namespace: "paragraphs.flowers" });
  const appT = await getTranslations({ locale, namespace: "app" });

  return (
    <div className="container mx-auto px-4 lg:px-6 py-12">
      <header className="max-w-5xl mx-auto mb-16 pb-10 border-b border-border">
        <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-6">
          <span className="h-1.5 w-1.5 bg-secondary" />
          Bloemen
        </span>
        <h1
          className="text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          {p("flowersTitle")}
        </h1>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 py-10 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              01
            </span>
            <h2
              className="text-xl font-semibold text-foreground leading-snug"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {p("flowersTitle1")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base md:pt-7">
            {p("flowersDesc1")}
          </p>
        </div>

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
                  {p("flowersContactButton")}
                </p>
              </div>
              <Mail className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground shrink-0" />
            </LanguageAwareLink>

            <LanguageAwareLink
              href="/flowers/shop"
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
                  {p("flowersShopButton")}
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

export default FlowersPage;
