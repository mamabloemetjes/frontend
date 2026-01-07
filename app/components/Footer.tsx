"use server";

import { getTranslations } from "next-intl/server";
import { LanguageAwareLink } from "./LanguageAwareLink";

const Footer = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: "navigation.footer" });
  return (
    <footer className="mt-16 border-t bg-muted/30 dark:bg-muted/10">
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
              Handgemaakte vilt bloemen voor bijzondere momenten in uw leven.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Links
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <LanguageAwareLink
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("aboutUs")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("contact")}
              </LanguageAwareLink>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Juridisch
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <LanguageAwareLink
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("privacyPolicy")}
              </LanguageAwareLink>
              <LanguageAwareLink
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("termsOfService")}
              </LanguageAwareLink>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
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
