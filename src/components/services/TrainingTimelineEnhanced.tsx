import { useEffect, useRef, useState, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle2, Search, X, Users, Star, Award, MessageCircle, ExternalLink, TrendingUp, Grid3x3, List, ChevronDown, Filter } from "lucide-react";
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
            "timeline-item relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start w-full mb-24 md:mb-32",
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
                    className="w-full max-w-md h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 relative group cursor-pointer border-4 border-white"
                >
                    <img
                        src={metadata.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                        onLoad={() => {
                            console.log('✅ Image loaded successfully:', metadata.image, 'for course:', title);
                        }}
                        onError={(e) => {
                            console.error('❌ Image failed to load:', metadata.image, 'for course:', title);
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 z-20">
                        <div className="text-white">
                            <TrendingUp size={16} className="mb-2" />
                            <p className="text-sm font-bold">{language === 'en' ? 'Click to preview' : 'انقر للمعاينة'}</p>
                        </div>
                    </div>

                    {/* Fallback */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center z-0">
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
    const sectionRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
    const [isSticky, setIsSticky] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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

    // Scroll listener for sticky search
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            // 132px is the top offset used in the style prop (calc(5rem + 3.25rem))
            // We want to stick when the section top reaches this point
            const shouldStick = rect.top <= 140; // slightly more than 132 to catch it smoothly

            setIsSticky(shouldStick);
            if (shouldStick) {
                setShowCategoryDropdown(false); // Close dropdown when scrolling
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };

        if (showCategoryDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showCategoryDropdown]);

    useEffect(() => {
        // Only run GSAP animations in timeline view
        if (viewMode !== 'timeline') return;

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
    }, [filteredCourses, viewMode]);

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white via-slate-50 to-white" id="curriculum">
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

                {/* Sticky Search and Filters */}
                <div
                    className={cn(
                        "z-50 max-w-4xl mx-auto transition-all duration-300",
                        isSticky ? "fixed left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl py-3 px-4 md:px-6 mb-0" : "relative mb-16 space-y-6"
                    )}
                    style={isSticky ? {
                        top: 'calc(5rem + 3.25rem)', // tab-nav top (80px) + tab-nav height (52px) = 132px
                        maxWidth: '56rem', // max-w-4xl equivalent
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    } : undefined}
                >
                    <div className={cn(
                        "flex flex-col gap-4",
                        isSticky && "md:flex-row md:items-center md:gap-3"
                    )}>
                        {/* Search */}
                        <div className={cn("relative", isSticky ? "md:flex-1" : "")}>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={isSticky ? 16 : 20} />
                            <input
                                type="text"
                                placeholder={language === 'en' ? 'Search courses...' : 'البحث...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm",
                                    isSticky ? "pl-10 pr-10 py-2 text-sm" : "pl-12 pr-12 py-5"
                                )}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <X size={isSticky ? 16 : 20} />
                                </button>
                            )}
                        </div>

                        {/* Category Filters */}
                        {!isSticky ? (
                            // Show all categories when NOT sticky
                            <div className="flex flex-wrap gap-2 justify-center">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={cn(
                                        "rounded-full font-bold shadow-sm whitespace-nowrap px-6 py-3 text-sm",
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
                                            className="rounded-full font-bold shadow-sm border-2 whitespace-nowrap px-6 py-3 text-sm"
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
                        ) : (
                            // Show dropdown when sticky
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                                >
                                    <Filter size={14} />
                                    {selectedCategory === "all" ? `All (${courses.length})` : `${selectedCategory} (${courses.filter(c => getCourseMetadata(c.title).category === selectedCategory).length})`}
                                    <ChevronDown size={14} className={cn("transition-transform", showCategoryDropdown && "rotate-180")} />
                                </button>

                                {/* Dropdown Menu */}
                                {showCategoryDropdown && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-lg z-50 min-w-[200px] max-h-[400px] overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("all");
                                                setShowCategoryDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors border-b border-slate-100",
                                                selectedCategory === "all" && "bg-slate-900 text-white hover:bg-slate-800"
                                            )}
                                        >
                                            All Courses ({courses.length})
                                        </button>
                                        {categories.map((cat) => {
                                            const count = courses.filter(c => getCourseMetadata(c.title).category === cat).length;
                                            const color = categoryColors[cat] || "#6b7280";

                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0",
                                                        selectedCategory === cat && "font-bold"
                                                    )}
                                                    style={{
                                                        backgroundColor: selectedCategory === cat ? color : 'transparent',
                                                        color: selectedCategory === cat ? '#fff' : '#334155',
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{cat}</span>
                                                        <span className={cn(
                                                            "text-xs px-2 py-0.5 rounded-full",
                                                            selectedCategory === cat ? "bg-white/20" : "bg-slate-100"
                                                        )}>
                                                            {count}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* View Toggle */}
                        <div className="flex items-center justify-center gap-2">
                            <span className={cn(
                                "text-slate-600 font-medium",
                                isSticky ? "text-xs" : "text-sm mr-2"
                            )}>
                                {language === 'en' ? 'View:' : 'العرض:'}
                            </span>
                            <button
                                onClick={() => setViewMode('timeline')}
                                title={language === 'en' ? 'Timeline View' : 'عرض الجدول الزمني'}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg font-medium transition-all",
                                    isSticky ? "px-2.5 py-1.5" : "px-4 py-2 text-sm",
                                    viewMode === 'timeline'
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <List size={isSticky ? 16 : 18} />
                                {!isSticky && (language === 'en' ? 'Timeline' : 'الجدول الزمني')}
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                title={language === 'en' ? 'Grid View' : 'عرض الشبكة'}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg font-medium transition-all",
                                    isSticky ? "px-2.5 py-1.5" : "px-4 py-2 text-sm",
                                    viewMode === 'grid'
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <Grid3x3 size={isSticky ? 16 : 18} />
                                {!isSticky && (language === 'en' ? 'Grid' : 'الشبكة')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add spacing when sticky to prevent content jumping */}
                {isSticky && <div style={{ height: '80px' }} />}

                {/* Timeline View */}
                {
                    viewMode === 'timeline' && (
                        <div ref={containerRef} className="relative max-w-6xl mx-auto">
                            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2">
                                <div ref={lineRef} className="w-full bg-gradient-to-b from-slate-900 to-slate-600 origin-top" />
                            </div>

                            {filteredCourses.map((course, index) => (
                                <TimelineItem key={index} {...course} index={index} isLast={index === filteredCourses.length - 1} />
                            ))}
                        </div>
                    )
                }

                {/* Grid View */}
                {
                    viewMode === 'grid' && (
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course, index) => {
                                const metadata = getCourseMetadata(course.title);
                                const whatsappUrl = "https://wa.me/96522092260";
                                const enrollMessage = `Hi, I'm interested in enrolling in the "${course.title}" course.`;

                                const renderStars = (rating: number) => {
                                    return Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={cn(
                                                "inline",
                                                i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                                            )}
                                        />
                                    ));
                                };

                                return (
                                    <div
                                        key={index}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-slate-300"
                                    >
                                        {/* Compact Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={metadata.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                                                onLoad={() => {
                                                    console.log('✅ Grid image loaded:', metadata.image, 'for:', course.title);
                                                }}
                                                onError={(e) => {
                                                    console.error('❌ Grid image failed:', metadata.image, 'for:', course.title);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            {/* Fallback */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center z-0">
                                                <BookOpen size={48} className="text-slate-300" />
                                            </div>

                                            {/* Category Badge */}
                                            <div
                                                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                                                style={{ backgroundColor: categoryColors[metadata.category] || "#6b7280" }}
                                            >
                                                {metadata.category}
                                            </div>

                                            {/* Certification Badge */}
                                            {metadata.certified && (
                                                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                                                    <Award size={12} />
                                                    {language === 'en' ? 'Certified' : 'معتمد'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 space-y-3">
                                            {/* Title */}
                                            <h3 className="font-heading text-lg font-bold text-slate-900 line-clamp-2 min-h-[3.5rem]">
                                                {course.title}
                                            </h3>

                                            {/* Stats Row */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(metadata.rating)}
                                                    <span className="ml-1 text-slate-600 font-semibold">{metadata.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Users size={14} />
                                                    <span className="text-xs">{metadata.enrollmentCount}</span>
                                                </div>
                                            </div>

                                            {/* Duration & Level */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Clock size={14} />
                                                    <span className="text-xs">{course.duration}</span>
                                                </div>
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-bold"
                                                    style={{
                                                        backgroundColor: `${categoryColors[metadata.category]}20`,
                                                        color: categoryColors[metadata.category]
                                                    }}
                                                >
                                                    {metadata.level}
                                                </span>
                                            </div>

                                            {/* CTA */}
                                            <a
                                                href={`${whatsappUrl}?text=${encodeURIComponent(enrollMessage)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                                            >
                                                <MessageCircle size={16} />
                                                {language === 'en' ? 'Enroll Now' : 'تسجيل الآن'}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
            </div >
        </section >
    );
};
