import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import i18n from "@/i18n";
import { env } from "@/lib/env";
import { Mail, ShoppingBag } from "lucide-react";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          {i18n.t("pages.home.hero.title")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {i18n.t("pages.home.hero.subtitle")}
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag />
              {i18n.t("pages.home.premade.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{i18n.t("pages.home.premade.description")}</p>
            <Button asChild>
              <LanguageAwareLink to="/products">
                {i18n.t("pages.home.premade.cta")}
              </LanguageAwareLink>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail />
              {i18n.t("pages.home.custom.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{i18n.t("pages.home.custom.description")}</p>
            <Button asChild>
              <a href={`mailto:${env.shopOwnerEmail}`}>
                {i18n.t("pages.home.custom.cta")}
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
