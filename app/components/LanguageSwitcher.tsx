"use client";

import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const LANGUAGES = ["nl", "en"] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLanguage = useMemo<"en" | "nl">(
    () => (pathname.startsWith("/en") ? "en" : "nl"),
    [pathname],
  );

  const switchLanguage = (lang: "en" | "nl") => {
    const segments = pathname.split("/");

    if (LANGUAGES.includes(segments[1] as (typeof LANGUAGES)[number])) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }

    router.push(segments.join("/"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-16 gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguage.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("nl")}>
          🇳🇱 Nederlands
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("en")}>
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
