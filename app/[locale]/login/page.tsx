"use client";

import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validation/schemas";
import { env } from "@/lib/env";
import { FeatureRoute } from "@/components";

const LoginPage = () => {
  const t = useTranslations("auth.login");
  const navigate = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    await login.mutateAsync(data);

    // Redirect to the language-aware home page
    const currentLanguage = window.location.pathname.startsWith("/en")
      ? "en"
      : "nl";
    navigate.push(currentLanguage === "en" ? "/en" : "/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold mb-2">🌸 Roos van Sharon</h1>
          <p className="text-muted-foreground">{t("title")}</p>
        </div>

        <div className="border rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label={t("email")}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <FormInput
              label={t("password")}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting || login.isPending}
            >
              {isSubmitting || login.isPending ? t("signingIn") : t("signIn")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {env.features.enableRegister && (
              <p className="text-sm text-muted-foreground">
                {t("dontHaveAccount")}{" "}
                <LanguageAwareLink
                  href="/register"
                  className="text-primary hover:underline"
                >
                  {t("signUp")}
                </LanguageAwareLink>
              </p>
            )}
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

const LoginPageWrapper = () => {
  return (
    <FeatureRoute type="login">
      <LoginPage />
    </FeatureRoute>
  );
};

export default LoginPageWrapper;
