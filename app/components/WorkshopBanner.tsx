import { ArrowRight, Flower2 } from "lucide-react"; // Or use your own SVG/icon
import { LanguageAwareLink } from "./LanguageAwareLink";

const WorkshopBanner = ({ text }: { text: string }) => {
  return (
    <section className="relative w-full mx-auto shadow-lg overflow-hidden bg-secondary border border-border">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none z-10">
        <Flower2 className="w-12 h-12 text-primary" />
      </div>
      <LanguageAwareLink href="/workshops">
        <div className="flex items-center whitespace-nowrap animate-marquee-reverse hover:[animation-play-state:paused] py-4 pl-24 pr-4 mx-12 ">
          <p className="font-semibold tracking-wide text-secondary-foreground text-lg drop-shadow-sm">
            {text}
          </p>
          <ArrowRight className="ml-2 w-4 h-4 text-primary translate hover:translate-x-1 transition-transform duration-300" />
        </div>
      </LanguageAwareLink>
    </section>
  );
};

export default WorkshopBanner;
