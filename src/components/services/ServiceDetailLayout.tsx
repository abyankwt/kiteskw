import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCheckmark } from "@/components/ui/AnimatedCheckmark";

import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { ServiceDetailContent, ServiceData } from "@/data/serviceDetailData";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Interactive Components
import { TrainingTimelineEnhanced } from "./TrainingTimeline";
import { SkillBentoGrid } from "./SkillBentoGrid";
import { ConsultingProcess } from "./ConsultingProcess";
import { DomainDeck } from "./DomainDeck";
import { IndustrySpotlight } from "./IndustrySpotlight";
import { SoftwarePartners } from "./SoftwarePartners";
import { SoftwareFeatures } from "./SoftwareFeatures";

interface ServiceDetailLayoutProps {
    data: ServiceData;
}

const StickySubNav = ({ sections }: { sections: { id: string; label: string }[] }) => {
    const [activeId, setActiveId] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show nav after scrolling past hero (approx 600px)
            setIsVisible(window.scrollY > 600);

            // Determine active section
            let currentId = "";
            sections.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If top is roughly in view
                    if (rect.top < 150 && rect.bottom > 150) {
                        currentId = id;
                    }
                }
            });
            if (currentId) setActiveId(currentId);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300 animate-in slide-in-from-top-2">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-3">
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className={cn(
                                "text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-200",
                                activeId === section.id
                                    ? "text-primary border-b-2 border-primary pb-0.5"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                        >
                            {section.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ServiceDetailLayout = ({ data }: ServiceDetailLayoutProps) => {
    const { language, isRTL } = useLanguage();
    const content = data[language];
    const Icon = data.icon;

    // Build available sections dynamically
    const navSections = [
        { id: "overview", label: content.overview.title },
        ...(content.courses ? [{ id: "curriculum", label: content.courses.title }] : []),
        ...(content.deliverables ? [{ id: "deliverables", label: content.deliverables.title }] : []),
        ...(content.domains ? [{ id: "capabilities", label: content.domains.title }] : []),
        { id: "impact", label: content.impact.title }
    ];

    return (
        <div className="min-h-screen">
            <StickySubNav sections={navSections} />

            {/* Enterprise Hero Section */}
            <section className="pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-48 lg:pb-32 bg-primary relative overflow-hidden">
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal className="max-w-4xl mx-auto text-center">
                        {/* Breadcrumb / Back Link */}
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-1.5 sm:gap-2 text-primary-foreground/60 hover:text-primary-foreground font-heading text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6 lg:mb-10 transition-colors"
                        >
                            <ArrowLeft size={12} className="rtl:rotate-180" />
                            {language === "en" ? "Back to Services" : "العودة للخدمات"}
                        </Link>

                        {/* Service Icon Badge */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto bg-primary-foreground/5 border border-primary-foreground/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 backdrop-blur-sm">
                            <Icon className="text-primary-foreground" size={20} strokeWidth={1.5} />
                        </div>

                        {/* Title */}
                        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-3 sm:mb-4 lg:mb-6 tracking-tight leading-tight">
                            {content.head.title}
                        </h1>

                        {/* Subtitle / Positioning */}
                        <p className="font-body text-sm sm:text-base lg:text-lg xl:text-xl text-primary-foreground/80 font-light max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                            {content.head.subtitle}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Overview & Value Prop */}
            <section id="overview" className="scroll-mt-32 py-10 sm:py-12 lg:py-28 bg-background border-b border-border/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <ScrollReveal>
                            <span className="block font-heading text-xs font-bold uppercase tracking-[0.2em] text-logo-codgray mb-6">
                                {content.overview.title}
                            </span>

                            {/* Quote Block */}
                            {content.overview.quote && (
                                <div className="border-l-4 border-logo-alto/20 pl-6 lg:pl-8 py-2 mb-10">
                                    <p className="font-heading text-2xl lg:text-3xl font-medium text-foreground leading-snug">
                                        "{content.overview.quote}"
                                    </p>
                                </div>
                            )}

                            <p className="font-body text-lg text-muted-foreground leading-relaxed">
                                {content.overview.content}
                            </p>
                        </ScrollReveal>

                        {/* Institute Info Block (Static) */}
                        {content.institute_info && (
                            <ScrollReveal className="mt-12 group bg-card hover:bg-card/80 border border-border/60 hover:border-gray-300/30 p-8 rounded-xl shadow-sm transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <h4 className="font-heading text-xl font-bold text-foreground">
                                                {content.institute_info.name}
                                            </h4>
                                            {data.id === 'training' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap">
                                                    Authorized Provider
                                                </span>
                                            )}
                                        </div>
                                        <div className="font-body text-base text-muted-foreground space-y-1">
                                            <p>{content.institute_info.address}</p>
                                            <p dir="ltr" className="flex items-center gap-2 group-hover:text-logo-codgray transition-colors">
                                                📞 <span className="font-medium">{content.institute_info.phone}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}
                    </div>
                </div>
            </section>

            {/* Training Course Catalogue (New Section) */}
            {content.courses && (
                data.id === 'training' ? (
                    <div id="curriculum" className="scroll-mt-20">
                        <TrainingTimelineEnhanced courses={content.courses.items.map((c, i) => ({
                            title: c.title,
                            duration: c.duration,
                            description: c.desc,
                            outline: c.outline,
                            who_should_attend: c.who_should_attend,
                            standards: c.standards
                        }))} />
                    </div>
                ) : (
                    <section id="curriculum" className="scroll-mt-32 py-12 sm:py-16 lg:py-28 bg-secondary/10 border-b border-border/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <ScrollReveal className="text-center mb-10 sm:mb-16">
                                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                                    {content.courses.title}
                                </h2>
                                <div className="h-1 w-12 bg-logo-alto rounded-full mx-auto opacity-80" />
                            </ScrollReveal>

                            <div className="max-w-4xl mx-auto">
                                <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
                                    {content.courses.items.map((course, index) => (
                                        <ScrollReveal key={index} className="w-full">
                                            <AccordionItem value={`item-${index}`} className="border border-border/60 rounded-lg bg-background px-3 sm:px-4 lg:px-6 shadow-sm data-[state=open]:border-gray-300/30 data-[state=open]:shadow-md transition-all overflow-hidden">
                                                <AccordionTrigger className="hover:no-underline py-4 sm:py-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center text-start gap-2 sm:gap-4 w-full ltr:pr-4 rtl:pl-4">
                                                        <span className="font-heading font-medium text-base sm:text-lg text-foreground flex-1 break-words">
                                                            {course.title}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground bg-secondary/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap max-w-fit shrink-0">
                                                            <Clock size={12} className="text-logo-codgray shrink-0" />
                                                            <span>{course.duration}</span>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-4 sm:pb-6 pt-2">
                                                    <div className="space-y-4 sm:space-y-6">
                                                        {/* Description */}
                                                        <div>
                                                            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground mb-2 opacity-70">
                                                                Description
                                                            </h4>
                                                            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                                                                {course.desc}
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                                            {/* Outline */}
                                                            <div>
                                                                <h4 className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground mb-3 sm:mb-4">
                                                                    <BookOpen size={12} className="text-logo-codgray" /> Course Outline
                                                                </h4>
                                                                <ul className="space-y-3 sm:space-y-4">
                                                                    {course.outline.map((topic, i) => (
                                                                        <li key={i} className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-foreground/90 group">
                                                                            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 text-gray-700 text-[9px] sm:text-[10px] font-bold shrink-0 mt-0.5 border border-gray-200 group-hover:bg-logo-alto group-hover:text-white transition-colors">
                                                                                {i + 1}
                                                                            </span>
                                                                            <span className="leading-relaxed pt-0.5 border-b border-transparent group-hover:border-gray-200 transition-colors break-words">
                                                                                {topic}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* Meta Info */}
                                                            <div className="space-y-6">
                                                                {/* Who Should Attend */}
                                                                <div>
                                                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                                                                        <Users size={14} className="text-logo-codgray" /> Who Should Attend
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {course.who_should_attend.map((role, i) => (
                                                                            <span key={i} className="text-[11px] font-medium bg-secondary px-2.5 py-1 rounded text-muted-foreground border border-border/50">
                                                                                {role}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Standards */}
                                                                {course.standards && (
                                                                    <div>
                                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                                                                            Aligned Standards
                                                                        </h4>
                                                                        <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-full">
                                                                            {course.standards}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </ScrollReveal>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </section>
                )
            )}

            {/* Deliverables (Expanded List) */}
            {content.deliverables && (
                data.id === 'training' ? (
                    <div id="deliverables" className="scroll-mt-20">
                        <SkillBentoGrid items={content.deliverables.items} />
                    </div>
                ) : (
                    <section id="deliverables" className="scroll-mt-32 py-16 lg:py-28 bg-secondary/10 border-b border-border/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto">
                                <ScrollReveal className="mb-12">
                                    <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                                        {content.deliverables.title}
                                    </h2>
                                </ScrollReveal>
                                <StaggerContainer className="grid md:grid-cols-2 gap-x-12 gap-y-6" staggerDelay={70}>
                                    {content.deliverables.items.map((item, i) => (
                                        <StaggerItem key={i} index={i}>
                                            <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border/60 shadow-sm hover:border-gray-200 transition-colors group">
                                                <AnimatedCheckmark size="md" variant="default" className="shrink-0 mt-0.5 text-logo-codgray" />
                                                <span className="font-body text-base text-foreground/90">{item}</span>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </div>
                    </section>
                )
            )}

            {/* Software Partners (New Section) */}
            {content.partners && (
                <SoftwarePartners data={content.partners} />
            )}

            {/* Software Features (New Section) */}
            {content.features && (
                <SoftwareFeatures data={content.features} />
            )}

            {/* Consultation Domains (Cards) */}
            {content.domains && (
                data.id === 'consultation' ? (
                    <div id="capabilities" className="scroll-mt-20">
                        <DomainDeck items={content.domains.items} />
                    </div>
                ) : (
                    <section id="capabilities" className="scroll-mt-32 py-16 lg:py-28 bg-background">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <ScrollReveal className="text-center mb-16">
                                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                                    {content.domains.title}
                                </h2>
                                <div className="h-1 w-12 bg-logo-alto rounded-full mx-auto opacity-80" />
                            </ScrollReveal>

                            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" staggerDelay={100}>
                                {content.domains.items.map((domain, i) => {
                                    const DomainIcon = domain.icon || CheckCircle2;
                                    return (
                                        <StaggerItem key={i} index={i}>
                                            <div className="bg-secondary/20 p-8 rounded-xl border border-border/50 hover:border-gray-300/30 hover:shadow-lg transition-all duration-300 h-full group">
                                                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-logo-alto group-hover:text-white transition-colors duration-300">
                                                    <DomainIcon size={24} strokeWidth={1.5} className="text-logo-codgray group-hover:text-white transition-colors" />
                                                </div>
                                                <h3 className="font-heading text-xl font-bold text-foreground mb-3 border-b border-border/50 pb-2 inline-block">
                                                    {domain.title}
                                                </h3>
                                                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                                                    {domain.desc}
                                                </p>

                                                {domain.capabilities && (
                                                    <ul className="space-y-2 mt-auto">
                                                        {domain.capabilities.map((cap, capIndex) => (
                                                            <li key={capIndex} className="flex items-start gap-2 text-xs text-foreground/80 font-medium">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                                                                <span>{cap}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </StaggerItem>
                                    );
                                })}
                            </StaggerContainer>
                        </div>
                    </section>
                )
            )}

            {/* Industries (Spotlight) */}
            {content.industries && (
                <IndustrySpotlight items={content.industries.items} />
            )}

            {/* 4-Step Process (or Legacy Delivery) */}
            {content.process ? (
                data.id === 'consultation' ? (
                    <div id="process" className="scroll-mt-0">
                        {/* Remove number prefix from titles for the clearer visuals */}
                        <ConsultingProcess steps={content.process.steps.map(s => ({
                            title: s.title.replace(/^\d+\.\s*/, ''),
                            desc: s.desc
                        }))} />
                    </div>
                ) : (
                    <section id="process" className="scroll-mt-32 py-16 lg:py-28 bg-background">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto">
                                <ScrollReveal className="text-center mb-16">
                                    <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                                        {content.process.title}
                                    </h2>
                                    <div className="h-1 w-12 bg-logo-alto rounded-full mx-auto opacity-80" />
                                </ScrollReveal>

                                <StaggerContainer className="grid gap-6" staggerDelay={150}>
                                    {content.process.steps.map((step, i) => (
                                        <StaggerItem key={i} index={i}>
                                            <div className="flex flex-col md:flex-row gap-6 p-6 lg:p-8 rounded-2xl border border-border/60 bg-gradient-to-r from-secondary/10 to-transparent hover:border-gray-300/20 transition-all">
                                                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-logo-alto text-white font-heading font-bold text-lg shadow-md">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                                                        {step.title.replace(/^\d+\.\s*/, '') /* Remove number prefix if present in text */}
                                                    </h3>
                                                    <p className="font-body text-base text-muted-foreground leading-relaxed">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </div>
                    </section>
                )
            ) : content.delivery && (
                /* Legacy Delivery Fallback */
                <section id="process" className="scroll-mt-32 py-16 lg:py-28 bg-secondary/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <ScrollReveal className="text-center mb-16">
                                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                                    {content.delivery.title}
                                </h2>
                                <div className="h-1 w-12 bg-logo-alto rounded-full mx-auto opacity-80" />
                            </ScrollReveal>

                            <StaggerContainer className="grid md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={100}>
                                {content.delivery.steps.map((step, index) => (
                                    <StaggerItem key={index} index={index}>
                                        <div className="bg-background border border-border/60 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4 h-full">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-logo-codgray flex items-center justify-center shrink-0">
                                                <span className="font-heading text-sm font-bold">{index + 1}</span>
                                            </div>
                                            <p className="font-body text-base text-foreground/90 font-medium pt-1">
                                                {step}
                                            </p>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    </div>
                </section>
            )}

            {/* Business Impact */}
            <section id="impact" className="scroll-mt-32 py-16 lg:py-28 bg-background border-t border-border/40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <ScrollReveal>
                                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                                    {content.impact.title}
                                </h2>
                                <p className="font-body text-lg text-muted-foreground mb-8">
                                    {language === 'en'
                                        ? "Our approach ensures measurable results that align with your strategic goals, delivering value beyond just technical execution."
                                        : "نهجنا يضمن نتائج قابلة للقياس تتوافق مع أهدافك الاستراتيجية، مما يقدم قيمة تتجاوز مجرد التنفيذ الفني."}
                                </p>
                            </ScrollReveal>

                            <StaggerContainer className="grid sm:grid-cols-2 gap-4" staggerDelay={100}>
                                {content.impact.outcomes.map((outcome, index) => (
                                    <StaggerItem key={index} index={index}>
                                        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border/50 group">
                                            <AnimatedCheckmark size="md" variant="success" className="shrink-0 text-emerald-600" />
                                            <span className="font-heading text-sm font-bold text-foreground/80 uppercase tracking-wide">
                                                {outcome}
                                            </span>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-[#0B0F14] relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[#101826] to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <ScrollReveal>
                        {content.cta.title && (
                            <p className="font-heading text-xl md:text-2xl text-white/90 font-light mb-6">
                                {content.cta.title}
                            </p>
                        )}
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight max-w-4xl mx-auto">
                            {content.cta.text}
                        </h2>
                        <Link to="/contact">
                            <Button variant="heroOutline" size="xl" className="group border-white/20 hover:border-white text-white hover:bg-white/5">
                                {content.cta.button}
                                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </Button>
                        </Link>
                    </ScrollReveal>
                </div>
            </section>

            {/* Sticky CTA for Training (Desktop Only) */}
            {
                data.id === 'training' && (
                    <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
                        <ScrollReveal>
                            <Link to="/contact">
                                <div className="bg-foreground text-background px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center gap-3 border border-border/20">
                                    <span className="font-heading font-bold text-sm">Request Training</span>
                                    <ArrowRight size={16} className="text-logo-gunsmoke rtl:rotate-180" />
                                </div>
                            </Link>
                        </ScrollReveal>
                    </div>
                )
            }

        </div>
    );
};
