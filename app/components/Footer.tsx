"use server";

import { getTranslations } from "next-intl/server";
import { LanguageAwareLink } from "./LanguageAwareLink";

const Footer = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: "navigation.footer" });
  return (
    <footer className="z-50 backdrop-blur-xl bg-popover/20 border-b border-border/40 shadow-2xl p-4 mt-4">
      <div className="container mx-auto text-center text-secondary-foreground space-y-2">
        <p>
          &copy; {new Date().getFullYear()} Mama Bloemetjes.{" "}
          {t("allRightsReserved")}
        </p>
        <p>
          <LanguageAwareLink href="/privacy" className="underline">
            {t("privacyPolicy")}
          </LanguageAwareLink>{" "}
          |{" "}
          <LanguageAwareLink href="/terms" className="underline">
            {t("termsOfService")}
          </LanguageAwareLink>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
