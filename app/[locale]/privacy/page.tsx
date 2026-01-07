"use server";

import { Props } from "@/types";
import { getTranslations } from "next-intl/server";
import { Shield, Database, Lock, UserCheck, Clock, Mail } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.privacy" });
  const common = await getTranslations({ locale, namespace: "seo.common" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://roosvansharon.nl";
  const pageUrl = `${baseUrl}/${locale}/privacy`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
      languages: {
        nl: `${baseUrl}/nl/privacy`,
        en: `${baseUrl}/en/privacy`,
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

const PrivacyPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Shield className="w-10 h-10 text-primary" />
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

        {/* Data Collection */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Database className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">
              {t("dataCollectionTitle")}
            </h2>
          </div>
          <p className="mb-4">{t("dataCollectionDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("dataCollectionList1")}</li>
            <li>{t("dataCollectionList2")}</li>
            <li>{t("dataCollectionList3")}</li>
            <li>{t("dataCollectionList4")}</li>
          </ul>
        </section>

        {/* Data Usage */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <UserCheck className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("dataUsageTitle")}</h2>
          </div>
          <p className="mb-4">{t("dataUsageDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("dataUsageList1")}</li>
            <li>{t("dataUsageList2")}</li>
            <li>{t("dataUsageList3")}</li>
            <li>{t("dataUsageList4")}</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Lock className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("dataSecurityTitle")}</h2>
          </div>
          <p className="mb-4">{t("dataSecurityDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("dataSecurityList1")}</li>
            <li>{t("dataSecurityList2")}</li>
            <li>{t("dataSecurityList3")}</li>
            <li>{t("dataSecurityList4")}</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">
              {t("dataRetentionTitle")}
            </h2>
          </div>
          <p>{t("dataRetentionDesc")}</p>
        </section>

        {/* Your Rights */}
        <section className="bg-card/20 dark:bg-card/10 rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-8 h-8 shrink-0 text-primary mt-1" />
            <h2 className="text-2xl font-bold m-0">{t("yourRightsTitle")}</h2>
          </div>
          <p className="mb-4">{t("yourRightsDesc")}</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>{t("yourRightsList1")}</li>
            <li>{t("yourRightsList2")}</li>
            <li>{t("yourRightsList3")}</li>
            <li>{t("yourRightsList4")}</li>
          </ul>
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

export default PrivacyPage;
