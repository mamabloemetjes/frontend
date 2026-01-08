"use server";

import { Props } from "@/types";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Flower2, Heart, Mail } from "lucide-react";
import { Metadata } from "next";
import { createAboutPageSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/about`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Francis van Wieringen" }],
    creator: "Francis van Wieringen",
    publisher: "Roos van Sharon",
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/about`,
        en: `${baseUrl}/en/about`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: common("siteName"),
      locale: common("locale"),
      type: "website",
      images: [
        {
          url: `${baseUrl}/flower.webp`,
          width: 1200,
          height: 630,
          alt: common("imageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/flower.webp`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const About = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  // Structured Data for About Page
  const structuredData = createAboutPageSchema(locale, t("aboutMeDesc2"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          {t("heroTitle")}
        </h1>

        {/* Pinterest-style masonry layout */}
        <div
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto"
          style={{ columnFill: "balance" }}
        >
          {/* Image Card */}
          <div className="break-inside-avoid mb-6">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <Image
                src="/flower.webp"
                alt={t("heroTitle")}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                width={600}
                height={400}
                priority
              />
            </div>
          </div>

          {/* Hero Description Card */}
          <div className="break-inside-avoid mb-6">
            <section className="bg-primary/20 dark:bg-primary/10 rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <Flower2 className="w-8 h-8 shrink-0 text-primary" />
                <h2 className="text-2xl font-bold pt-1">{t("heroTitle")}</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t("heroDesc1")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("heroDesc2")}
                </p>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  {t("heroDesc3")}
                </p>
              </div>
            </section>
          </div>

          {/* About Me Card */}
          <div className="break-inside-avoid mb-6">
            <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <Heart className="w-8 h-8 shrink-0 text-primary" />
                <h2 className="text-2xl font-bold pt-1">{t("aboutMeTitle")}</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  {t("aboutMeDesc1")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("aboutMeDesc2")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("aboutMeDesc3")}
                </p>
              </div>
            </section>
          </div>

          {/* Closing Card */}
          <div className="break-inside-avoid mb-6">
            <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-6 shadow-lg border border-muted-foreground/20 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <Mail className="w-8 h-8 shrink-0 text-primary" />
                <h2 className="text-2xl font-bold pt-1">Contact</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t("closingDesc1")}
                </p>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  {t("closingDesc2")}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
