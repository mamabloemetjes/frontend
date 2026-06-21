"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, Heart, ArrowRight, Palette } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";
import { Hero, ProductCard } from "@/components";
import {
  createLocalBusinessSchema,
  createBasicProductSchema,
  createOpenGraphMetadata,
  createTwitterMetadata,
} from "@/lib/structured-data";
import { Props } from "@/types";
import { fetchProducts } from "@/hooks/useProducts";
import { Separator } from "@/components/ui/separator";

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

  // Fetch one funeral, wedding, and birth product
  const funeralResponse = await fetchProducts(1, 1, true, "funeral");
  const weddingResponse = await fetchProducts(1, 1, true, "wedding");
  const birthResponse = await fetchProducts(1, 1, true, "birth");
  const flowerResponse = await fetchProducts(1, 1, true, "flowers");

  const funeralProduct = funeralResponse.data?.products?.[0];
  const weddingProduct = weddingResponse.data?.products?.[0];
  const birthProduct = birthResponse.data?.products?.[0];
  const flowerProduct = flowerResponse.data?.products?.[0];

  const len = [
    funeralProduct,
    weddingProduct,
    birthProduct,
    flowerProduct,
  ].filter(Boolean).length;

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
        {
          "@type": "Offer",
          itemOffered: createBasicProductSchema(
            "Geboortestukken",
            "Handgemaakte vilt geboortestukken voor het vieren van nieuw leven",
            "150.00",
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/flower.webp`,
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/${locale}/birth-pieces/shop`,
          ),
        },
        {
          "@type": "Offer",
          itemOffered: createBasicProductSchema(
            "Viltbloemen",
            "Handgemaakte viltbloemen voor alle gelegenheden",
            "50.00",
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/flower.webp`,
            `${process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl"}/${locale}/flowers/shop`,
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
      <div className="container mx-auto px-4 pb-12">
        {/* Hero */}
        <Hero appT={appT} />
        <Separator className="my-12" />
        {/* A little about me Section with Image and Text */}
        <section className="mb-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/flower.webp"
                alt={seoCommon("heroImageAlt")}
                className="object-cover w-full h-full"
                width={400}
                height={200}
                priority
              />
            </div>

            {/* About me Text */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{appT("hero.title")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {appT("hero.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products Section - Funeral, Wedding & Birth */}
        {(funeralProduct ||
          weddingProduct ||
          birthProduct ||
          flowerProduct) && (
          <section className="mb-16">
            <div
              className={`max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-${len} gap-8`}
            >
              {/* Funeral Flowers Section */}
              {funeralProduct && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                      {homeT("funeralSection.title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {homeT("funeralSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={funeralProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
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
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                      {homeT("weddingSection.title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {homeT("weddingSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={weddingProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
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

              {/* Birth Pieces Section */}
              {birthProduct && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                      {homeT("birthSection.title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {homeT("birthSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={birthProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <p className="text-muted-foreground mb-3">
                      {homeT("birthSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      <LanguageAwareLink href="/birth-pieces/shop">
                        {homeT("birthSection.viewAll")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              )}
              {/* Flower Section */}
              {flowerProduct && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                      {homeT("flowerSection.title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {homeT("flowerSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={flowerProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <p className="text-muted-foreground mb-3">
                      {homeT("flowerSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      <LanguageAwareLink href="/flowers/shop">
                        {homeT("flowerSection.viewAll")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <Separator className="my-12" />

        {/* Navigation Links Section */}
        <section className="mt-16 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">{homeT("exploreTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {homeT("exploreDescription")}
            </p>
          </div>

          {/* Flower Collections Group */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/funeral-flowers"
                className="flex flex-col items-center gap-3"
              >
                <span className="text-sm md:text-base font-medium">
                  {navT("rouwstukken")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/wedding-bouquets"
                className="flex flex-col items-center gap-3"
              >
                <span className="text-sm md:text-base font-medium">
                  {navT("bruidsboeketten")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/birth-pieces"
                className="flex flex-col items-center gap-3"
              >
                <span className="text-sm md:text-base font-medium">
                  {navT("geboortestukken")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/flowers"
                className="flex flex-col items-center gap-3"
              >
                <span className="text-sm md:text-base font-medium">
                  {navT("bloemen")}
                </span>
              </LanguageAwareLink>
            </Button>
          </div>

          {/* General Pages Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/workshops"
                className="flex flex-col items-center gap-3"
              >
                <Palette className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-medium">
                  {navT("workshops")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/about"
                className="flex flex-col items-center gap-3"
              >
                <Heart className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-medium">
                  {navT("about")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-8">
              <LanguageAwareLink
                href="/contact"
                className="flex flex-col items-center gap-3"
              >
                <Mail className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-medium">
                  {navT("contact")}
                </span>
              </LanguageAwareLink>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
