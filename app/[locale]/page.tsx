"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, Heart, ArrowRight, Palette } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";
import { Hero, ProductCard } from "@/components";
import { env } from "@/lib/env";
import {
  createLocalBusinessSchema,
  createBasicProductSchema,
  createOpenGraphMetadata,
  createTwitterMetadata,
} from "@/lib/structured-data";
import { Props } from "@/types";
import { fetchProducts } from "@/hooks/useProducts";
import { Separator } from "@/components/ui/separator";
import { ProductListFilters } from "@/lib/api";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

  const baseUrl = env.baseUrl;
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
  // We fetch one product from each category to display on the homepage. If a category has no products, it will be skipped.

  const filters: ProductListFilters = {
    page: 1,
    page_size: 1,
    is_active: true,
    include_images: true,
  };
  const funeralResponse = await fetchProducts({
    ...filters,
    product_type: "funeral",
  });

  const weddingResponse = await fetchProducts({
    ...filters,
    product_type: "wedding",
  });

  const birthResponse = await fetchProducts({
    ...filters,
    product_type: "birth",
  });

  const flowerResponse = await fetchProducts({
    ...filters,
    product_type: "flowers",
  });

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
      <div className="container mx-auto px-4 pb-24">
        {/* Hero */}
        <Hero appT={appT} />

        <Separator className="my-16" />

        {/* About section */}
        <section className="mb-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="overflow-hidden">
              <Image
                src="/flower.webp"
                alt={seoCommon("heroImageAlt")}
                className="object-cover w-full h-full"
                width={600}
                height={600}
                priority
              />
            </div>

            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground">
                <span className="h-1.5 w-1.5 bg-secondary" />
                {appT("about")}
              </span>
              <h2 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-foreground">
                {appT("hero.title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {appT("hero.description")}
              </p>
              <Button asChild size="lg" variant="outline">
                <LanguageAwareLink
                  href="/about"
                  className="flex items-center gap-2"
                >
                  {appT("readMore")}
                  <ArrowRight className="h-4 w-4" />
                </LanguageAwareLink>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {(funeralProduct ||
          weddingProduct ||
          birthProduct ||
          flowerProduct) && (
          <section className="mb-24">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-5">
                  <span className="h-1.5 w-1.5 bg-secondary" />
                  {appT("collection")}
                </span>
                <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
                  {homeT("title")}
                </h2>
              </div>

              <div className={`grid md:grid-cols-2 lg:grid-cols-${len} gap-8`}>
                {funeralProduct && (
                  <div className="flex flex-col h-full">
                    <div className="mb-5 pb-5 border-b border-border">
                      <h3 className="text-xl font-semibold mb-2">
                        {homeT("funeralSection.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {homeT("funeralSection.description")}
                      </p>
                    </div>
                    <div className="mb-6 flex-1">
                      <ProductCard product={funeralProduct} variant="default" />
                    </div>
                    <p className="text-sm space-y-2 text-muted-foreground">
                      {homeT("birthSection.interested")}
                    </p>
                    <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/funeral-flowers/shop">
                          {homeT("funeralSection.shop")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/funeral-flowers">
                          {homeT("funeralSection.readMore")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                    </div>
                  </div>
                )}

                {weddingProduct && (
                  <div className="flex flex-col h-full">
                    <div className="mb-5 pb-5 border-b border-border">
                      <h3 className="text-xl font-semibold mb-2">
                        {homeT("weddingSection.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {homeT("weddingSection.description")}
                      </p>
                    </div>
                    <div className="mb-6 flex-1">
                      <ProductCard product={weddingProduct} variant="default" />
                    </div>
                    <p className="text-sm space-y-2 text-muted-foreground">
                      {homeT("birthSection.interested")}
                    </p>
                    <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/wedding-bouquets/shop">
                          {homeT("weddingSection.shop")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/wedding-bouquets">
                          {homeT("weddingSection.readMore")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                    </div>
                  </div>
                )}

                {birthProduct && (
                  <div className="flex flex-col h-full">
                    <div className="mb-5 pb-5 border-b border-border">
                      <h3 className="text-xl font-semibold mb-2">
                        {homeT("birthSection.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {homeT("birthSection.description")}
                      </p>
                    </div>
                    <div className="mb-6 flex-1">
                      <ProductCard product={birthProduct} variant="default" />
                    </div>
                    <p className="text-sm space-y-2 text-muted-foreground">
                      {homeT("birthSection.interested")}
                    </p>
                    <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/birth-pieces/shop">
                          {homeT("birthSection.shop")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/birth-pieces">
                          {homeT("birthSection.readMore")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                    </div>
                  </div>
                )}

                {flowerProduct && (
                  <div className="flex flex-col h-full">
                    <div className="mb-5 pb-5 border-b border-border">
                      <h3 className="text-xl font-semibold mb-2">
                        {homeT("flowerSection.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {homeT("flowerSection.description")}
                      </p>
                    </div>
                    <div className="mb-6 flex-1">
                      <ProductCard product={flowerProduct} variant="default" />
                    </div>
                    <p className="text-sm space-y-2 text-muted-foreground">
                      {homeT("birthSection.interested")}
                    </p>
                    <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/flowers/shop">
                          {homeT("flowerSection.shop")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full h-auto min-h-10 justify-between px-5 py-2.5 whitespace-normal text-left"
                      >
                        <LanguageAwareLink href="/flowers">
                          {homeT("flowerSection.readMore")}
                          <ArrowRight className="h-4 w-4" />
                        </LanguageAwareLink>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <Separator className="my-16" />

        {/* Explore / Navigation */}
        <section className="max-w-7xl mx-auto mb-8">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground mb-5">
              <span className="h-1.5 w-1.5 bg-secondary" />
              Ontdekken
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              {homeT("exploreTitle")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              {homeT("exploreDescription")}
            </p>
          </div>

          {/* Category tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-px">
            {[
              { href: "/funeral-flowers", label: navT("rouwstukken") },
              { href: "/wedding-bouquets", label: navT("bruidsboeketten") },
              { href: "/birth-pieces", label: navT("geboortestukken") },
              { href: "/flowers", label: navT("bloemen") },
            ].map(({ href, label }) => (
              <LanguageAwareLink
                key={href}
                href={href}
                className="group flex flex-col justify-between bg-card hover:bg-accent hover:text-accent-foreground transition-colors p-8 min-h-35"
              >
                <span className="text-base font-medium text-foreground group-hover:text-accent-foreground">
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-transform group-hover:translate-x-1" />
              </LanguageAwareLink>
            ))}
          </div>

          {/* General pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              { href: "/workshops", label: navT("workshops"), icon: Palette },
              { href: "/about", label: navT("about"), icon: Heart },
              { href: "/contact", label: navT("contact"), icon: Mail },
            ].map(({ href, label, icon: Icon }) => (
              <LanguageAwareLink
                key={href}
                href={href}
                className="group flex items-center justify-between bg-card hover:bg-accent hover:text-accent-foreground transition-colors px-8 py-6"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                  <span className="text-base font-medium text-foreground group-hover:text-accent-foreground">
                    {label}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-transform group-hover:translate-x-1" />
              </LanguageAwareLink>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
