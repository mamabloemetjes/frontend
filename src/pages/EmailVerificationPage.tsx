import { CheckSquare, XCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import i18n from "@/i18n";

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    // Show appropriate toast based on status
    if (status === "ok") {
      toast.success(i18n.t("auth.emailVerification.successTitle"), {
        description: i18n.t("auth.emailVerification.successDescription"),
        duration: 10000,
      });
    } else if (status === "err") {
      toast.error(i18n.t("auth.emailVerification.failureTitle"), {
        description: i18n.t("auth.emailVerification.failureDescription"),
        duration: 10000,
      });
    } else {
      // No status parameter
      toast.info(i18n.t("auth.emailVerification.verificationInfo"), {
        description: i18n.t(
          "auth.emailVerification.verificationInfoDescription",
        ),
        duration: 10000,
      });
    }

    // Redirect to login page on success, home page otherwise
    const timer = setTimeout(() => {
      if (status === "ok") {
        navigate("/login", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [status, navigate]);

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
            ? i18n.t("auth.emailVerification.successTitle")
            : status === "err"
              ? i18n.t("auth.emailVerification.failureTitle")
              : i18n.t("auth.emailVerification.verifying")}
        </h1>
        <p className="text-muted-foreground">
          {status === "ok"
            ? i18n.t("auth.emailVerification.redirectingToLogin")
            : i18n.t("auth.emailVerification.redirectingToHome")}
        </p>
      </div>
    </div>
  );
}
