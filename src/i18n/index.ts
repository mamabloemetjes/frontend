import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nl from "@/i18n/nl.json";
import en from "@/i18n/en.json";

i18n.use(initReactI18next).init({
  resources: {
    nl: { translation: nl },
    en: { translation: en },
  },
  lng: "nl",
  fallbackLng: "nl",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
