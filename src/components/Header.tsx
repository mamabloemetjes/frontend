import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { LanguageAwareLink } from "./LanguageAwareLink";
import { useTranslation } from "react-i18next";
import { cartCountAtom } from "@/store/cart";
import { useAuthStatus, useLogout } from "@/hooks/useAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const [cartCount] = useAtom(cartCountAtom);
  const { user, isAuthenticated } = useAuthStatus();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          🌸 Mama Bloemetjes
        </Link>
        <nav className="flex items-center gap-6">
          <LanguageAwareLink to="/products" className="hover:underline">
            {t("navigation.products")}
          </LanguageAwareLink>
          <LanguageAwareLink to="/cart" className="relative hover:underline">
            {t("navigation.cart")}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </LanguageAwareLink>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="hover:underline"
                disabled={logout.isPending}
              >
                {logout.isPending ? t("auth.loggingOut") : t("auth.logout")}
              </button>
            </>
          ) : (
            <>
              <LanguageAwareLink to="/login" className="hover:underline">
                {t("navigation.login")}
              </LanguageAwareLink>
              <LanguageAwareLink to="/register" className="hover:underline">
                {t("navigation.signUp")}
              </LanguageAwareLink>
            </>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <LanguageAwareLink to="/dashboard" className="hover:underline">
              {t("navigation.dashboard")}
            </LanguageAwareLink>
          )}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
