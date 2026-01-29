import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { ArrowRight, Star, Clock, Users, Trophy, Sparkles, CheckCircle2, Quote, BookOpen, Target, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { TrainingOffersModal } from "@/components/training/TrainingOffersModal";
import { TrainingOffersSection } from "@/components/training/TrainingOffersSection";
import { TrainingBentoGrid } from "@/components/training/TrainingBentoGrid";
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
        image: "https://images.unsplash.com/photo-1581093458891-2f3b97b0a3c7?q=80&w=2070&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1537462713505-a1d77482301c?q=80&w=2070&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop",
        badge: "Trending",
        price: "Contact for Pricing"
    },
    {
        id: 4,
        title: "Engineering Project Management",
        category: "Management",
        rating: 4.7,
        reviews: 215,
        duration: "3 Weeks",
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
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

const Training = () => {
    const { language, isRTL } = useLanguage();

    // Animation Refs
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

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
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // WhatsApp URL
    const whatsappUrl = "https://wa.me/96522092260";

    return (
        <div className="bg-[#0B0F14] min-h-screen">
            <SEO page="training" />
            <SkipLink />
            <Layout>
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
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                                <Link
                                    ref={primaryCTARef}
                                    to="/contact?service=training"
                                    onMouseEnter={(e) => {
                                        gsap.to(e.currentTarget, { y: -2, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onMouseLeave={(e) => {
                                        gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    className="inline-flex items-center px-8 py-4 bg-white text-[#0B0F14] font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-white/90 transition-all duration-300 group shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                                >
                                    <span>{t.hero.primaryCTA}</span>
                                    <ArrowRight
                                        size={16}
                                        className={cn(
                                            "transition-transform duration-300",
                                            isRTL ? "mr-3 rotate-180 group-hover:-translate-x-1" : "ml-3 group-hover:translate-x-1"
                                        )}
                                    />
                                </Link>
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
                        <Link to="/services/training" className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors">
                            View all programs <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRENDING_COURSES.map((course) => (
                            <a
                                key={course.id}
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-[#1A1F29] rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="h-48 relative overflow-hidden">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {course.badge}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                        <Clock size={12} /> {course.duration}
                                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                        <span className="text-blue-400">{course.level}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[56px] group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-sm font-bold text-slate-200">{course.rating}</span>
                                            <span className="text-xs text-slate-500">({course.reviews})</span>
                                        </div>
                                        <span className="text-xs font-bold text-white bg-white/5 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            Enroll
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION: OFFERS GRID */}
            <TrainingOffersSection />

            {/* SECTION: BENTO GRID FEATURES */}
            <TrainingBentoGrid />

            {/* SECTION: LEARNING PATH INFOGRAPHIC */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Career Roadmap</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">Your Journey to Expertise</h2>
                        <p className="text-slate-500 text-lg">We map out your growth from university to industry leadership.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 origin-left animate-[grow-width_3s_ease-out_forwards]" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Step 1 */}
                            <div className="relative group">
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-blue-500 rounded-full items-center justify-center z-10 shadow-lg shadow-blue-500/20 group-hover:scale-125 transition-transform duration-300">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 relative z-10">
                                        <BookOpen size={30} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">1. Foundation</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Master the basics of engineering simulation (ANSYS, SolidWorks) to ace your capstone projects.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative group mt-8 md:mt-0">
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-emerald-500 rounded-full items-center justify-center z-10 shadow-lg shadow-emerald-500/20 group-hover:scale-125 transition-transform duration-300 delay-100">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 relative z-10">
                                        <Target size={30} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">2. Certification</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Earn professional credentials (CFD, FEA) to demonstrate competency to top employers.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative group mt-16 md:mt-0">
                                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-purple-500 rounded-full items-center justify-center z-10 shadow-lg shadow-purple-500/20 group-hover:scale-125 transition-transform duration-300 delay-200">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 relative z-10">
                                        <Trophy size={30} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">3. Mastery</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Lead teams and innovation. Advanced corporate training to upskill entire departments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: REVIEWS & SOCIAL PROOF */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">What Our Graduates Say</h2>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-3 gap-6">
                        {REVIEWS.map((review, i) => (
                            <StaggerItem key={review.id} index={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                                <Quote size={24} className="text-slate-200 absolute top-6 right-6" />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-logo-codgray flex items-center justify-center text-white text-xs font-bold">
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
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to Start Learning?</h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
                        Join 500+ engineers who have advanced their careers with KITES training.
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                        Enroll in a Course
                        <ArrowRight size={18} className="ml-2" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Training;
