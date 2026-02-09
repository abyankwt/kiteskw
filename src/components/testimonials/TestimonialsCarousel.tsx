import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '@/data/testimonialsData';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

export function TestimonialsCarousel() {
    const { isRTL } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Slide variants for smooth animations
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    // Navigation functions
    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) return testimonials.length - 1;
            if (nextIndex >= testimonials.length) return 0;
            return nextIndex;
        });
    }, []);

    const nextSlide = useCallback(() => {
        paginate(isRTL ? -1 : 1);
    }, [paginate, isRTL]);

    const prevSlide = useCallback(() => {
        paginate(isRTL ? 1 : -1);
    }, [paginate, isRTL]);

    const goToSlide = useCallback((index: number) => {
        const newDirection = index > currentIndex ? 1 : -1;
        setDirection(newDirection);
        setCurrentIndex(index);
    }, [currentIndex]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(interval);
    }, [isAutoPlaying, isPaused, nextSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    return (
        <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Carousel Container */}
            <div className="relative h-auto min-h-[400px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                nextSlide();
                            } else if (swipe > swipeConfidenceThreshold) {
                                prevSlide();
                            }
                        }}
                        className="absolute w-full"
                    >
                        <TestimonialCard testimonial={testimonials[currentIndex]} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12",
                    "bg-white shadow-lg rounded-full p-3",
                    "hover:bg-gray-50 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "z-10"
                )}
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
                onClick={nextSlide}
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12",
                    "bg-white shadow-lg rounded-full p-3",
                    "hover:bg-gray-50 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "z-10"
                )}
                aria-label="Next testimonial"
            >
                <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            index === currentIndex
                                ? "bg-primary w-8"
                                : "bg-gray-300 hover:bg-gray-400"
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === currentIndex ? 'true' : 'false'}
                    />
                ))}
            </div>

            {/* Play/Pause Button */}
            <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={cn(
                    "absolute bottom-4 right-4",
                    "bg-white/80 backdrop-blur-sm rounded-full p-2",
                    "hover:bg-white transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "text-gray-600 hover:text-gray-900"
                )}
                aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
                {isAutoPlaying ? (
                    <Pause className="w-4 h-4" />
                ) : (
                    <Play className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}
