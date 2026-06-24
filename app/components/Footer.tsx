"use server";

import { getTranslations } from "next-intl/server";
import { LanguageAwareLink } from "./LanguageAwareLink";
import Link from "next/link";

const Footer = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: "navigation.footer" });
  const tApp = await getTranslations({ locale, namespace: "app" });

  return (
    <footer className="mt-24 border-t border-border bg-muted/20">
      {/* Main grid — hairline-separated columns */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Brand */}
          <div className="py-12 md:pr-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌸</span>
              <span className="text font-semibold tracking-tight text-foreground">
                Roos van Sharon
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tApp("description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {tApp("madeBy")}{" "}
              <Link
                href="https://levinoppers.nl"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Levi Noppers
              </Link>
            </p>
          </div>

          {/* Quick Links */}
          <div className="py-12 md:px-10 space-y-5">
            <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Links
            </h3>
            <nav className="flex flex-col space-y-3 text-sm">
              {[
                { href: "/funeral-flowers", label: t("rouwstukken") },
                { href: "/wedding-bouquets", label: t("bruidsboeketten") },
                { href: "/birth-pieces", label: t("geboortestukken") },
                { href: "/flowers", label: t("bloemen") },
                { href: "/workshops", label: t("workshops") },
                { href: "/about", label: t("about") },
                { href: "/contact", label: t("contact") },
              ].map(({ href, label }) => (
                <LanguageAwareLink
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  {label}
                </LanguageAwareLink>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="py-12 md:px-10 space-y-5">
            <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              {t("legal")}
            </h3>
            <nav className="flex flex-col space-y-3 text-sm">
              {[
                { href: "/privacy", label: t("privacyPolicy") },
                { href: "/terms", label: t("termsOfService") },
              ].map(({ href, label }) => (
                <LanguageAwareLink
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  {label}
                </LanguageAwareLink>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="py-12 md:pl-10 space-y-5">
            <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              {t("support")}
            </h3>
            <nav className="flex flex-col space-y-3 text-sm">
              <LanguageAwareLink
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
                {t("contactSupport")}
              </LanguageAwareLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Roos van Sharon.{" "}
            {t("allRightsReserved")}
          </p>
          <p>
            {tApp("madeBy")}{" "}
            <Link
              href="https://levinoppers.nl"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Levi Noppers
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
