import { Link, type LinkProps } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getLanguageAwarePath } from "@/lib/languageUtils";

export function LanguageAwareLink(props: LinkProps) {
  const location = useLocation();
  const { to, ...rest } = props;

  // Convert string 'to' to language-aware path
  const languageAwareTo =
    typeof to === "string" ? getLanguageAwarePath(to, location.pathname) : to;

  return <Link to={languageAwareTo} {...rest} />;
}
