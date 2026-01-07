import { Star } from "lucide-react";
import { _Translator } from "next-intl";

const PriceExplanation = ({ t }: { t: _Translator }) => {
  return (
    <div className="break-inside-avoid mb-6">
      <section className="bg-card rounded-2xl shadow-xl p-6 border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-8 h-8 text-primary" />
          {t("priceExplanationTitle")}
        </h2>
        <p
          className="text-base leading-relaxed text-muted-foreground whitespace-pre-line"
          itemProp="description"
        >
          {t("priceExplanationDesc")}
        </p>
      </section>
    </div>
  );
};

export default PriceExplanation;
