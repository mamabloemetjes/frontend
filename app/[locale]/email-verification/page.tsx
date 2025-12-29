"use client";

import { CheckSquare, XCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const EmailVerificationPage = () => {
  const t = useTranslations("auth.emailVerification");
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    // Show appropriate toast based on status
    if (status === "ok") {
      toast.success(t("successTitle"), {
        description: t("successDescription"),
        duration: 10000,
      });
    } else if (status === "err") {
      toast.error(t("failureTitle"), {
        description: t("failureDescription"),
        duration: 10000,
      });
    } else {
      // No status parameter
      toast.info(t("verificationInfo"), {
        description: t("verificationInfoDescription"),
        duration: 10000,
      });
    }

    // Redirect to login page on success, home page otherwise
    const timer = setTimeout(() => {
      if (status === "ok") {
        router.replace("/login");
      } else {
        router.replace("/");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [status, router, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          {status === "ok" ? (
            <CheckSquare className="w-16 h-16" />
          ) : status === "err" ? (
            <XCircle className="w-16 h-16" />
          ) : (
            <Clock className="w-16 h-16" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {status === "ok"
            ? t("successTitle")
            : status === "err"
              ? t("failureTitle")
              : t("verifying")}
        </h1>
        <p className="text-muted-foreground">
          {status === "ok" ? t("redirectingToLogin") : t("redirectingToHome")}
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
