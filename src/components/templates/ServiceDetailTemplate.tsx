import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIcon } from "lucide-react";

interface ServiceContent {
  en: {
    heroTitle: string;
    heroSubtitle: string;
    whatWeDoTitle: string;
    whatWeDoDescription: string;
    whatWeDoPoints: string[];
    howWeDoItTitle: string;
    howWeDoItSteps: { title: string; description: string }[];
    applicationsTitle: string;
    applications: { title: string; description: string; icon: LucideIcon }[];
  };
  ar: {
    heroTitle: string;
    heroSubtitle: string;
    whatWeDoTitle: string;
    whatWeDoDescription: string;
    whatWeDoPoints: string[];
    howWeDoItTitle: string;
    howWeDoItSteps: { title: string; description: string }[];
    applicationsTitle: string;
    applications: { title: string; description: string; icon: LucideIcon }[];
  };
}

interface ServiceDetailTemplateProps {
  content: ServiceContent;
}

const ctaContent = {
  en: {
    heading: "Ready to get started?",
    button: "Get a Quote",
  },
  ar: {
    heading: "هل أنت مستعد للبدء؟",
    button: "احصل على عرض سعر",
  },
};

export function ServiceDetailTemplate({ content }: ServiceDetailTemplateProps) {
  const { language } = useLanguage();
  const t = content[language];
  const cta = ctaContent[language];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-navy-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="accent-line mb-8" />
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-cream leading-tight mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-cream/70 max-w-2xl">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-8">
              {t.whatWeDoTitle}
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              {t.whatWeDoDescription}
            </p>
            <ul className="space-y-4">
              {t.whatWeDoPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                  </span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How We Do It Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-12 text-center">
              {t.howWeDoItTitle}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {t.howWeDoItSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-background p-6 rounded-lg border border-border hover:border-gold/30 transition-colors"
                >
                  <span className="absolute -top-3 start-6 bg-gold text-navy-deep text-sm font-semibold px-3 py-1 rounded-full">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground mt-4 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-12 text-center">
              {t.applicationsTitle}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.applications.map((app, index) => {
                const Icon = app.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 bg-muted/30 rounded-lg border border-transparent hover:border-gold/20 hover:bg-muted/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                      {app.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {app.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-navy-deep relative overflow-hidden">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cream/5 rounded-full" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/5 rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="accent-line mx-auto mb-10" />
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-cream leading-snug mb-12">
              {cta.heading}
            </h2>
            <Button variant="hero" size="xl" className="group">
              {cta.button}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180"
              />
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
