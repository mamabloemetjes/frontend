import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/lib/env";
import { Props } from "@/types";
import { MessageSquareWarningIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

const WorkshopsPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.workshops" });

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
            <CardDescription className="text-base">
              {t("description")}
              {locale === "en" && (
                <div className="flex mt-4 w-fit items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-foreground backdrop-blur-sm">
                  <MessageSquareWarningIcon className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">
                    Workshops are only available in Dutch.
                  </span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>{t("text")}</CardContent>
          <CardContent>
            {t("invite", { email: env.shopOwnerEmail })}
          </CardContent>{" "}
        </Card>
      </div>
    </div>
  );
};

export default WorkshopsPage;
