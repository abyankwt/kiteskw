import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { ArrowRight, Star, Clock, Users, Trophy, Sparkles, CheckCircle2, Quote, BookOpen, Target, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Mock Data for Trending Courses
const TRENDING_COURSES = [
    {
        id: 1,
        title: "Advanced FEA with Abaqus",
        category: "Simulation",
        rating: 4.9,
        reviews: 128,
        duration: "6 Weeks",
        level: "Advanced",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1581094794329-cd2d2dec5d5a?q=80&w=2070&auto=format&fit=crop",
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

const Training = () => {
    const { language, isRTL } = useLanguage();

    // Animation Refs
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

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

    return (
        <div className="bg-[#0B0F14] min-h-screen">
            <SEO page="training" />
            <SkipLink />

            {/* SECTION 1: CINEMATIC HERO */}
            <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Video/Image Placeholder - Dark & Techy */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#0B0F14]/80 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1517077304055-6e89abbec697?q=80&w=2076&auto=format&fit=crop"
                        alt="Engineering Training"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent z-20" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <Sparkles size={12} />
                        <span>Upgrade Your Career</span>
                    </div>

                    <h1 ref={titleRef} className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                        Master The Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Engineering Simulation
                        </span>
                    </h1>

                    <p className="font-body text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Industry-recognized certification programs designed to transform engineers into technical leaders.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/contact?service=training"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-[#0B0F14] font-bold text-sm uppercase tracking-wider rounded hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Enroll Now
                        </Link>
                        <a
                            href="#featured-courses"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-white/5 transition-all"
                        >
                            View Courses
                        </a>
                    </div>

                    {/* Trust Stats */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16 opacity-70">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">500+</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Graduates</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">50+</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Organizations</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">4.9/5</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Student Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: SPECIAL OFFERS BANNER */}
            <section className="bg-gradient-to-r from-blue-900 to-indigo-900 border-y border-white/10 py-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none" />
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Sparkles size={18} className="text-yellow-400" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-bold text-sm sm:text-base">Corporate Training Bundle</h3>
                            <p className="text-blue-200 text-xs sm:text-sm">Get 20% off when enrolling 5+ engineers.</p>
                        </div>
                    </div>
                    <Link to="/contact" className="text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors whitespace-nowrap">
                        Claim Offer &rarr;
                    </Link>
                </div>
            </section>

            {/* SECTION 3: FEATURED / TRENDING COURSES */}
            <section id="featured-courses" className="py-24 bg-[#0F131A]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Top Selling</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Trending Courses</h2>
                        </div>
                        <Link to="/courses" className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors">
                            View all programs <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRENDING_COURSES.map((course) => (
                            <Link key={course.id} to="/contact?service=training" className="group bg-[#1A1F29] rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
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
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: INFOGRAPHIC LEARNING PATH */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Your Path to Expertise</h2>
                        <p className="text-slate-500 text-lg">We support your journey from academic foundation to industry leadership.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-slate-100 -z-10" />

                        {/* Step 1 */}
                        <div className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto md:mx-0">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">1. Student</h3>
                            <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
                                Master the basics of engineering simulation (ANSYS, SolidWorks) to ace your capstone projects and become job-ready.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 delay-100 relative z-10">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 mx-auto md:mx-0">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">2. Professional</h3>
                            <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
                                Earn professional certifications and specialized skills (CFD, FEA) to handle complex industrial challenges and get promoted.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 delay-200">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 mx-auto md:mx-0">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">3. Expert</h3>
                            <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
                                Lead teams and innovation. Custom corporate training to upskill your entire department and drive ROI.
                            </p>
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
                    <Link
                        to="/contact?service=training"
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                        Enroll in a Course
                        <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Training;
