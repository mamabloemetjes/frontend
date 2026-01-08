"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, Heart, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";
import { fetchNewestProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components";
import {
  createLocalBusinessSchema,
  createBasicProductSchema,
  MERCHANT_RETURN_POLICY_SCHEMA,
} from "@/lib/structured-data";

interface Props {
  params: Promise<{ locale: string }>;
}

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

  const { data } = await fetchNewestProducts(3, true);
  const featuredProducts = data?.products || [];

  // Structured Data for Homepage
  const structuredData = {
    ...createLocalBusinessSchema(locale),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vilt Bloemen Producten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            ...createBasicProductSchema(
              "Rouwstukken",
              "Handgemaakte vilt rouwstukken en memorial altaren",
              "100.00",
            ),
            offers: {
              ...createBasicProductSchema(
                "Rouwstukken",
                "Handgemaakte vilt rouwstukken en memorial altaren",
                "100.00",
              ).offers,
              hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY_SCHEMA,
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            ...createBasicProductSchema(
              "Bruidsboeketen",
              "Unieke handgemaakte vilt bruidsboeketten",
              "300.00",
            ),
            offers: {
              ...createBasicProductSchema(
                "Bruidsboeketen",
                "Unieke handgemaakte vilt bruidsboeketten",
                "300.00",
              ).offers,
              hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY_SCHEMA,
            },
          },
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
        name: "Wat zijn vilt bloemen van Roos van Sharon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vilt bloemen van Roos van Sharon zijn handgemaakte, duurzame bloemen gemaakt van hoogwaardig vilt. Perfect voor rouwstukken en bruidsboeketten, bieden ze een blijvende herinnering aan bijzondere momenten.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe lang duren vilt bloemen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vilt bloemen zijn extreem duurzaam en kunnen jarenlang meegaan zonder te verwelken. Ze zijn een perfecte keuze voor blijvende herinneringen aan rouwstukken of als een blijvend bruidsboeket.",
        },
      },
      {
        "@type": "Question",
        name: "Kunnen vilt bloemen gepersonaliseerd worden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, alle vilt bloemen worden met persoonlijke aandacht gemaakt. U kunt contact opnemen voor maatwerk in kleuren, vormen en arrangementen die perfect passen bij uw wensen.",
        },
      },
      {
        "@type": "Question",
        name: "Voor welke gelegenheden zijn vilt bloemen geschikt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vilt bloemen zijn vooral geschikt voor rouwstukken, memorial altaren en bruidsboeketten. Ze bieden een duurzaam alternatief voor verse bloemen en kunnen een blijvende herinnering vormen.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe bestel ik vilt bloemen?",
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

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">
                {homeT("featuredProducts")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {homeT("featuredProductsDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <LanguageAwareLink href="/products">
                  {homeT("viewAllProducts")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </LanguageAwareLink>
              </Button>
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
                href="/rouwstukken"
                className="flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🕯️</span>
                <span>{navT("rouwstukken")}</span>
              </LanguageAwareLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6">
              <LanguageAwareLink
                href="/bruidsboeketten"
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
