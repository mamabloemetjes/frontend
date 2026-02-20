"use server";

import FlowerTypePage from "@/components/flowerType/page";
import { Props } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.geboortestukken" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/birth-pieces/shop`;

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
        nl: `${baseUrl}/nl/birth-pieces/shop`,
        en: `${baseUrl}/en/birth-pieces/shop`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: common("siteName"),
      locale: locale === "nl" ? "nl_NL" : "en_US",
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
      creator: "@roosvansharon",
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
    category: "birth flowers",
  };
}

const BirthPiecesProductsPage = async ({ params }: Props) => {
  const { locale } = await params;
  return <FlowerTypePage type="birth" locale={locale} />;
};

export default BirthPiecesProductsPage;
