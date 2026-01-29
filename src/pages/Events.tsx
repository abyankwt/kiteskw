import { useState } from "react";
import { SEO } from "@/components/common/SEO";

import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/hooks/useContent";
import { Calendar, MapPin, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { events, type Event, type EventType } from "@/data/events";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

interface EventsContent {
  pageTitle: string;
  intro: string;
  learnMore: string;
  upcomingHeading: string;
  pastHeading: string;
  eventTypes: Record<EventType, string>;
}

export default function Events() {
  const { language } = useLanguage();
  const t = useContent<EventsContent>('events');
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');

  const upcomingEvents = events.filter((e) => e.upcoming);
  const pastEvents = events.filter((e) => !e.upcoming);

  // Filter logic
  const filteredUpcoming = activeFilter === 'all'
    ? upcomingEvents
    : upcomingEvents.filter(e => e.type === activeFilter);

  const filteredPast = activeFilter === 'all'
    ? pastEvents
    : pastEvents.filter(e => e.type === activeFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === "ar" ? "ar-KW" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'workshop': return 'bg-gray-100 text-logo-codgray border-gray-200';
      case 'webinar': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'training': return 'bg-green-100 text-green-700 border-green-200';
      case 'conference': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <div className="group flex flex-col h-full bg-card hover:bg-card/80 border border-border/60 hover:border-gray-300 rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">

      <div className="flex items-start justify-between gap-4 mb-5">
        {/* Date Block */}
        <div className="flex-shrink-0 w-14 h-14 bg-primary rounded-lg flex flex-col items-center justify-center text-center shadow-sm group-hover:bg-logo-codgray transition-colors duration-300">
          <span className="text-white font-heading text-lg font-bold leading-none">
            {new Date(event.date).getDate()}
          </span>
          <span className="text-white/80 text-[10px] uppercase mt-0.5 tracking-wider font-medium">
            {new Intl.DateTimeFormat(language === "ar" ? "ar-KW" : "en-US", {
              month: "short",
            }).format(new Date(event.date))}
          </span>
        </div>

        {/* Type Badge */}
        <span className={cn("px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border", getTypeColor(event.type))}>
          {t.eventTypes[event.type]}
        </span>
      </div>

      <div className="mb-4 flex-grow">
        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:font-extrabold transition-all line-clamp-2 leading-tight">
          {event.title[language]}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin size={14} className="shrink-0 text-logo-gunsmoke" />
          <span className="line-clamp-1">{event.location[language]}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Calendar size={12} />
          {formatDate(event.date)}
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-logo-codgray group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1">
          {t.learnMore} <ArrowRight size={12} />
        </span>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-logo-alto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  return (
    <>
      <SEO page="events" />


      {/* Hero Section */}
      <section className="pt-32 pb-12 sm:pt-32 sm:pb-16 lg:pt-48 lg:pb-32 bg-primary relative overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 tracking-tight leading-tight">
              {t.pageTitle}
            </h1>
            <p className="font-body text-base sm:text-lg lg:text-xl text-primary-foreground/80 font-light px-2 sm:px-0">
              {t.intro}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sm:py-6 lg:py-8 bg-background border-b border-border/50 sticky top-[116px] z-30 backdrop-blur-md bg-background/90 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <Filter size={14} className="text-muted-foreground mr-1 sm:mr-2 shrink-0" />
            {['all', 'workshop', 'webinar', 'training', 'conference'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type as EventType | 'all')}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                  activeFilter === type
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                )}
              >
                {type === 'all' ? (language === 'en' ? 'All' : 'الكل') : t.eventTypes[type as EventType]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4 sm:pb-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
                {t.upcomingHeading}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">Join our latest sessions to stay ahead.</p>
            </div>
          </ScrollReveal>

          {filteredUpcoming.length > 0 ? (
            <StaggerContainer className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUpcoming.map((event, index) => (
                <StaggerItem key={event.id} index={index}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="py-20 text-center text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
              <p>{language === 'en' ? "No upcoming events matching your filter." : "لا توجد فعاليات قادمة تطابق اختيارك."}</p>
              <Button variant="link" onClick={() => setActiveFilter('all')} className="mt-2">View All</Button>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-12 sm:py-16 lg:py-28 bg-secondary/10 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-8 sm:mb-12 border-b border-border/40 pb-4 sm:pb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
              {t.pastHeading}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">Highlights from our previous workshops and success stories.</p>
          </ScrollReveal>

          {filteredPast.length > 0 ? (
            <StaggerContainer className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPast.map((event, index) => (
                <StaggerItem key={event.id} index={index}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>{language === 'en' ? "No past events found." : "لا توجد فعاليات سابقة."}</p>
            </div>
          )}
        </div>
      </section>


    </>
  );
}
