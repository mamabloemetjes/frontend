import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import i18n from "@/i18n";

export function LanguageSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEN = location.pathname.startsWith("/en");
  const currentLang: "en" | "nl" = isEN ? "en" : "nl";

  const setLanguage = (lang: "en" | "nl") => {
    if (lang === currentLang) return;

    i18n.changeLanguage(lang);

    let pathname = location.pathname;

    // Remove /en if present
    pathname = pathname.replace(/^\/en/, "") || "/";

    const target =
      lang === "en" ? `/en${pathname === "/" ? "" : pathname}` : pathname;

    navigate(target);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-16 flex items-center justify-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentLang.toUpperCase()}
          </span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("nl")}>
          🇳🇱 Nederlands
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
