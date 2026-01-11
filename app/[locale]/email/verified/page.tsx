"use client";

import { CheckSquare, XCircle, Clock, Mail } from "lucide-react";
import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useResendVerification } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function EmailVerificationContent() {
  const t = useTranslations("auth.emailVerification");
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [email, setEmail] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);
  const resendVerification = useResendVerification();

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
  }, [status, t]);

  const handleResendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      resendVerification.mutate(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-4 flex justify-center">
          {status === "ok" ? (
            <CheckSquare className="w-16 h-16 text-green-500" />
          ) : status === "err" ? (
            <XCircle className="w-16 h-16 text-red-500" />
          ) : (
            <Clock className="w-16 h-16 text-blue-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {status === "ok"
            ? t("successTitle")
            : status === "err"
              ? t("failureTitle")
              : t("verifying")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {status === "ok"
            ? t("successDescription")
            : status === "err"
              ? t("failureDescription")
              : t("verificationInfoDescription")}
        </p>

        {/* Show navigation button on success */}
        {status === "ok" && (
          <Button onClick={() => router.push("/login")} className="gap-2">
            {t("goToLogin")}
          </Button>
        )}

        {/* Show home button on unknown status */}
        {!status && (
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="gap-2"
          >
            {t("goToHome")}
          </Button>
        )}

        {/* Show resend button only on failure */}
        {status === "err" && (
          <div className="mt-6">
            {!showResendForm ? (
              <Button
                onClick={() => setShowResendForm(true)}
                variant="outline"
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                {t("resendEmail")}
              </Button>
            ) : (
              <form onSubmit={handleResendEmail} className="space-y-4">
                <div className="text-left">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("enterEmailPrompt")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    required
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={resendVerification.isPending || !email}
                    className="flex-1"
                  >
                    {resendVerification.isPending
                      ? t("resendingEmail")
                      : t("resendEmail")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowResendForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const EmailVerificationPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
};

export default EmailVerificationPage;
