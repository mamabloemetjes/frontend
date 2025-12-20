import { useEffect } from "react";
import i18n from "@/i18n";

export function useDocumentTitle() {
  useEffect(() => {
    const title =
      i18n.language === "en"
        ? "Mama Bloemetjes - Eternal Beauty"
        : "Mama Bloemetjes - Eeuwige schoonheid";

    document.title = title;
  }, []);
}
