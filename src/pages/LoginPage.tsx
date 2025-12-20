import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth";
import { toast } from "sonner";
import i18n from "@/i18n";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login.mutateAsync(credentials);
      // Redirect to the language-aware home page
      const currentLanguage = window.location.pathname.startsWith("/en")
        ? "en"
        : "nl";
      navigate(currentLanguage === "en" ? "/en" : "/");
    } catch (error: unknown) {
      // Check if the error is about email verification
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string" &&
        error.response.data.message.includes("verify your email")
      ) {
        toast.error(i18n.t("auth.login.emailNotVerified"), {
          description: i18n.t("auth.login.verifyEmailDescription"),
          duration: 10000,
        });
      }
      // Other errors will be handled by the mutation error handler
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🌸 Mama Bloemetjes</h1>
          <p className="text-muted-foreground">{i18n.t("auth.login.title")}</p>
        </div>

        <div className="border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {i18n.t("auth.login.email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                {i18n.t("auth.login.password")}
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending
                ? i18n.t("auth.login.signingIn")
                : i18n.t("auth.login.signIn")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {i18n.t("auth.login.dontHaveAccount")}{" "}
              <LanguageAwareLink
                to="/register"
                className="text-primary hover:underline"
              >
                {i18n.t("auth.login.signUp")}
              </LanguageAwareLink>
            </p>
          </div>

          <div className="mt-4 text-center">
            <LanguageAwareLink
              to="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              {i18n.t("auth.login.backToHome")}
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </div>
  );
}
