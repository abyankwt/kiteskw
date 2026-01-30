import { useState, useEffect } from "react";
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
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  // Sticky filter behavior on scroll
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 400; // Approximate hero section height
      const headerHeight = 80; // Header height
      const scrollPosition = window.scrollY;

      // Make filter sticky when scrolled past hero section
      setIsFilterSticky(scrollPosition > heroHeight - headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      case 'workshop': return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-300',
        gradient: 'from-gray-600 to-slate-700',
        glow: 'group-hover:shadow-gray-500/50'
      };
      case 'webinar': return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-300',
        gradient: 'from-purple-600 to-pink-600',
        glow: 'group-hover:shadow-purple-500/50'
      };
      case 'training': return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-300',
        gradient: 'from-green-600 to-emerald-600',
        glow: 'group-hover:shadow-green-500/50'
      };
      case 'conference': return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-300',
        gradient: 'from-orange-600 to-red-600',
        glow: 'group-hover:shadow-orange-500/50'
      };
      default: return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-300',
        gradient: 'from-gray-600 to-slate-700',
        glow: 'group-hover:shadow-gray-500/50'
      };
    }
  };

  const EventCard = ({ event }: { event: Event }) => {
    const colors = getTypeColor(event.type);

    return (
      <div className={cn(
        "group relative flex flex-col h-full bg-white rounded-2xl p-6 lg:p-8",
        "border-2 border-transparent hover:border-gray-200",
        "shadow-lg hover:shadow-2xl",
        colors.glow,
        "hover:-translate-y-2 hover:scale-[1.02]",
        "transition-all duration-300 overflow-hidden"
      )}>
        {/* Gradient Border Overlay on Hover */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br", colors.gradient,
          "p-[2px]"
        )}>
          <div className="w-full h-full bg-white rounded-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            {/* Enhanced Date Block */}
            <div className={cn(
              "flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg",
              "bg-gradient-to-br", colors.gradient,
              "group-hover:scale-110 transition-transform duration-300"
            )}>
              <span className="text-white font-heading text-2xl font-black leading-none">
                {new Date(event.date).getDate()}
              </span>
              <span className="text-white/90 text-xs uppercase mt-1 tracking-wider font-bold">
                {new Intl.DateTimeFormat(language === "ar" ? "ar-KW" : "en-US", {
                  month: "short",
                }).format(new Date(event.date))}
              </span>
            </div>

            {/* Enhanced Type Badge */}
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs uppercase font-black tracking-wider border-2",
              colors.bg, colors.text, colors.border,
              "shadow-sm group-hover:scale-105 transition-transform"
            )}>
              {t.eventTypes[event.type]}
            </span>
          </div>

          <div className="mb-6 flex-grow">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:font-extrabold transition-all line-clamp-2 leading-tight">
              {event.title[language]}
            </h3>

            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
              <MapPin size={16} className="shrink-0" />
              <span className="line-clamp-1">{event.location[language]}</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t-2 border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar size={14} />
                {formatDate(event.date)}
              </span>

              {/* Register CTA */}
              <span className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs",
                "bg-gradient-to-r", colors.gradient,
                "text-white shadow-md",
                "group-hover:shadow-lg group-hover:scale-105",
                "transition-all duration-300"
              )}>
                Register Now
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
      </div>
    );
  };

  return (
    <>
      <SEO page="events" />


      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-black relative overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wide">Events & Workshops</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                {t.pageTitle}
              </span>
            </h1>

            <p className="font-body text-lg sm:text-xl lg:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
              {t.intro}
            </p>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/70">Participants</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-white/70">Events Held</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">4.9★</div>
                <div className="text-sm text-white/70">Rating</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Enhanced Filters */}
      <section className={cn(
        "py-6 lg:py-8 bg-white border-b border-gray-200 shadow-md transition-all duration-200",
        isFilterSticky
          ? "fixed top-20 left-0 right-0 z-40"
          : "relative"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Filter size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Filter Events</h3>
                <p className="text-xs text-muted-foreground">Find exactly what you're looking for</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {['all', 'workshop', 'webinar', 'training', 'conference'].map((type) => {
                const count = type === 'all'
                  ? events.length
                  : events.filter(e => e.type === type).length;

                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type as EventType | 'all')}
                    className={cn(
                      "group relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 flex items-center gap-2",
                      activeFilter === type
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-105"
                    )}
                  >
                    <span>
                      {type === 'all' ? (language === 'en' ? 'All Events' : 'الكل') : t.eventTypes[type as EventType]}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-black",
                      activeFilter === type
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                  🎯 {t.upcomingHeading}
                </h2>
                <p className="text-base text-muted-foreground">Join 500+ professionals in our upcoming sessions</p>
              </div>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
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
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                  📚 {t.pastHeading}
                </h2>
                <p className="text-base text-muted-foreground">Highlights from our previous workshops and success stories</p>
              </div>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
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
