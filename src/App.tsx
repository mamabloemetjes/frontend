import { Routes, Route } from "react-router-dom";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useTranslation } from "react-i18next";
import {
  DashboardPage,
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
} from "@/pages";
import { AdminRoute } from "@/components/ProtectedRoute";
import { TokenRefreshHandler } from "@/components/TokenRefreshHandler";
import { useCSRF } from "@/hooks/useCSRF";
import { Toaster } from "@/components/ui/sonner";
import LanguageRoute from "@/LanguageRoute";
import { useDocumentTitle } from "@/i18n/documentTitle";
import FeatureRoute from "@/components/FeatureRoute";
import { Header } from "@/components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/Contact";

function App() {
  // Initialize CSRF token on app startup
  useCSRF();

  // Document title
  useDocumentTitle();

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <TokenRefreshHandler />
      <Header />
      <Routes>
        <Route element={<LanguageRoute lang="nl" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="login"
            element={
              <FeatureRoute type="login">
                <LoginPage />
              </FeatureRoute>
            }
          />
          <Route
            path="register"
            element={
              <FeatureRoute type="register">
                <RegisterPage />
              </FeatureRoute>
            }
          />
          <Route
            path="email-verification"
            element={<EmailVerificationPage />}
          />
          <Route path="email-verified" element={<EmailVerificationPage />} />
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/en" element={<LanguageRoute lang="en" />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="login"
            element={
              <FeatureRoute type="login">
                <LoginPage />
              </FeatureRoute>
            }
          />
          <Route
            path="register"
            element={
              <FeatureRoute type="register">
                <RegisterPage />
              </FeatureRoute>
            }
          />
          <Route
            path="email-verification"
            element={<EmailVerificationPage />}
          />
          <Route path="email-verified" element={<EmailVerificationPage />} />
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">{t("pages.404.title")}</h1>
      <p className="text-muted-foreground mb-8">{t("pages.404.description")}</p>
      <LanguageAwareLink
        to="/"
        className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors"
      >
        {t("pages.404.goToHome")}
      </LanguageAwareLink>
    </div>
  );
}

export default App;
