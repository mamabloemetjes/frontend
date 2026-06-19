"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, Heart, ArrowRight, Palette } from "lucide-react";
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

  // Fetch one funeral, wedding, birth, and flowers product
  const funeralResponse = await fetchProducts(1, 1, true, "funeral");
  const weddingResponse = await fetchProducts(1, 1, true, "wedding");
  const birthResponse = await fetchProducts(1, 1, true, "birth");
  const flowersResponse = await fetchProducts(1, 1, true, "flowers");

  const funeralProduct = funeralResponse.data?.products?.[0];
  const weddingProduct = weddingResponse.data?.products?.[0];
  const birthProduct = birthResponse.data?.products?.[0];
  const flowersProduct = flowersResponse.data?.products?.[0];

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
            "Decoratieve Bloemen",
            "Handgemaakte vilt decoratieve bloemen voor het huis",
            "75.00",
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
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section with Image and Text */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            {appT("title")}
          </h1>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Hero Image */}
            <div className="relative overflow-hidden border-4 border-foreground shadow-xl">
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
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-lg font-bold text-pastel-rose"
                >
                  <LanguageAwareLink href="/about">
                    {appT("readMore")} →
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section - Funeral, Wedding, Birth & Flowers */}
        {(funeralProduct ||
          weddingProduct ||
          birthProduct ||
          flowersProduct) && (
          <section className="mb-16">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Funeral Flowers Section */}
              {funeralProduct && (
                <div className="flex flex-col h-full border-4 border-pastel-rose p-6 bg-pastel-rose/5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3 text-pastel-rose">
                      {homeT("funeralSection.title")}
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      {homeT("funeralSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={funeralProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <p className="text-muted-foreground mb-3 font-medium">
                      {homeT("funeralSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full border-pastel-rose text-pastel-rose hover:bg-pastel-rose/10"
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
                <div className="flex flex-col h-full border-4 border-pastel-peach p-6 bg-pastel-peach/5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3 text-pastel-peach">
                      {homeT("weddingSection.title")}
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      {homeT("weddingSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={weddingProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <p className="text-muted-foreground mb-3 font-medium">
                      {homeT("weddingSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full border-pastel-peach text-pastel-peach hover:bg-pastel-peach/10"
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
                <div className="flex flex-col h-full border-4 border-pastel-lavender p-6 bg-pastel-lavender/5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3 text-pastel-lavender">
                      {homeT("birthSection.title")}
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      {homeT("birthSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={birthProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <p className="text-muted-foreground mb-3 font-medium">
                      {homeT("birthSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full border-pastel-lavender text-pastel-lavender hover:bg-pastel-lavender/10"
                    >
                      <LanguageAwareLink href="/birth-pieces/shop">
                        {homeT("birthSection.viewAll")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              )}
              {/* Decorative Flowers Section */}
              {flowersProduct && (
                <div className="flex flex-col h-full border-4 border-pastel-sage p-6 bg-pastel-sage/5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3 text-pastel-sage">
                      {homeT("flowersSection.title")}
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      {homeT("flowersSection.description")}
                    </p>
                  </div>
                  <div className="mb-6 flex-1 flex">
                    <div className="w-full">
                      <ProductCard product={flowersProduct} variant="default" />
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <p className="text-muted-foreground mb-3 font-medium">
                      {homeT("flowersSection.seeMore")}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full border-pastel-sage text-pastel-sage hover:bg-pastel-sage/10"
                    >
                      <LanguageAwareLink href="/flowers/shop">
                        {homeT("flowersSection.viewAll")}
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
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
              {homeT("exploreDescription")}
            </p>
          </div>
          {/* Flower Collections Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Funeral */}
            <div className="border-4 border-pastel-rose p-6 bg-pastel-rose/5 flex flex-col h-full hover:shadow-xl hover:shadow-pastel-rose/20 transition-all">
              <h3 className="text-2xl font-bold text-pastel-rose mb-2">
                {navT("rouwstukken")}
              </h3>
              <p className="text-muted-foreground mb-6 grow text-sm">
                Elegant arrangements for honoring loved ones
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-2 border-pastel-rose text-pastel-rose hover:bg-pastel-rose/10 font-bold"
              >
                <LanguageAwareLink href="/funeral-flowers/shop">
                  Shop
                </LanguageAwareLink>
              </Button>
            </div>

            {/* Wedding */}
            <div className="border-4 border-pastel-peach p-6 bg-pastel-peach/5 flex flex-col h-full hover:shadow-xl hover:shadow-pastel-peach/20 transition-all">
              <h3 className="text-2xl font-bold text-pastel-peach mb-2">
                {navT("bruidsboeketten")}
              </h3>
              <p className="text-muted-foreground mb-6 grow text-sm">
                Beautiful bouquets for your special day
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-2 border-pastel-peach text-pastel-peach hover:bg-pastel-peach/10 font-bold"
              >
                <LanguageAwareLink href="/wedding-bouquets/shop">
                  Shop
                </LanguageAwareLink>
              </Button>
            </div>

            {/* Birth Pieces */}
            <div className="border-4 border-pastel-lavender p-6 bg-pastel-lavender/5 flex flex-col h-full hover:shadow-xl hover:shadow-pastel-lavender/20 transition-all">
              <h3 className="text-2xl font-bold text-pastel-lavender mb-2">
                {navT("geboortestukken")}
              </h3>
              <p className="text-muted-foreground mb-6 grow text-sm">
                Celebrate new arrivals with joy
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-2 border-pastel-lavender text-pastel-lavender hover:bg-pastel-lavender/10 font-bold"
              >
                <LanguageAwareLink href="/birth-pieces/shop">
                  Shop
                </LanguageAwareLink>
              </Button>
            </div>

            {/* Flowers */}
            <div className="border-4 border-pastel-sage p-6 bg-pastel-sage/5 flex flex-col h-full hover:shadow-xl hover:shadow-pastel-sage/20 transition-all">
              <h3 className="text-2xl font-bold text-pastel-sage mb-2">
                {homeT("flowersSection.title")}
              </h3>
              <p className="text-muted-foreground mb-6 grow text-sm">
                {homeT("flowersSection.description")}
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-2 border-pastel-sage text-pastel-sage hover:bg-pastel-sage/10 font-bold"
              >
                <LanguageAwareLink href="/flowers/shop">
                  {homeT("flowersSection.viewAll")}
                </LanguageAwareLink>
              </Button>
            </div>
          </div>

          {/* Additional Links Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto py-6 border-2 border-pastel-mint text-pastel-mint hover:bg-pastel-mint/10 font-bold"
            >
              <LanguageAwareLink
                href="/workshops"
                className="flex flex-col items-center gap-3"
              >
                <Palette className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-bold">
                  {navT("workshops")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto py-6 border-2 border-pastel-rose text-pastel-rose hover:bg-pastel-rose/10 font-bold"
            >
              <LanguageAwareLink
                href="/about"
                className="flex flex-col items-center gap-3"
              >
                <Heart className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-bold">
                  {navT("about")}
                </span>
              </LanguageAwareLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto py-6 border-2 border-pastel-peach text-pastel-peach hover:bg-pastel-peach/10 font-bold"
            >
              <LanguageAwareLink
                href="/contact"
                className="flex flex-col items-center gap-3"
              >
                <Mail className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-bold">
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
