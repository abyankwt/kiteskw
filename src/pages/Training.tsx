import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { ArrowRight, Star, Clock, Users, Trophy, Sparkles, CheckCircle2, Quote, BookOpen, Target, Briefcase, MessageCircle, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
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
import { BundleOfferCard, EarlyBirdOfferCard } from "@/components/training/SpecialOfferCard";
import { gsap } from "@/lib/gsap";

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

    // Get training data from servicesDetailData
    const trainingData = servicesDetailData["training"]?.[language];

    // Animation Refs
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const primaryCTARef = useRef<HTMLDivElement>(null);
    const secondaryCTARef = useRef<HTMLAnchorElement>(null);

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
            }, 800); // 800ms delay for snappier feel
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
                discount="20%"
                expiryDate="2026-02-15T23:59:59"
                remainingSeats={12}
                message="Early Bird Discount - Limited Seats Available!"
            />

            {/* SECTION 1 — Hero Section */}
            <section
                ref={heroRef}
                className="relative pt-32 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-[#0B0F14]"
                id="main-content"
            >
                {/* Deep Navy Gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0B0F14] to-[#101826]" />
                {/* Subtle Noise */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none z-0" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={cn("max-w-4xl mx-auto text-center", isRTL && "text-right")}>
                        <h1
                            ref={titleRef}
                            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-[1.05] tracking-tight"
                        >
                            {t.hero.title}
                        </h1>
                        <p
                            ref={subtitleRef}
                            className="font-body text-base sm:text-lg lg:text-xl text-slate-400/90 max-w-3xl mx-auto font-light px-2 sm:px-0 mb-10 lg:mb-12"
                        >
                            {t.hero.subtitle}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
                            <div ref={primaryCTARef} className="w-full sm:w-auto">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseEnter={(e) => {
                                        gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onMouseLeave={(e) => {
                                        gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    className="inline-flex items-center px-8 py-4 bg-[#25D366] text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-[#20BD5A] transition-all duration-300 group shadow-lg hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] w-full justify-center relative animate-pulse-subtle"
                                >
                                    <MessageCircle size={18} className="mr-2" />
                                    <span>Start Free Consultation</span>
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
                                <span>{t.hero.secondaryCTA}</span>
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
                                    <AnimatedCounter end={500} suffix="+" className="font-bold text-white" /> Engineers Enrolled
                                </span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-slate-700" />
                            <div className="flex items-center gap-2 text-slate-400">
                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                <span>
                                    <AnimatedCounter end={4.9} suffix="/5" className="font-bold text-white" /> Average Rating
                                </span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-slate-700" />
                            <div className="flex items-center gap-2 text-slate-400">
                                <Trophy size={16} className="text-blue-500" />
                                <span>
                                    <AnimatedCounter end={98} suffix="%" className="font-bold text-white" /> Career Growth
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPUP MODAL */}
            <TrainingOffersModal open={showOffersModal} onOpenChange={setShowOffersModal} />

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRENDING_COURSES.map((course, index) => (
                            <EnhancedCourseCard
                                key={course.id}
                                course={course}
                                whatsappUrl={whatsappUrl}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges Section */}
            <TrustBadges />

            {/* SECTION: OFFERS GRID */}
            <TrainingOffersSection />

            {/* SECTION: BENTO GRID FEATURES */}
            <TrainingBentoGrid />

            {/* Comparison Matrix Section */}
            <ComparisonMatrix />

            {/* Special Offer Card - Bundle Offer */}
            <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <BundleOfferCard />
                        <EarlyBirdOfferCard />
                    </div>
                </div>
            </section>

            {/* SECTION: LEARNING PATH INFOGRAPHIC (Enhanced) */}
            <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

                {/* Decorative Gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Career Roadmap</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">Your Journey to Expertise</h2>
                        <p className="text-slate-600 text-lg">Choose your path and join <AnimatedCounter end={500} suffix="+" className="font-bold text-emerald-600" /> engineers advancing their careers.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) - Enhanced */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 origin-left animate-[grow-width_3s_ease-out_forwards]" />
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
                                        4-6 weeks
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover/card:text-blue-600 transition-colors">1. Foundation</h3>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        Master the basics of engineering simulation and CAD design to ace your capstone projects.
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <Users size={14} className="text-blue-500" />
                                        <AnimatedCounter end={340} suffix=" completed" className="font-semibold" />
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href="https://wa.me/96522092260?text=I'm interested in the Foundation program"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MessageCircle size={16} className="mr-2" />
                                        Start Foundation Path
                                    </a>
                                </div>
                            </div>

                            {/* Step 2 - Certification */}
                            <div className="relative group mt-8 md:mt-0">
                                {/* Connection Dot */}
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-emerald-500 rounded-full items-center justify-center z-10 shadow-lg shadow-emerald-500/30 group-hover:scale-125 transition-all duration-300 delay-100">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                </div>

                                {/* Card */}
                                <div
                                    style={{ transform: "perspective(1000px)" }}
                                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/card cursor-pointer min-h-[400px] flex flex-col"
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                    {/* Icon with Rotation */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 relative z-10 shadow-lg shadow-emerald-500/30 group-hover/card:rotate-12 transition-transform duration-500">
                                        <Target size={30} className="group-hover/card:scale-110 transition-transform" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} />
                                        8-12 weeks
                                    </div>

                                    {/* Popular Badge */}
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Flame size={10} />
                                        Most Popular
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover/card:text-emerald-600 transition-colors">2. Certification</h3>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        Earn professional credentials (CFD, FEA) to demonstrate competency to top employers.
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <Users size={14} className="text-emerald-500" />
                                        <AnimatedCounter end={215} suffix=" completed" className="font-semibold" />
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href="https://wa.me/96522092260?text=I'm interested in the Certification program"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MessageCircle size={16} className="mr-2" />
                                        Get Certified Now
                                    </a>
                                </div>
                            </div>

                            {/* Step 3 - Mastery */}
                            <div className="relative group mt-16 md:mt-0">
                                {/* Connection Dot */}
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-purple-500 rounded-full items-center justify-center z-10 shadow-lg shadow-purple-500/30 group-hover:scale-125 transition-all duration-300 delay-200">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                                </div>

                                {/* Card */}
                                <div
                                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/card cursor-pointer min-h-[400px] flex flex-col"
                                    style={{ transform: "perspective(1000px)" }}
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                    {/* Icon with Rotation */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 relative z-10 shadow-lg shadow-purple-500/30 group-hover/card:rotate-12 transition-transform duration-500">
                                        <Trophy size={30} className="group-hover/card:scale-110 transition-transform" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} />
                                        12+ weeks
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover/card:text-purple-600 transition-colors">3. Mastery</h3>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        Lead teams and innovation. Advanced corporate training to upskill entire departments.
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <Users size={14} className="text-purple-500" />
                                        <AnimatedCounter end={87} suffix=" completed" className="font-semibold" />
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href="https://wa.me/96522092260?text=I'm interested in the Mastery program"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MessageCircle size={16} className="mr-2" />
                                        Achieve Mastery
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
                        {REVIEWS.map((review, i) => (
                            <StaggerItem key={review.id} index={i} className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                                <Quote size={24} className="text-slate-200 absolute top-6 right-6" />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{review.name}</div>
                                        <div className="text-xs text-slate-500">{review.role}, {review.company}</div>
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
                        Limited Spots for February 2026 Intake
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to Start Learning?</h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
                        Join <AnimatedCounter end={500} suffix="+" className="font-bold text-white" /> engineers who have advanced their careers with KITES training.
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
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>Money-back guarantee</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>Free trial lesson</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>Industry-certified trainers</span>
                        </div>
                    </div>
                </div>
            </section>

        </div >
    );
};


export default Training;
