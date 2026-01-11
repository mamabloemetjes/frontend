"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, Heart, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";
import { ProductCard } from "@/components";
import {
  createLocalBusinessSchema,
  createBasicProductSchema,
  createOpenGraphMetadata,
  createTwitterMetadata,
} from "@/lib/structured-data";
import { Props } from "@/types";
import { fetchProducts } from "@/hooks/useProducts";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}`;

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
        nl: `${baseUrl}/nl`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: createOpenGraphMetadata(
      locale,
      t("title"),
      t("description"),
      "",
      common("imageAlt"),
    ),
    twitter: createTwitterMetadata(t("title"), t("description")),
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

const HomePage = async ({ params }: Props) => {
  const { locale } = await params;
  const appT = await getTranslations({ locale, namespace: "app" });
  const navT = await getTranslations({
    locale,
    namespace: "navigation.footer",
  });
  const seoCommon = await getTranslations({
    locale,
    namespace: "seo.common",
  });
  const homeT = await getTranslations({
    locale,
    namespace: "pages.home",
  });

  // Fetch one funeral and one wedding product
  const funeralResponse = await fetchProducts(1, 1, true, "funeral");
  const weddingResponse = await fetchProducts(1, 1, true, "wedding");

  const funeralProduct = funeralResponse.data?.products?.[0];
  const weddingProduct = weddingResponse.data?.products?.[0];

  // Structured Data for Homepage
  const structuredData = {
    ...createLocalBusinessSchema(locale),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Viltbloemen Producten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: createBasicProductSchema(
            "Rouwstukken",
            "Handgemaakte vilt rouwstukken en memorial altaren",
            "100.00",
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/flower.webp`,
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/${locale}/funeral-flowers/shop`,
          ),
        },
        {
          "@type": "Offer",
          itemOffered: createBasicProductSchema(
            "Bruidsboeketten",
            "Unieke handgemaakte vilt bruidsboeketten",
            "300.00",
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/flower.webp`,
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/${locale}/wedding-bouquets/shop`,
          ),
        },
      ],
    },
  };

  // FAQ Structured Data for Rich Snippets
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat zijn viltbloemen van Roos van Sharon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Viltbloemen van Roos van Sharon zijn handgemaakte, duurzame bloemen gemaakt van hoogwaardig vilt. Perfect voor rouwstukken en bruidsboeketten, bieden ze een blijvende herinnering aan bijzondere momenten.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe lang duren viltbloemen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Viltbloemen zijn extreem duurzaam en kunnen jarenlang meegaan zonder te verwelken. Ze zijn een perfecte keuze voor blijvende herinneringen aan rouwstukken of als een blijvend bruidsboeket.",
        },
      },
      {
        "@type": "Question",
        name: "Kunnen viltbloemen gepersonaliseerd worden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, alle viltbloemen worden met persoonlijke aandacht gemaakt. U kunt contact opnemen voor maatwerk in kleuren, vormen en arrangementen die perfect passen bij uw wensen.",
        },
      },
      {
        "@type": "Question",
        name: "Voor welke gelegenheden zijn viltbloemen geschikt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Viltbloemen zijn vooral geschikt voor rouwstukken, memorial altaren en bruidsboeketten. Ze bieden een duurzaam alternatief voor verse bloemen en kunnen een blijvende herinnering vormen.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe bestel ik viltbloemen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "U kunt producten bekijken in mijn webshop en direct bestellen. Voor maatwerk of vragen kunt u contact opnemen via de contactpagina. We bieden persoonlijk advies voor uw specifieke wensen.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section with Image and Text */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            {appT("title")}
          </h1>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/flower.webp"
                alt={seoCommon("heroImageAlt")}
                className="w-full h-auto object-cover"
                width={1200}
                height={600}
                priority
              />
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{appT("hero.title")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {appT("hero.description")}
              </p>
              <div>
                <Button asChild variant="link" className="p-0 h-auto text-lg">
                  <LanguageAwareLink href="/about">
                    {appT("readMore")} →
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section - Funeral & Wedding */}
        {(funeralProduct || weddingProduct) && (
          <section className="mb-16">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Funeral Flowers Section */}
              {funeralProduct && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                      {homeT("funeralSection.title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {homeT("funeralSection.description")}
                    </p>
                  </div>
                  <div className="mb-6">
                    <ProductCard product={funeralProduct} variant="default" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-3">
                      {homeT("funeralSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      <LanguageAwareLink href="/funeral-flowers/shop">
                        {homeT("funeralSection.viewAll")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              )}

              {/* Wedding Bouquets Section */}
              {weddingProduct && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                      {homeT("weddingSection.title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {homeT("weddingSection.description")}
                    </p>
                  </div>
                  <div className="mb-6">
                    <ProductCard product={weddingProduct} variant="default" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-3">
                      {homeT("weddingSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      <LanguageAwareLink href="/wedding-bouquets/shop">
                        {homeT("weddingSection.viewAll")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Navigation Links Section */}
        <section className="mt-16 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">{homeT("exploreTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {homeT("exploreDescription")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button asChild size="lg" variant="outline" className="h-auto py-6">
              <LanguageAwareLink
                href="/funeral-flowers"
                className="flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🕯️</span>
                <span>{navT("rouwstukken")}</span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6">
              <LanguageAwareLink
                href="/wedding-bouquets"
                className="flex flex-col items-center gap-2"
              >
                <span className="text-2xl">💐</span>
                <span>{navT("bruidsboeketten")}</span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6">
              <LanguageAwareLink
                href="/about"
                className="flex flex-col items-center gap-2"
              >
                <Heart className="w-8 h-8" />
                <span>{navT("about")}</span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6">
              <LanguageAwareLink
                href="/contact"
                className="flex flex-col items-center gap-2"
              >
                <Mail className="w-8 h-8" />
                <span>{navT("contact")}</span>
              </LanguageAwareLink>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
