"use client";

import { useAtom } from "jotai";
import { LanguageAwareLink } from "./LanguageAwareLink";
import { cartCountAtom } from "@/store/cart";
import { useAuthStatus, useLogout } from "@/hooks/useAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ModeToggle } from "@/components/ThemeToggle";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Menu,
  X,
  IdCardIcon,
  Mail,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import FeatureComponent from "./FeatureComponent";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { showApiError } from "@/lib/apiToast";

export default function Header() {
  const t = useTranslations();
  const tApp = useTranslations("app");
  const [cartCount] = useAtom(cartCountAtom);
  const { user, isAuthenticated } = useAuthStatus();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      showApiError(error, t, "auth.logoutError");
    }
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinkClass =
    "flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-foreground/30 transition-colors duration-150";

  const mobileNavLinkClass =
    "flex items-center justify-between px-6 py-4 border-b border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 group";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <LanguageAwareLink
              href="/"
              className="flex items-center gap-3 group"
            >
              <span className="text-2xl lg:text-3xl inline-block">🌸</span>
              <span className="text-lg lg:text-xl font-semibold tracking-tight text-foreground">
                {tApp("title")}
              </span>
            </LanguageAwareLink>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center h-full">
              <LanguageAwareLink href="/products" className={navLinkClass}>
                <Package className="w-4 h-4" />
                {t("navigation.products")}
              </LanguageAwareLink>

              <LanguageAwareLink
                href="/cart"
                className={`${navLinkClass} relative`}
              >
                <ShoppingCart className="w-4 h-4" />
                {t("navigation.cart")}
                {cartCount > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs font-semibold px-1.5 py-0.5 leading-none">
                    {cartCount}
                  </span>
                )}
              </LanguageAwareLink>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={navLinkClass}>
                      <User className="w-4 h-4" />
                      {t("navigation.account")}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <LanguageAwareLink
                        href="/account"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        {t("navigation.account")}
                      </LanguageAwareLink>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <LanguageAwareLink
                          href="/dashboard"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t("navigation.dashboard")}
                        </LanguageAwareLink>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <LanguageAwareLink
                        href="/contact"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        {t("navigation.contact")}
                      </LanguageAwareLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {logout.isPending
                        ? t("auth.loggingOut")
                        : t("auth.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <FeatureComponent type="login">
                  <LanguageAwareLink
                    href="/login"
                    className="ml-2 flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all duration-150"
                  >
                    <User className="w-4 h-4" />
                    {t("navigation.login")}
                  </LanguageAwareLink>
                </FeatureComponent>
              )}

              <div className="flex items-center gap-1 ml-4 pl-4 border-l border-border h-8">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1 lg:hidden">
              <LanguageAwareLink
                href="/cart"
                className="relative p-3 hover:bg-accent transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-xs font-semibold w-4 h-4 flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </LanguageAwareLink>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 z-50 w-full max-w-sm bg-background border-l border-border lg:hidden transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Primary Nav — tile grid */}
          <div className="border-b border-border">
            {[
              { href: "/", label: t("navigation.home"), icon: Home },
              {
                href: "/products",
                label: t("navigation.products"),
                icon: Package,
              },
              {
                href: "/about",
                label: t("navigation.about"),
                icon: IdCardIcon,
              },
              { href: "/contact", label: t("navigation.contact"), icon: Mail },
            ].map(({ href, label, icon: Icon }) => (
              <LanguageAwareLink
                key={href}
                href={href}
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
                  <span className="font-medium">{label}</span>
                </div>
                <span className="text-muted-foreground group-hover:text-accent-foreground text-lg leading-none">
                  →
                </span>
              </LanguageAwareLink>
            ))}
          </div>

          {/* Account section */}
          <div className="border-b border-border">
            <div className="px-6 py-3 text-xs font-medium tracking-widest uppercase text-muted-foreground bg-muted/40">
              {t("navigation.account")}
            </div>

            {isAuthenticated ? (
              <>
                <LanguageAwareLink
                  href="/account"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
                    <span className="font-medium">
                      {t("navigation.account")}
                    </span>
                  </div>
                  <span className="text-muted-foreground group-hover:text-accent-foreground text-lg leading-none">
                    →
                  </span>
                </LanguageAwareLink>

                {user?.role === "admin" && (
                  <LanguageAwareLink
                    href="/dashboard"
                    className={mobileNavLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
                      <span className="font-medium">
                        {t("navigation.dashboard")}
                      </span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-accent-foreground text-lg leading-none">
                      →
                    </span>
                  </LanguageAwareLink>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  disabled={logout.isPending}
                  className="w-full flex items-center gap-3 px-6 py-4 border-b border-border text-destructive hover:bg-destructive/10 transition-colors duration-150 disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">
                    {logout.isPending ? t("auth.loggingOut") : t("auth.logout")}
                  </span>
                </button>
              </>
            ) : (
              <FeatureComponent type="login">
                <LanguageAwareLink
                  href="/login"
                  className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all duration-150 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <span>{t("navigation.login")}</span>
                  </div>
                  <span className="text-lg leading-none">→</span>
                </LanguageAwareLink>
              </FeatureComponent>
            )}
          </div>

          {/* Settings */}
          <div className="mt-auto">
            <div className="px-6 py-3 text-xs font-medium tracking-widest uppercase text-muted-foreground bg-muted/40 border-t border-b border-border">
              {t("navigation.settings")}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">
                {t("navigation.language")}
              </span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm font-medium text-muted-foreground">
                {t("navigation.theme")}
              </span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
