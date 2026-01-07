"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { getLanguageAwarePath } from "@/lib/languageUtils";

interface LanguageAwareLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export function LanguageAwareLink({
  href,
  children,
  className,
  ...rest
}: LanguageAwareLinkProps) {
  const pathname = usePathname();

  const languageAwareHref =
    typeof href === "string" ? getLanguageAwarePath(href, pathname) : href;

  return (
    <Link href={languageAwareHref} {...rest} className={className}>
      {children}
    </Link>
  );
}
