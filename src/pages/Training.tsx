import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { ArrowRight, Star, Clock, Users, Trophy, Sparkles, CheckCircle2, Quote, BookOpen, Target, Briefcase, MessageCircle, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsPage, getBlockValue, getBlockJson } from "@/hooks/useCmsPage";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { usePublishedTestimonials } from "@/hooks/useTestimonials";
import { EnrollmentModal } from "@/components/training/EnrollmentModal";
import { TrainingOffersModal } from "@/components/training/TrainingOffersModal";
import { TrainingOffersSection } from "@/components/training/TrainingOffersSection";
import { TrainingBentoGrid } from "@/components/training/TrainingBentoGrid";
import { AnimatedCounter } from "@/components/training/AnimatedCounter";
import { CourseAvailabilityBadge } from "@/components/training/CourseAvailabilityBadge";
import { EnhancedCourseCard } from "@/components/training/EnhancedCourseCard";
import { LiveEnrollmentNotifications } from "@/components/training/LiveEnrollmentNotifications";
import { StickyCTABar } from "@/components/training/StickyCTABar";
import { EnhancedStatsSection } from "@/components/training/EnhancedStatsSection";
import { LimitedTimeOfferBanner } from "@/components/training/LimitedTimeOfferBanner";
import { TrustBadges } from "@/components/training/TrustBadges";
import { ComparisonMatrix } from "@/components/training/ComparisonMatrix";
import { gsap } from "@/lib/gsap";
import { FloatingParticles } from "@/components/hero/FloatingParticles";
import { useMouseParallax } from "@/hooks/useMouseParallax";

// Mock Data for Trending Courses
const TRENDING_COURSES = [
    {
        id: 1,
        title: "SolidWorks – Level 1",
        category: "Simulation",
        rating: 4.9,
        reviews: 128,
        duration: "6 Weeks",
        level: "Advanced",
        image: "/assets/training/solidworks-level-1.png",
        badge: "Best Seller",
        price: "Contact for Pricing"
    },
    {
        id: 2,
        title: "SolidWorks Professional Certification",
        category: "CAD Design",
        rating: 4.8,
        reviews: 342,
        duration: "4 Weeks",
        level: "Intermediate",
        image: "/assets/training/solidworks-certification.png",
        badge: "Certification",
        price: "Contact for Pricing"
    },
    {
        id: 3,
        title: "CFD Mastery: Fluid Dynamics",
        category: "Fluid Dynamics",
        rating: 4.9,
        reviews: 89,
        duration: "8 Weeks",
        level: "Expert",
        image: "/assets/training/cfd-fluid-dynamics.png",
        badge: "Trending",
        price: "Contact for Pricing"
    },
    {
        id: 4,
        title: "MATLAB Fundamental",
        category: "Programming",
        rating: 4.7,
        reviews: 215,
        duration: "5 Days",
        level: "Beginner",
        image: "/assets/training/matlab-fundamental.png",
        badge: "New",
        price: "Contact for Pricing"
    }
];

// Mock Reviews
const REVIEWS = [
    {
        id: 1,
        name: "Abdullah K.",
        role: "Mechanical Engineer",
        company: "Kuwait Petroleum Corp",
        text: "The FEA training was game-changing. I applied the simulation techniques immediately to my current project. Highly recommended.",
        avatar: "AK"
    },
    {
        id: 2,
        name: "Sarah M.",
        role: "Architecture Student",
        company: "Kuwait University",
        text: "KITES helped me master SolidWorks before graduation. The certification gave me a huge advantage in job interviews.",
        avatar: "SM"
    },
    {
        id: 3,
        name: "Fahad Al-Azmi",
        role: "Project Manager",
        company: "Ministry of Public Works",
        text: "Professional, structured, and practical. The instructors are clearly industry experts, not just academics.",
        avatar: "FA"
    }
];

import { FloatingOfferButton } from "@/components/training/FloatingOfferButton";

