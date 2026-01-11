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
} from "lucide-react";
import { useState } from "react";
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

  return (
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageAwareLink href="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </LanguageAwareLink>
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            <LanguageAwareLink
              href="/products"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Package className="w-5 h-5" />
              <span>{t("navigation.products")}</span>
            </LanguageAwareLink>

            <LanguageAwareLink
              href="/about"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <IdCardIcon className="w-5 h-5" />
              <span>{t("navigation.about")}</span>
            </LanguageAwareLink>

            <LanguageAwareLink
              href="/contact"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="w-5 h-5" />
              <span>{t("navigation.contact")}</span>
            </LanguageAwareLink>

            {/* Separator */}
            <Separator />

            {isAuthenticated ? (
              <>
                <LanguageAwareLink
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>{t("navigation.account")}</span>
                </LanguageAwareLink>

                {user?.role === "admin" && (
                  <LanguageAwareLink
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{t("navigation.dashboard")}</span>
                  </LanguageAwareLink>
                )}

                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  disabled={logout.isPending}
                  variant="ghost"
                  className="justify-start w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>
                    {logout.isPending ? t("auth.loggingOut") : t("auth.logout")}
                  </span>
                </Button>
              </>
            ) : (
              <LanguageAwareLink
                href="/login"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>{t("navigation.login")}</span>
              </LanguageAwareLink>
            )}

            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/40 mt-2 pt-4">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
