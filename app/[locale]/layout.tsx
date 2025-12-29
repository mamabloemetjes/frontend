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

  return {
    title: t("title"),
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background text-foreground",
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
