"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const t = useTranslations("auth.login");
  const navigate = useRouter();
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
      navigate.push(currentLanguage === "en" ? "/en" : "/");
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
        toast.error(t("emailNotVerified"), {
          description: t("verifyEmailDescription"),
          duration: 10000,
        });
      }
      // Other errors will be handled by the mutation error handler
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold mb-2">🌸 Mama Bloemetjes</h1>
          <p className="text-muted-foreground">{t("title")}</p>
        </div>

        <div className="border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-2">
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>

            <Button className="w-full" type="submit" disabled={login.isPending}>
              {login.isPending ? t("signingIn") : t("signIn")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Label className="text-sm text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <LanguageAwareLink
                href="/register"
                className="text-primary hover:underline"
              >
                {t("signUp")}
              </LanguageAwareLink>
            </Label>
          </div>

          <div className="mt-4 text-center">
            <LanguageAwareLink
              href="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              {t("backToHome")}
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
