import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, Clock, MessageCircle, Users, TrendingUp, Flame } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CourseAvailabilityBadge } from './CourseAvailabilityBadge';

interface CourseCardProps {
    course: {
        id: number | string;
        title: string;
        category: string;
        rating: number;
        reviews: number;
        duration: string;
        level: string;
        image: string;
        badge: string;
        price: string;
    };
    whatsappUrl: string;
    index: number;
    /** When provided, renders as a button and calls onEnroll(courseId) instead of opening WhatsApp */
    onEnroll?: (courseId: string) => void;
}

export const EnhancedCourseCard = ({ course, whatsappUrl, index, onEnroll }: CourseCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const cardRef = useRef<HTMLElement>(null);

    // 3D Tilt Effect — element-agnostic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
        stiffness: 300,
        damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
        stiffness: 300,
        damping: 30,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
        setShowPreview(false);
    };

    // Simulated recent enrollment count
    const recentEnrollments = Math.floor(Math.random() * 15) + 5;

    const badgeVariants: Record<string, string> = {
        'Best Seller': 'bg-blue-600/90',
        'Certification': 'bg-emerald-600/90',
        'Trending': 'bg-orange-600/90',
        'New': 'bg-purple-600/90',
    };

    const innerContent = (
        <motion.div
            className="bg-[#1A1F29] rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 relative"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Container */}
            <div className="h-48 relative overflow-hidden">
                <motion.img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge */}
                <motion.div
                    className={cn(
                        'absolute top-3 left-3 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded',
                        badgeVariants[course.badge] || 'bg-blue-600/90'
                    )}
                    animate={course.badge === 'Trending' ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {course.badge === 'Trending' && <Flame size={10} className="inline mr-1" />}
                    {course.badge}
                </motion.div>

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                    <CourseAvailabilityBadge
                        variant={index % 3 === 0 ? 'limited' : index % 3 === 1 ? 'filling' : 'popular'}
                        seatsLeft={index % 3 === 0 ? Math.floor(Math.random() * 5) + 3 : undefined}
                    />
                </div>

                {/* Hover Shine Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                    animate={isHovered ? { translateX: '200%' } : {}}
                    transition={{ duration: 0.8 }}
                />
            </div>

            {/* Content */}
            <div className="p-5 relative">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Clock size={12} />
                    <span>{course.duration}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="text-blue-400">{course.level}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[56px] group-hover:text-blue-400 transition-colors">
                    {course.title}
                </h3>

                <motion.div
                    className="flex items-center gap-1.5 text-xs text-emerald-400 mb-3 bg-emerald-500/10 px-2 py-1 rounded-md"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <TrendingUp size={12} />
                    <span>{recentEnrollments} enrolled in last 24 hrs</span>
                </motion.div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-slate-200">{course.rating}</span>
                        <span className="text-xs text-slate-500">({course.reviews})</span>
                    </div>
                    <motion.span
                        className="text-xs font-bold text-white bg-white/5 px-3 py-1.5 rounded-md group-hover:bg-[#25D366] group-hover:text-white transition-colors flex items-center gap-1.5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <MessageCircle size={12} />
                        Enroll Now
                    </motion.span>
                </div>
            </div>

            {/* Quick Preview Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#1A1F29] via-[#1A1F29]/95 to-transparent pointer-events-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showPreview ? 1 : 0, y: showPreview ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 10 }}
            >
                {showPreview && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                        <h4 className="text-white font-bold text-sm mb-2">What You'll Learn:</h4>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span>Industry-standard tools & techniques</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span>Hands-on projects & real-world scenarios</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span>Certificate upon completion</span>
                            </li>
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* Glow Effect */}
            <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 blur-lg -z-10"
                animate={{ opacity: isHovered ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );

    const commonMotionProps = {
        className: 'group relative block',
        style: { perspective: 1000 } as any,
        onMouseMove: handleMouseMove as any,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: handleMouseLeave,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
    };

    if (onEnroll) {
        return (
            <motion.div
                ref={cardRef as React.Ref<HTMLDivElement>}
                onClick={() => onEnroll(String(course.id))}
                {...commonMotionProps}
                style={{ ...commonMotionProps.style, cursor: 'pointer' }}
            >
                {innerContent}
            </motion.div>
        );
    }

    return (
        <motion.a
            ref={cardRef as React.Ref<HTMLAnchorElement>}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...commonMotionProps}
        >
            {innerContent}
        </motion.a>
    );
};
