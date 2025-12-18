import { CheckSquare, XCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    // Show appropriate toast based on status
    if (status === "ok") {
      toast.success("Email verified successfully!", {
        description: "You can now log in to your account.",
        duration: 10000,
      });
    } else if (status === "err") {
      toast.error("Email verification failed", {
        description:
          "The verification link is invalid or has expired. Please try again or request a new verification email.",
        duration: 10000,
      });
    } else {
      // No status parameter
      toast.info("Email verification", {
        description: "Checking your verification status...",
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
            ? "Email Verified!"
            : status === "err"
              ? "Verification Failed"
              : "Verifying..."}
        </h1>
        <p className="text-muted-foreground">
          {status === "ok"
            ? "Redirecting to login page..."
            : "Redirecting to home page..."}
        </p>
      </div>
    </div>
  );
}
