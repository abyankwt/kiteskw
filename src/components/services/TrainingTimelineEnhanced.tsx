import { useEffect, useRef, useState, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle2, Search, X, Users, Star, Award, MessageCircle, ExternalLink, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCourseMetadata, categoryColors } from "@/data/courseMetadata";
import { Button } from "@/components/ui/button";

interface TimelineItemProps {
    title: string;
    duration: string;
    description: string;
    outline: string[];
    index: number;
    isLast: boolean;
    who_should_attend?: string[];
    standards?: string;
}

const TimelineItem = ({ title, duration, description, outline, index, isLast, who_should_attend, standards }: TimelineItemProps) => {
    const { language } = useLanguage();
    const itemRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const isEven = index % 2 === 0;

    // Get course metadata
    const metadata = getCourseMetadata(title);
    const whatsappUrl = "https://wa.me/96522092260";
    const enrollMessage = `Hi, I'm interested in enrolling in the "${title}" course.`;

    // Render star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={cn(
                    "inline",
                    i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                )}
            />
        ));
    };

    return (
        <div ref={itemRef} className={cn(
            "timeline-item relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start w-full mb-24 md:mb-32 opacity-0",
            isEven ? "md:text-right" : "md:text-left"
        )}>
            {/* Center Line Dot */}
            <div className="absolute left-4 md:left-1/2 top-8 w-10 h-10 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-white border-4 shadow-lg timeline-dot transition-all duration-500 hover:scale-125"
                    style={{ borderColor: metadata.color }} />
            </div>

            {/* Content Side - Enhanced Card */}
            <div className={cn(
                "col-span-1 pl-12 md:pl-0",
                isEven ? "md:order-1 md:pr-16" : "md:order-2 md:pl-16"
            )}>
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-slate-300 group" style={{ borderColor: `${metadata.color}20` }}>
                    <div className="p-6 lg:p-8">
                        {/* Category & Level Badges */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: metadata.color }}
                            >
                                {metadata.category}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                {metadata.level}
                            </span>
                            {metadata.certified && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                                    <Award size={12} />
                                    Certified
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">
                            {title}
                        </h3>

                        {/* Rating & Stats */}
                        <div className="flex items-center gap-4 mb-4 flex-wrap text-sm">
                            <div className="flex items-center gap-1">
                                {renderStars(metadata.rating)}
                                <span className="font-bold text-slate-900 ml-1">{metadata.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                                <Users size={14} />
                                <span>{metadata.enrollmentCount.toLocaleString()} enrolled</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 mb-4 text-sm">
                            <Clock size={16} style={{ color: metadata.color }} />
                            <span className="font-medium text-slate-700">{duration}</span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 leading-relaxed mb-6">
                            {description.substring(0, 180)}...
                        </p>

                        {/* Key Points */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                                <BookOpen size={14} />
                                {language === 'en' ? 'What You\'ll Learn' : 'ما ستتعلمه'}
                            </h4>
                            <ul className="space-y-2">
                                {outline.slice(0, 3).map((topic, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: metadata.color }} />
                                        <span>{topic.split(':')[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <a
                                href={`${whatsappUrl}?text=${encodeURIComponent(enrollMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button
                                    className="w-full font-bold"
                                    style={{ backgroundColor: metadata.color }}
                                >
                                    <MessageCircle size={18} className="mr-2" />
                                    {language === 'en' ? 'Enroll Now' : 'سجل الآن'}
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Side - Course Image */}
            <div className={cn(
                "hidden md:flex flex-col justify-center",
                isEven ? "md:order-2 md:pl-16" : "md:order-1 md:pr-16"
            )}>
                <div
                    ref={imageRef}
                    className="w-full max-w-sm h-72 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 relative group cursor-pointer border-4 border-white"
                >
                    <img
                        src={metadata.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="text-white">
                            <TrendingUp size={16} className="mb-2" />
                            <p className="text-sm font-bold">{language === 'en' ? 'Click to preview' : 'انقر للمعاينة'}</p>
                        </div>
                    </div>

                    {/* Fallback */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <BookOpen size={64} className="text-slate-300" />
                    </div>

                    {/* Hot Badge */}
                    {metadata.enrollmentCount > 1000 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            🔥 Hot
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const TrainingTimelineEnhanced = ({ courses }: { courses: any[] }) => {
    const { language } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Extract categories from metadata
    const categories = useMemo(() => {
        const categorySet = new Set<string>();
        courses.forEach((course) => {
            const metadata = getCourseMetadata(course.title);
            categorySet.add(metadata.category);
        });
        return Array.from(categorySet).sort();
    }, [courses]);

    // Filter courses
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchQuery === "" ||
                course.title.toLowerCase().includes(searchLower) ||
                course.description.toLowerCase().includes(searchLower);

            const metadata = getCourseMetadata(course.title);
            const matchesCategory = selectedCategory === "all" || metadata.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [courses, searchQuery, selectedCategory]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (lineRef.current && filteredCourses.length > 0) {
                gsap.fromTo(lineRef.current,
                    { height: "0%" },
                    {
                        height: "100%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top center",
                            end: "bottom center",
                            scrub: 1
                        }
                    }
                );
            }

            const items = gsap.utils.toArray(".timeline-item");
            items.forEach((item: any) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [filteredCourses]);

    return (
        <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden" id="curriculum">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto mb-12 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        {language === 'en' ? 'Professional Training Catalog' : 'كتالوج التدريب المهني'}
                    </h2>
                    <p className="text-xl text-slate-600">
                        {language === 'en'
                            ? 'Industry-certified courses to elevate your engineering expertise'
                            : 'دورات معتمدة من الصناعة لرفع مستوى خبرتك الهندسية'}
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="max-w-4xl mx-auto mb-16 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={language === 'en' ? 'Search courses...' : 'البحث...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={cn(
                                "px-6 py-3 rounded-full text-sm font-bold shadow-sm",
                                selectedCategory === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border-2"
                            )}
                        >
                            All ({courses.length})
                        </button>
                        {categories.map((cat) => {
                            const count = courses.filter(c => getCourseMetadata(c.title).category === cat).length;
                            const color = categoryColors[cat] || "#6b7280";

                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="px-6 py-3 rounded-full text-sm font-bold shadow-sm border-2"
                                    style={{
                                        backgroundColor: selectedCategory === cat ? color : '#fff',
                                        color: selectedCategory === cat ? '#fff' : '#334155',
                                        borderColor: selectedCategory === cat ? color : '#e2e8f0'
                                    }}
                                >
                                    {cat} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline */}
                <div ref={containerRef} className="relative max-w-6xl mx-auto">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2">
                        <div ref={lineRef} className="w-full bg-gradient-to-b from-slate-900 to-slate-600 origin-top" />
                    </div>

                    {filteredCourses.map((course, index) => (
                        <TimelineItem key={index} {...course} index={index} isLast={index === filteredCourses.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
};