const content = {
    en: {
        hero: {
            title: "Professional Engineering Training",
            subtitle: "Elevate your skills with industry-leading courses in simulation and design.",
            primaryCTA: "Contact Us",
            secondaryCTA: "View Programs"
        }
    },
    ar: {
        hero: {
            title: "تدريب هندسي احترافي",
            subtitle: "ارتق بمهاراتك مع دورات رائدة في المحاكاة والتصميم.",
            primaryCTA: "اتصل بنا",
            secondaryCTA: "عرض البرامج"
        }
    }
};

import { servicesDetailData } from "@/data/serviceDetailData";
import { TrainingTimelineEnhanced } from "@/components/services/TrainingTimelineEnhanced";

const Training = () => {
    const { language, isRTL } = useLanguage();
    const t = content[language];

    // CMS overrides — fall back to hardcoded content if unavailable
    const { data: cms } = useCmsPage('training');
    const { data: apiTestimonials = [] } = usePublishedTestimonials('training');
    const s = cms?.sections;
    const loc = language as 'en' | 'ar';
    const g = (sk: string, fk: string) => getBlockValue(s?.[sk], fk, loc) ?? undefined;
    const gj = (sk: string, fk: string) => getBlockJson(s?.[sk], fk) ?? undefined;

    const hero = {
        title: g('hero', 'title') ?? t.hero.title,
        subtitle: g('hero', 'subtitle') ?? t.hero.subtitle,
        secondaryCTA: g('hero', 'cta_secondary') ?? t.hero.secondaryCTA,
    };

    const banner = (() => {
        const discount = getBlockValue(s?.['banner'], 'discount', 'en') ?? '20%';
        const expiryDate = getBlockValue(s?.['banner'], 'expiry_date', 'en') ?? '2026-07-01T23:59:59';
        const seats = parseInt(getBlockValue(s?.['banner'], 'remaining_seats', 'en') ?? '12');
        const message = g('banner', 'message') ?? 'Early Bird Discount - Limited Seats Available!';
        return { discount, expiryDate, remainingSeats: seats, message };
    })();

    const heroStats = {
        enrolledCount: parseInt(getBlockValue(s?.['stats'], 'enrolled_count', 'en') ?? '500'),
        ratingValue: parseFloat(getBlockValue(s?.['stats'], 'rating_value', 'en') ?? '4.9'),
        careerGrowthPct: parseInt(getBlockValue(s?.['stats'], 'career_growth_pct', 'en') ?? '98'),
        enrolledLabel: g('stats', 'enrolled_label') ?? 'Engineers Enrolled',
        ratingLabel: g('stats', 'rating_label') ?? 'Average Rating',
        careerLabel: g('stats', 'career_label') ?? 'Career Growth',
    };

    const reviews = (() => {
        if (apiTestimonials.length > 0) {
            return apiTestimonials.map(t => ({
                id: t.id,
                name: t.clientName,
                role: t.clientRole ?? '',
                company: t.clientCompany ?? '',
                text: t.content,
                avatar: t.avatarUrl
                    ? null
                    : t.clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
                avatarUrl: t.avatarUrl ?? null,
            }));
        }
        const raw = gj('reviews', 'items');
        if (!raw) return REVIEWS;
        return raw.map((r: any, i: number) => ({
            id: r.id ?? i,
            name: r.name,
            role: r.role,
            company: r.company,
            text: r.text,
            avatar: r.avatar,
            avatarUrl: null,
        }));
    })();

    const specialOffers = (() => {
        const raw = gj('special_offers', 'items');
        if (!raw || raw.length < 2) return null;
        return raw.map((o: any) => ({
            title: loc === 'ar' ? (o.title_ar ?? o.title) : o.title,
            description: loc === 'ar' ? (o.description_ar ?? o.description) : o.description,
            discount: o.discount,
            features: loc === 'ar' ? (o.features_ar ?? o.features) : o.features,
            ctaText: loc === 'ar' ? (o.ctaText_ar ?? o.ctaText) : o.ctaText,
            ctaLink: o.ctaLink,
            variant: o.variant as 'primary' | 'secondary',
        }));
    })();

    const trustBadges = (() => {
        const title = g('trust', 'title');
        const description = g('trust', 'description');
        const raw = gj('trust', 'items');
        if (!raw) return { title, description, badges: undefined };
        const badges = raw.map((b: any) => ({
            icon: b.icon,
            title: loc === 'ar' ? (b.title_ar ?? b.title) : b.title,
            description: loc === 'ar' ? (b.description_ar ?? b.description) : b.description,
            color: b.color,
        }));
        return { title, description, badges };
    })();

    const finalCta = {
        urgencyText: g('final_cta', 'urgency_text') ?? 'Limited Spots for Next Intake',
        title: g('final_cta', 'title') ?? 'Ready to Start Learning?',
        description: g('final_cta', 'description') ?? `Join 500+ engineers who have advanced their careers with KITES training.`,
        trustSignals: (() => {
            const raw = gj('final_cta', 'trust_signals');
            return raw ?? ['Money-back guarantee', 'Free trial lesson', 'Industry-certified trainers'];
        })(),
    };

    // --- NEW CMS sections ---
    const offersSection = {
        tagline: g('offers_section', 'tagline') ?? undefined,
        heading: g('offers_section', 'heading') ?? undefined,
        items: gj('offers_section', 'items') ?? undefined,
    };

    const whyKites = {
        tagline:  g('why_kites', 'tagline')  ?? undefined,
        heading:  g('why_kites', 'heading')  ?? undefined,
        subtitle: g('why_kites', 'subtitle') ?? undefined,
        features: gj('why_kites', 'features') ?? undefined,
    };

    const comparison = {
        badgeText: g('comparison', 'badge_text') ?? undefined,
        heading:   g('comparison', 'heading')    ?? undefined,
        subtitle:  g('comparison', 'subtitle')   ?? undefined,
        ctaText:   g('comparison', 'cta_text')   ?? undefined,
        ctaNote:   g('comparison', 'cta_note')   ?? undefined,
        features:  gj('comparison', 'features')  ?? undefined,
    };

    const learningPaths = {
        tagline:  g('learning_paths', 'tagline')  ?? undefined,
        heading:  g('learning_paths', 'heading')  ?? undefined,
        subtitle: g('learning_paths', 'subtitle') ?? undefined,
        paths:    gj('learning_paths', 'paths')   ?? undefined,
    };

    const trustPartnersLabel = g('trust', 'partners_label') ?? undefined;
    const trustPartners      = gj('trust', 'partners')      ?? undefined;

    // --- API Integration: load courses dynamically ---
    const { data: featuredCoursesData } = useFeaturedCourses();
    const [enrollingCourse, setEnrollingCourse] = useState<{ id: string | number; title: string; price: string } | null>(null);

    // Build trending course cards from featured list (admin-controlled order)
    const whatsappBase = `https://wa.me/96522092260?text=I'm%20interested%20in%20the%20course:%20`;
    // isFeaturedFromApi is true only when we have a real API response (array, even if empty)
    const isFeaturedFromApi = Array.isArray(featuredCoursesData);
    const trendingCourses = isFeaturedFromApi
        ? featuredCoursesData.map((c: any, i: number) => ({
            id: c.id,
            title: c.title,
            category: c.category,
            rating: c.rating,
            reviews: c.enrollmentCount,
            duration: c.duration || '—',
            level: c.level,
            image: c.thumbnailUrl || TRENDING_COURSES[i % TRENDING_COURSES.length]?.image || '/assets/training/solidworks-level-1.png',
            badge: ['Best Seller', 'Certification', 'Trending', 'New', 'Popular', 'Advanced', 'Beginner', 'In Demand', 'Featured'][i] ?? 'New',
            price: c.price === 0 ? 'Free' : c.effectivePrice ? `KWD ${c.effectivePrice.toFixed(3)}` : 'Contact for pricing',
        }))
        : TRENDING_COURSES;

    const handleEnroll = (courseId: string) => {
        const course = trendingCourses.find((c) => String(c.id) === courseId);
        if (course) setEnrollingCourse(course);
    };

    // Get training data from servicesDetailData
    const trainingData = servicesDetailData["training"]?.[language];

    // Animation Refs
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const primaryCTARef = useRef<HTMLDivElement>(null);
    const secondaryCTARef = useRef<HTMLAnchorElement>(null);
    const { x: mouseX, y: mouseY } = useMouseParallax(5);

    const handleScrollToPrograms = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById('featured-courses');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [showOffersModal, setShowOffersModal] = useState(false);

    // Auto-show offer logic
    useEffect(() => {
        const hasSeenOffer = sessionStorage.getItem("hasSeenTrainingOffer");
        if (!hasSeenOffer) {
            const timer = setTimeout(() => {
                setShowOffersModal(true);
                sessionStorage.setItem("hasSeenTrainingOffer", "true");
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Hero Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
            gsap.from(subtitleRef.current, {
                y: 20,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            });
            gsap.from([primaryCTARef.current, secondaryCTARef.current], {
                y: 20,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // WhatsApp URL
    const whatsappUrl = "https://wa.me/96522092260";

    return (
        <div className="bg-[#0B0F14] min-h-screen">
            <SEO page="training" />
            <SkipLink />

            {/* Limited Time Offer Banner */}
            <LimitedTimeOfferBanner
                discount={banner.discount}
                expiryDate={banner.expiryDate}
                remainingSeats={banner.remainingSeats}
                message={banner.message}
            />

            {/* SECTION 1 — Hero Section - Enhanced Educational Theme */}
            <section
                ref={heroRef}
                className="relative pt-48 pb-12 sm:pt-48 sm:pb-16 lg:pt-56 lg:pb-24 overflow-hidden bg-[#0B0F14]"
                id="main-content"
            >
                {/* Animated Gradient Mesh */}
                <div className="hero-gradient-mesh absolute inset-0 z-0" />

                {/* Educational Amber Particles */}
                <FloatingParticles count={20} color="rgba(251, 191, 36, 0.25)" />

                {/* Subtle Noise */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none z-[5]" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={cn("max-w-4xl mx-auto text-center", isRTL && "text-right")}>
                        <h1
                            ref={titleRef}
                            className={cn(
                                "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-[1.05] tracking-tight",
                                "transition-transform duration-200 ease-out"
                            )}
                            style={{
                                transform: `translate(${mouseX}px, ${mouseY}px)`,
                                willChange: 'transform'
                            }}
                        >
                            {hero.title}
                        </h1>
                        <p
                            ref={subtitleRef}
                            className="font-body text-base sm:text-lg lg:text-xl text-slate-400/90 max-w-3xl mx-auto font-light px-2 sm:px-0 mb-10 lg:mb-12"
                        >
                            {hero.subtitle}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
                            <div ref={primaryCTARef} className="w-full sm:w-auto">
                                <a
                                    href="#featured-courses"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('featured-courses')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    onMouseEnter={(e) => {
                                        gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onMouseLeave={(e) => {
                                        gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-blue-700 transition-all duration-300 group shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] w-full justify-center relative"
                                >
                                    <span>Browse Courses</span>
                                    <ArrowRight
                                        size={16}
                                        className={cn(
                                            "transition-transform duration-300",
                                            isRTL ? "mr-3 rotate-180 group-hover:-translate-x-1" : "ml-3 group-hover:translate-x-1"
                                        )}
                                    />
                                </a>
                            </div>
                            <a
                                ref={secondaryCTARef}
                                href="#programs"
                                onClick={handleScrollToPrograms}
                                className="inline-flex items-center text-sm font-semibold text-white/90 hover:text-white transition-colors duration-300 group underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                            >
                                <span>{hero.secondaryCTA}</span>
                                <ArrowRight
                                    size={14}
                                    className={cn(
                                        "transition-transform duration-300",
                                        isRTL ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2 group-hover:translate-x-1"
                                    )}
                                />
                            </a>
                        </div>

                        {/* Animated Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>
                                    <AnimatedCounter end={heroStats.enrolledCount} suffix="+" className="font-bold text-white" /> {heroStats.enrolledLabel}
                                </span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-slate-700" />
                            <div className="flex items-center gap-2 text-slate-400">
                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                <span>
                                    <AnimatedCounter end={heroStats.ratingValue} suffix="/5" className="font-bold text-white" /> {heroStats.ratingLabel}
                                </span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-slate-700" />
                            <div className="flex items-center gap-2 text-slate-400">
                                <Trophy size={16} className="text-blue-500" />
                                <span>
                                    <AnimatedCounter end={heroStats.careerGrowthPct} suffix="%" className="font-bold text-white" /> {heroStats.careerLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPUP MODAL */}
            <TrainingOffersModal open={showOffersModal} onOpenChange={setShowOffersModal} />

            {/* ENROLLMENT MODAL */}
            <EnrollmentModal course={enrollingCourse} onClose={() => setEnrollingCourse(null)} />

            {/* SECTION 2: REMOVED BANNER */}

            {/* SECTION 3: FEATURED / TRENDING COURSES */}
            <section id="featured-courses" className="py-24 bg-[#0F131A]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Top Selling</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Trending Courses</h2>
                        </div>
                        <a
                            href="#curriculum"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            View all programs <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trendingCourses.map((course, index) => (
                            <EnhancedCourseCard
                                key={course.id}
                                course={course}
                                whatsappUrl={`${whatsappBase}${encodeURIComponent(course.title)}`}
                                index={index}
                                onEnroll={isFeaturedFromApi ? handleEnroll : undefined}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges Section */}
            <TrustBadges
                title={trustBadges.title}
                description={trustBadges.description}
                badges={trustBadges.badges}
                partnersLabel={trustPartnersLabel}
                partners={trustPartners}
            />

            {/* SECTION: OFFERS GRID */}
            <TrainingOffersSection
                tagline={offersSection.tagline}
                heading={offersSection.heading}
                items={offersSection.items}
            />

            {/* SECTION: BENTO GRID FEATURES */}
            <TrainingBentoGrid
                tagline={whyKites.tagline}
                heading={whyKites.heading}
                subtitle={whyKites.subtitle}
                features={whyKites.features}
            />

            {/* Comparison Matrix Section */}
            <ComparisonMatrix
                badgeText={comparison.badgeText}
                heading={comparison.heading}
                subtitle={comparison.subtitle}
                ctaText={comparison.ctaText}
                ctaNote={comparison.ctaNote}
                features={comparison.features}
            />

            {/* SECTION: LEARNING PATH INFOGRAPHIC (Enhanced) */}
            <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

                {/* Decorative Gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">{learningPaths.tagline ?? 'Career Roadmap'}</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">{learningPaths.heading ?? 'Your Journey to Expertise'}</h2>
                        <p className="text-slate-600 text-lg">{learningPaths.subtitle ?? <>Choose your path and join <AnimatedCounter end={500} suffix="+" className="font-bold text-blue-600" /> engineers advancing their careers.</>}</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) - Enhanced */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 origin-left animate-[grow-width_3s_ease-out_forwards]" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Step 1 - Foundation */}
                            <div className="relative group">
                                {/* Connection Dot */}
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-blue-500 rounded-full items-center justify-center z-10 shadow-lg shadow-blue-500/30 group-hover:scale-125 transition-all duration-300">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                                </div>

                                {/* Card */}
                                <div
                                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/card cursor-pointer min-h-[400px] flex flex-col"
                                    style={{ transform: "perspective(1000px)" }}
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                    {/* Icon with Rotation */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 relative z-10 shadow-lg shadow-blue-500/30 group-hover/card:rotate-12 transition-transform duration-500">
                                        <BookOpen size={30} className="group-hover/card:scale-110 transition-transform" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} />
                                        {learningPaths.paths?.[0]?.duration ?? '4-6 weeks'}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover/card:text-blue-600 transition-colors">1. {learningPaths.paths?.[0]?.title ?? 'Foundation'}</h3>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {learningPaths.paths?.[0]?.description ?? 'Master the basics of engineering simulation and CAD design to ace your capstone projects.'}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <Users size={14} className="text-blue-500" />
                                        <AnimatedCounter end={learningPaths.paths?.[0]?.completed ?? 340} suffix=" completed" className="font-semibold" />
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href={learningPaths.paths?.[0]?.cta_link ?? "https://wa.me/96522092260?text=I'm interested in the Foundation program"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ArrowRight size={16} className="mr-2" />
                                        {learningPaths.paths?.[0]?.cta_text ?? 'Start Foundation Path'}
                                    </a>
                                </div>
                            </div>

                            {/* Step 2 - Certification */}
                            <div className="relative group mt-8 md:mt-0">
                                {/* Connection Dot */}
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-blue-500 rounded-full items-center justify-center z-10 shadow-lg shadow-blue-500/30 group-hover:scale-125 transition-all duration-300 delay-100">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                                </div>

                                {/* Card */}
                                <div
                                    style={{ transform: "perspective(1000px)" }}
                                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/card cursor-pointer min-h-[400px] flex flex-col"
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                    {/* Icon with Rotation */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 relative z-10 shadow-lg shadow-blue-500/30 group-hover/card:rotate-12 transition-transform duration-500">
                                        <Target size={30} className="group-hover/card:scale-110 transition-transform" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} />
                                        {learningPaths.paths?.[1]?.duration ?? '8-12 weeks'}
                                    </div>

                                    {(learningPaths.paths?.[1]?.badge ?? 'Most Popular') && (
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Flame size={10} />
                                            {learningPaths.paths?.[1]?.badge ?? 'Most Popular'}
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover/card:text-blue-600 transition-colors">2. {learningPaths.paths?.[1]?.title ?? 'Certification'}</h3>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {learningPaths.paths?.[1]?.description ?? 'Earn professional credentials (CFD, FEA) to demonstrate competency to top employers.'}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <Users size={14} className="text-blue-500" />
                                        <AnimatedCounter end={learningPaths.paths?.[1]?.completed ?? 215} suffix=" completed" className="font-semibold" />
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href={learningPaths.paths?.[1]?.cta_link ?? "https://wa.me/96522092260?text=I'm interested in the Certification program"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ArrowRight size={16} className="mr-2" />
                                        {learningPaths.paths?.[1]?.cta_text ?? 'Get Certified Now'}
                                    </a>
                                </div>
                            </div>

                            {/* Step 3 - Mastery */}
                            <div className="relative group mt-16 md:mt-0">
                                {/* Connection Dot */}
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-blue-500 rounded-full items-center justify-center z-10 shadow-lg shadow-blue-500/30 group-hover:scale-125 transition-all duration-300 delay-200">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                                </div>

                                {/* Card */}
                                <div
                                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/card cursor-pointer min-h-[400px] flex flex-col"
                                    style={{ transform: "perspective(1000px)" }}
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                    {/* Icon with Rotation */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 relative z-10 shadow-lg shadow-blue-500/30 group-hover/card:rotate-12 transition-transform duration-500">
                                        <Trophy size={30} className="group-hover/card:scale-110 transition-transform" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} />
                                        {learningPaths.paths?.[2]?.duration ?? '12+ weeks'}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover/card:text-blue-600 transition-colors">3. {learningPaths.paths?.[2]?.title ?? 'Mastery'}</h3>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {learningPaths.paths?.[2]?.description ?? 'Lead teams and innovation. Advanced corporate training to upskill entire departments.'}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <Users size={14} className="text-blue-500" />
                                        <AnimatedCounter end={learningPaths.paths?.[2]?.completed ?? 87} suffix=" completed" className="font-semibold" />
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href={learningPaths.paths?.[2]?.cta_link ?? "https://wa.me/96522092260?text=I'm interested in the Mastery program"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ArrowRight size={16} className="mr-2" />
                                        {learningPaths.paths?.[2]?.cta_text ?? 'Achieve Mastery'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MERGED: Full Course Catalogue via Timeline */}
            {trainingData && trainingData.courses && (
                <div className="bg-white border-t border-slate-100">
                    <TrainingTimelineEnhanced
                        courses={trainingData.courses.items.map((c: any) => ({
                            title: c.title,
                            duration: c.duration,
                            description: c.desc,
                            outline: c.outline,
                            who_should_attend: c.who_should_attend,
                            standards: c.standards
                        }))}
                    />
                </div>
            )}

            {/* MERGED: Business Impact for Employers */}
            {trainingData && trainingData.impact && (
                <section className="py-24 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <ScrollReveal>
                                    <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">
                                        {trainingData.impact.title}
                                    </h2>
                                    <p className="font-body text-lg text-slate-500 mb-8">
                                        {language === 'en'
                                            ? "Our approach ensures measurable results that align with your strategic goals, delivering value beyond just technical execution."
                                            : "نهجنا يضمن نتائج قابلة للقياس تتوافق مع أهدافك الاستراتيجية، مما يقدم قيمة تتجاوز مجرد التنفيذ الفني."}
                                    </p>
                                </ScrollReveal>

                                <StaggerContainer className="grid sm:grid-cols-2 gap-4" staggerDelay={100}>
                                    {trainingData.impact.outcomes.map((outcome: string, index: number) => (
                                        <StaggerItem key={index} index={index}>
                                            <div className="flex items-center gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
                                                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                                                <span className="font-heading text-sm font-bold text-slate-800 uppercase tracking-wide">
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
            )}

            {/* SECTION 5: REVIEWS & SOCIAL PROOF */}
            <section className="py-24 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">What Our Graduates Say</h2>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-3 gap-6">
                        {reviews.map((review, i) => (
                            <StaggerItem key={review.id} index={i} className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                                <Quote size={24} className="text-slate-200 absolute top-6 right-6" />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                        {(review as any).avatarUrl
                                            ? <img src={(review as any).avatarUrl} alt={review.name} className="w-full h-full object-cover" />
                                            : review.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{review.name}</div>
                                        <div className="text-xs text-slate-500">{[review.role, review.company].filter(Boolean).join(', ')}</div>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* SECTION 6: FINAL CTA */}
            <section className="py-24 bg-[#0B0F14] relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    {/* Urgency Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <Clock size={14} className="animate-pulse" />
                        {finalCta.urgencyText}
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">{finalCta.title}</h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
                        {finalCta.description}
                    </p>

                    {/* Dual CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-[0_0_25px_rgba(37,211,102,0.4)]"
                        >
                            <MessageCircle size={18} className="mr-2" />
                            Chat on WhatsApp
                            <ArrowRight size={18} className="ml-2" />
                        </a>
                        <Link
                            to="/contact?service=training"
                            className="inline-flex items-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-all border border-white/10"
                        >
                            Schedule a Call
                            <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>

                    {/* Trust Signals */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-slate-500">
                        {finalCta.trustSignals.map((signal: string, i: number) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span>{signal}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div >
    );
};


export default Training;
