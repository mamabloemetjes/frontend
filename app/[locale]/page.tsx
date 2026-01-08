"use server";

import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, ShoppingBag, Info, Heart, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";
import { fetchNewestProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components";

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
  const paragraphsT = await getTranslations({
    locale,
    namespace: "paragraphs",
  });
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

  const { data } = await fetchNewestProducts(6, true);
  const featuredProducts = data?.products || [];

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";

  // Structured Data for Homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Roos van Sharon",
    description:
      "Handgemaakte vilt bloemen voor rouwstukken en bruidsboeketten",
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/flower.webp`,
    image: `${baseUrl}/flower.webp`,
    founder: {
      "@type": "Person",
      name: "Francis van Wieringen",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
    areaServed: "Nederland",
    priceRange: "€€",
    paymentAccepted: "Tikkie, Bank Transfer",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vilt Bloemen Producten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Rouwstukken",
            description: "Handgemaakte vilt rouwstukken en memorial altaren",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Bruidsboeketen",
            description: "Unieke handgemaakte vilt bruidsboeketten",
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
              <p className="text-lg text-muted-foreground leading-relaxed">
                {appT("heroText")}
              </p>
              <div>
                <a
                  href="#rouwstukken"
                  className="inline-flex items-center text-primary hover:underline font-semibold text-lg"
                >
                  {appT("readMore")} →
                </a>
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

        {/* Two Column Layout */}
        <section className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Mourning Pieces Column */}
          <div id="rouwstukken" className="space-y-6 scroll-mt-20">
            <div className="sticky top-4">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-4 border-muted-foreground/30">
                {paragraphsT("mourning.mournPiecesTitle")}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("mourning.mournPiecesTitle1")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("mourning.mournPiecesDesc1")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("mourning.mournPiecesTitle2")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("mourning.mournPiecesDesc2")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("mourning.mournPiecesTitle3")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("mourning.mournPiecesDesc3")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("mourning.mournPiecesTitle4")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("mourning.mournPiecesDesc4")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("mourning.mournPiecesTitle5")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("mourning.mournPiecesDesc5")}
                </p>
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="w-full">
                  <LanguageAwareLink href="/products">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Bekijk Rouwstukken
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>

          {/* Wedding Bouquets Column */}
          <div className="space-y-6">
            <div className="sticky top-4">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-4 border-primary/50">
                {paragraphsT("wedding.weddingTitle")}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("wedding.weddingTitle1")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("wedding.weddingDesc1")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("wedding.weddingTitle2")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("wedding.weddingDesc2")}
                </p>
              </div>

              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  {paragraphsT("wedding.weddingSubheader")}
                </h3>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("wedding.weddingTitle3")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("wedding.weddingDesc3")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("wedding.weddingTitle4")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("wedding.weddingDesc4")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("wedding.weddingTitle5")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("wedding.weddingDesc5")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {paragraphsT("wedding.weddingTitle6")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {paragraphsT("wedding.weddingDesc6")}
                </p>
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="w-full">
                  <LanguageAwareLink href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Neem Contact Op
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Card with About and Contact */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-2xl p-8 shadow-xl border border-primary/20">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Info className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Meer Informatie</h2>
            </div>
            <p className="text-center text-muted-foreground mb-6 leading-relaxed">
              Wilt u meer weten over mij en mijn werkwijze, of heeft u vragen?
              Neem gerust contact op!
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild size="lg" variant="outline" className="w-full">
                <LanguageAwareLink href="/about">
                  <Heart className="mr-2 h-5 w-5" />
                  {navT("about")}
                </LanguageAwareLink>
              </Button>
              <Button asChild size="lg" className="w-full">
                <LanguageAwareLink href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  {navT("contact")}
                </LanguageAwareLink>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
