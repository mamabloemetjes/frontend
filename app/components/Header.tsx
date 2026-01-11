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
import { Separator } from "./ui/separator";

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <LanguageAwareLink href="/" className="flex items-center gap-3">
              <span className="text-3xl lg:text-4xl inline-block">🌸</span>
              <span className="text-xl lg:text-2xl font-bold">
                {tApp("title")}
              </span>
            </LanguageAwareLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <LanguageAwareLink
                href="/products"
                className="px-4 py-2 rounded-lg hover:bg-accent transition-all duration-200 flex items-center gap-2 group"
              >
                <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t("navigation.products")}</span>
              </LanguageAwareLink>

              <LanguageAwareLink
                href="/cart"
                className="px-4 py-2 rounded-lg hover:bg-accent transition-all duration-200 flex items-center gap-2 relative group"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>{t("navigation.cart")}</span>
              </LanguageAwareLink>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-4 py-2 rounded-lg hover:bg-accent transition-all duration-200 flex items-center gap-2 group"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <LanguageAwareLink
                        href="/account"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span>{t("navigation.account")}</span>
                      </LanguageAwareLink>
                    </DropdownMenuItem>

                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <LanguageAwareLink
                          href="/dashboard"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>{t("navigation.dashboard")}</span>
                        </LanguageAwareLink>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                      <LanguageAwareLink
                        href="/contact"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{t("navigation.contact")}</span>
                      </LanguageAwareLink>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>
                        {logout.isPending
                          ? t("auth.loggingOut")
                          : t("auth.logout")}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <FeatureComponent type="login">
                  <LanguageAwareLink
                    href="/login"
                    className="px-4 py-2 rounded-lg hover:bg-accent flex items-center gap-2 group bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all duration-200"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{t("navigation.login")}</span>
                  </LanguageAwareLink>
                </FeatureComponent>
              )}

              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageAwareLink
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-accent transition-all duration-200 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </LanguageAwareLink>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-accent rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 z-50 w-full max-w-sm bg-background border-l border-border shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6 space-y-1">
            {/* Primary Navigation */}
            <div className="space-y-1 mb-6">
              <LanguageAwareLink
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t("navigation.home")}</span>
              </LanguageAwareLink>

              <LanguageAwareLink
                href="/products"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t("navigation.products")}</span>
              </LanguageAwareLink>

              <LanguageAwareLink
                href="/about"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <IdCardIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t("navigation.about")}</span>
              </LanguageAwareLink>

              <LanguageAwareLink
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t("navigation.contact")}</span>
              </LanguageAwareLink>
            </div>

            <Separator className="my-6" />

            {/* User Section */}
            <div className="space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {t("navigation.account")}
                  </div>

                  <LanguageAwareLink
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {t("navigation.account")}
                    </span>
                  </LanguageAwareLink>

                  {user?.role === "admin" && (
                    <LanguageAwareLink
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">
                        {t("navigation.dashboard")}
                      </span>
                    </LanguageAwareLink>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    disabled={logout.isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 active:bg-destructive/20 transition-all duration-200 group text-destructive disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {logout.isPending
                        ? t("auth.loggingOut")
                        : t("auth.logout")}
                    </span>
                  </button>
                </>
              ) : (
                <FeatureComponent type="login">
                  <LanguageAwareLink
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 active:brightness-95 transition-all duration-200 shadow-lg hover:shadow-xl group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{t("navigation.login")}</span>
                  </LanguageAwareLink>
                </FeatureComponent>
              )}
            </div>

            <Separator className="my-6" />

            {/* Settings Section */}
            <div className="space-y-4">
              <div className="px-4 py-2 text-sm text-muted-foreground">
                {t("navigation.settings")}
              </div>
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium">
                  {t("navigation.language")}
                </span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium">
                  {t("navigation.theme")}
                </span>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
