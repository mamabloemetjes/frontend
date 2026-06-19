"use server";

import { getTranslations } from "next-intl/server";
import { LanguageAwareLink } from "./LanguageAwareLink";
import Link from "next/link";

const Footer = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: "navigation.footer" });
  const tApp = await getTranslations({ locale, namespace: "app" });
  return (
    <footer className="mt-16 border-t-4 border-foreground bg-pastel-mint/15 dark:bg-pastel-mint/5">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌸</span>
              <span className="text-xl font-bold">Roos van Sharon</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tApp("description")}
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {tApp("madeBy")}{" "}
              <Link
                href="https://levinoppers.nl"
                className="text-pastel-rose underline hover:brightness-110 transition-all font-semibold"
              >
                Levi Noppers
              </Link>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Links
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <LanguageAwareLink
                href="/funeral-flowers"
                className="text-muted-foreground hover:text-pastel-rose transition-colors font-medium"
              >
                {t("rouwstukken")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/wedding-bouquets"
                className="text-muted-foreground hover:text-pastel-peach transition-colors font-medium"
              >
                {t("bruidsboeketten")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/birth-pieces"
                className="text-muted-foreground hover:text-pastel-lavender transition-colors font-medium"
              >
                {t("geboortestukken")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/workshops"
                className="text-muted-foreground hover:text-pastel-sage transition-colors font-medium"
              >
                {t("workshops")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/about"
                className="text-muted-foreground hover:text-pastel-peach transition-colors font-medium"
              >
                {t("about")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/contact"
                className="text-muted-foreground hover:text-pastel-mint transition-colors font-medium"
              >
                {t("contact")}
              </LanguageAwareLink>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              {t("legal")}
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <LanguageAwareLink
                href="/privacy"
                className="text-muted-foreground hover:text-pastel-sage transition-colors font-medium"
              >
                {t("privacyPolicy")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/terms"
                className="text-muted-foreground hover:text-pastel-lavender transition-colors font-medium"
              >
                {t("termsOfService")}
              </LanguageAwareLink>
            </nav>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              {t("support")}
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <LanguageAwareLink
                href="/contact"
                className="text-muted-foreground hover:text-pastel-rose transition-colors font-medium"
              >
                {t("contactSupport")}
              </LanguageAwareLink>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t-2 border-foreground/30 text-center text-sm text-muted-foreground font-medium">
          <p>
            &copy; {new Date().getFullYear()} Roos van Sharon.{" "}
            {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
