"use client";

import { Mail, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useResendVerification, useCheckVerification } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResendVerification = () => {
  const t = useTranslations("auth.emailVerification");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");

  const { data: verificationStatus, isLoading: isCheckingStatus } =
    useCheckVerification(userId);

  const [email, setEmail] = useState(verificationStatus?.email || "");
  const resendVerification = useResendVerification();

  useEffect(() => {
    // If no user ID in URL, redirect to home
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && userId) {
      resendVerification.mutate(email);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {verificationStatus?.verified ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : (
              <Mail className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus?.verified
              ? t("alreadyVerified")
              : t("resendEmail")}
          </CardTitle>
          <CardDescription>
            {verificationStatus?.verified
              ? t("alreadyVerifiedDescription")
              : t("enterEmailPrompt")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCheckingStatus ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("checkingStatus")}
            </div>
          ) : verificationStatus?.verified ? (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{t("alreadyVerified")}</AlertTitle>
                <AlertDescription>
                  {t("alreadyVerifiedDescription")}
                </AlertDescription>
              </Alert>
              <Button onClick={() => router.push("/login")} className="w-full">
                {t("goToLogin")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {tCommon("email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email || verificationStatus?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={resendVerification.isPending || !email}
              >
                {resendVerification.isPending
                  ? t("resendingEmail")
                  : t("resendEmail")}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {tCommon("backToHome")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      }
    >
      <ResendVerification />
    </Suspense>
  );
};

export default Page;
