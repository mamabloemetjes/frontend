import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "../../app/i18n/config";
import { Inter } from "next/font/google";
import "../globals.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Providers } from "@/providers";
import { cn } from "@/lib/utils";
import { Footer, Header } from "@/components";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createLocalBusinessSchema } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Unwrap params if it's a promise
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "app" });
  const seo = await getTranslations({ locale, namespace: "seo.home" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    keywords: seo("keywords"),
    authors: [{ name: "Francis van Wieringen" }],
    creator: "Francis van Wieringen",
    publisher: "Roos van Sharon",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${baseUrl}/flower.webp`,
          width: 1371,
          height: 1600,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/favicon.ico`],
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
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locale) {
    notFound();
  }
  // Enable static rendering
  setRequestLocale(locale);
  let messages;
  try {
    messages = (await import(`@/i18n/${locale}.json`)).default;
  } catch (error) {
    console.error(error);
  }

  // Organization structured data
  const organizationSchema = createLocalBusinessSchema(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background text-foreground",
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <Breadcrumbs />
            <main className="min-h-screen">{children}</main>
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
