import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import i18n from "@/i18n";

export function LanguageSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEN = location.pathname.startsWith("/en");
  const target = isEN
    ? location.pathname.replace(/^\/en/, "") || "/"
    : "/en" + location.pathname;

  const handleLanguageChange = () => {
    const newLang = isEN ? "nl" : "en";

    // Change the language in i18n
    i18n.changeLanguage(newLang);

    // Navigate to the new route
    navigate(target);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center gap-1 px-2 py-1 border border-border rounded hover:bg-muted transition-colors text-sm"
      aria-label={isEN ? "Switch to Dutch" : "Switch to English"}
    >
      <Globe className="w-4 h-4" />
      <span>{isEN ? "NL" : "EN"}</span>
    </button>
  );
}
