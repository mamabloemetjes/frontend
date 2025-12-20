import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nl from "@/i18n/nl.json";
import en from "@/i18n/en.json";

// Function to get the initial language from localStorage or route
const getInitialLanguage = (): string => {
  // Check if we're on an English route
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/en")
  ) {
    return "en";
  }

  // Check localStorage for saved preference
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang && (savedLang === "en" || savedLang === "nl")) {
      return savedLang;
    }
  }

  // Default to Dutch
  return "nl";
};

const initialLanguage = getInitialLanguage();

// Initialize i18n with translations
i18n.use(initReactI18next).init({
  fallbackLng: "nl",
  lng: initialLanguage,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
    nl: { translation: nl },
  },
});

// Save language preference when it changes
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("i18nextLng", lng);
  }
});

export default i18n;
