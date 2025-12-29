"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useAuth";
import type { RegisterData } from "@/types/auth";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useTranslations } from "next-intl";

const RegisterPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const register = useRegister();
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      return;
    }

    try {
      await register.mutateAsync(formData);
      // Success message is shown by the useRegister hook
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Give time for user to see the success toast
    } catch (error) {
      // Error will be handled by the mutation error handler
      console.error("Registration failed:", error);
    }
  };

  const passwordsMatch =
    formData.password === confirmPassword || confirmPassword === "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🌸 Mama Bloemetjes</h1>
          <p className="text-muted-foreground">{t("auth.register.title")}</p>
        </div>

        <div className="border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                {t("auth.register.username")}
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t("auth.register.email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
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
                {t("auth.register.password")}
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("auth.register.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
              {!passwordsMatch && (
                <p className="text-sm text-destructive mt-1">
                  {t("auth.register.passwordsDoNotMatch")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={register.isPending || !passwordsMatch}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {register.isPending
                ? t("auth.register.creatingAccount")
                : t("auth.register.signUp")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("auth.register.alreadyHaveAccount")}{" "}
              <LanguageAwareLink
                href="/login"
                className="text-primary hover:underline"
              >
                {t("auth.register.signIn")}
              </LanguageAwareLink>
            </p>
          </div>

          <div className="mt-4 text-center">
            <LanguageAwareLink
              href="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              {t("auth.register.backToHome")}
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
