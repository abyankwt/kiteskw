import { useState } from "react";
import { SEO } from "@/components/common/SEO";

import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/hooks/useContent";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";

interface InsightsContent {
  pageTitle: string;
  intro: string;
  allCategory: string;
  categories: string[];
  readMore: string;
  noArticles: string;
}

export default function Insights() {
  const { language } = useLanguage();
  const t = useContent<InsightsContent>('insights');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const filteredArticles = activeCategory === null
    ? articles
    : articles.filter((a) => a.categoryIndex === activeCategory);

  return (
    <>
      <SEO page="insights" />


      {/* Hero Section */}
      <section className="page-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-4 sm:mb-6 tracking-tight">
              {t.pageTitle}
            </h1>
            <p className="font-body text-base sm:text-lg text-primary-foreground/70 leading-relaxed px-2 sm:px-0">
              {t.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-4 sm:py-6 bg-background border-b border-border sticky top-[116px] z-30 backdrop-blur-md bg-background/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveCategory(null)}
              className={activeCategory === null ? "badge-category-active whitespace-nowrap" : "badge-category hover:border-foreground/30 transition-colors whitespace-nowrap"}
            >
              {t.allCategory}
            </button>
            {t.categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={activeCategory === index ? "badge-category-active whitespace-nowrap" : "badge-category hover:border-foreground/30 transition-colors whitespace-nowrap"}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group card-interactive overflow-hidden"
                >
                  {/* Placeholder Image */}
                  <div className="aspect-video bg-secondary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/10" />
                    <span className="absolute top-4 start-4 badge-category">
                      {t.categories[article.categoryIndex]}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-body-sm mb-3">
                      <Calendar size={14} strokeWidth={1.5} />
                      <span>{article.date}</span>
                    </div>
                    <h3 className="font-heading text-h4 font-semibold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title[language]}
                    </h3>
                    <p className="text-muted-foreground text-body-sm mb-5 line-clamp-3">
                      {article.excerpt[language]}
                    </p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-foreground hover:text-accent group/btn">
                      {t.readMore}
                      <ArrowRight size={14} className="ms-1 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:rotate-180" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t.noArticles}</p>
            </div>
          )}
        </div>
      </section>


    </>
  );
}
