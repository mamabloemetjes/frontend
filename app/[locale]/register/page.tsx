"use client";

import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useAuth";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validation/schemas";
import { showSuccess, handleApiError } from "@/lib/validation/utils";

const RegisterPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Remove confirmPassword before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;

      await register.mutateAsync(registerData);

      showSuccess(
        t("auth.register.success"),
        t("auth.register.successDescription"),
      );

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      handleApiError(error, t("auth.register.failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🌸 Mama Bloemetjes</h1>
          <p className="text-muted-foreground">{t("auth.register.title")}</p>
        </div>

        <div className="border rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label={t("auth.register.username")}
              type="text"
              placeholder="johndoe"
              error={errors.username?.message}
              required
              {...registerField("username")}
            />

            <FormInput
              label={t("auth.register.email")}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...registerField("email")}
            />

            <FormInput
              label={t("auth.register.password")}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText={t("auth.register.passwordHelper")}
              required
              {...registerField("password")}
            />

            <FormInput
              label={t("auth.register.confirmPassword")}
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              required
              {...registerField("confirmPassword")}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || register.isPending}
            >
              {isSubmitting || register.isPending
                ? t("auth.register.creatingAccount")
                : t("auth.register.signUp")}
            </Button>
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
