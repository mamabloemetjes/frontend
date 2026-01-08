"use server";

import { Props } from "@/types";
import { getTranslations } from "next-intl/server";
import {
  FileText,
  ShoppingCart,
  Palette,
  CreditCard,
  Truck,
  UserCog,
  User,
  Mail,
  Copyright,
  Shield,
} from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.terms" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/terms`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/terms`,
        en: `${baseUrl}/en/terms`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: common("siteName"),
      locale: common("locale"),
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const TermsPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <FileText className="w-10 h-10 text-primary" />
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("lastUpdated")}: {new Date().toLocaleDateString(locale)}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        {/* Introduction */}
        <section className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20">
          <p className="text-lg leading-relaxed m-0">{t("intro")}</p>
        </section>

        {/* About Our Services */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Palette className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("aboutTitle")}</h2>
          </div>
          <p>{t("aboutDesc")}</p>
        </section>

        {/* Ordering */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <ShoppingCart className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("orderingTitle")}</h2>
          </div>
          <p className="mb-4">{t("orderingDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("orderingList1")}</li>
            <li>{t("orderingList2")}</li>
            <li>{t("orderingList3")}</li>
            <li>{t("orderingList4")}</li>
          </ul>
        </section>

        {/* Custom Work */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Palette className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("customWorkTitle")}</h2>
          </div>
          <p>{t("customWorkDesc")}</p>
        </section>

        {/* Payment */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("paymentTitle")}</h2>
          </div>
          <p>{t("paymentDesc")}</p>
        </section>

        {/* Delivery */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Truck className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("deliveryTitle")}</h2>
          </div>
          <p>{t("deliveryDesc")}</p>
        </section>

        {/* Accounts */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <UserCog className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("accountsTitle")}</h2>
          </div>
          <p className="mb-4">{t("accountsDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("accountsList1")}</li>
            <li>{t("accountsList2")}</li>
            <li>{t("accountsList3")}</li>
            <li>{t("accountsList4")}</li>
          </ul>
        </section>

        {/* Your Responsibilities */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <User className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">
              {t("responsibilityTitle")}
            </h2>
          </div>
          <p className="mb-4">{t("responsibilityDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("responsibilityList1")}</li>
            <li>{t("responsibilityList2")}</li>
            <li>{t("responsibilityList3")}</li>
          </ul>
        </section>

        {/* Copyright and Intellectual Property */}
        <section className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3 mb-4">
            <Copyright className="w-8 h-8 shrink-0 text-amber-600 dark:text-amber-400 mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("copyrightTitle")}</h2>
          </div>
          <p className="mb-4">{t("copyrightDesc")}</p>
          <ul className="space-y-2 list-disc list-inside mb-4">
            <li>{t("copyrightList1")}</li>
            <li>{t("copyrightList2")}</li>
            <li>{t("copyrightList3")}</li>
            <li>{t("copyrightList4")}</li>
            <li>{t("copyrightList5")}</li>
          </ul>
          <p className="mb-4 font-semibold">{t("copyrightProtection")}</p>
          <ul className="space-y-2 list-disc list-inside mb-4">
            <li>{t("copyrightProhibit1")}</li>
            <li>{t("copyrightProhibit2")}</li>
            <li>{t("copyrightProhibit3")}</li>
            <li>{t("copyrightProhibit4")}</li>
          </ul>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
              <p className="text-sm m-0">{t("copyrightPersonalUse")}</p>
            </div>
          </div>
        </section>

        {/* Changes */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("changesTitle")}</h2>
          </div>
          <p>{t("changesDesc")}</p>
        </section>

        {/* Contact */}
        <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-6 border border-muted-foreground/20">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("contactTitle")}</h2>
          </div>
          <p>{t("contactDesc")}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
