import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import i18n from "@/i18n";

type Lang = "nl" | "en";

export default function LanguageRoute({ lang }: { lang: Lang }) {
  useEffect(() => {
    // Only change language if it's different from current
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang]);

  return <Outlet />;
}
