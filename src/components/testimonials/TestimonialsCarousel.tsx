import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';
import { StarRating } from './StarRating';
import { testimonials as staticTestimonials } from '@/data/testimonialsData';
import { usePublishedTestimonials, type Testimonial as ApiTestimonial } from '@/hooks/useTestimonials';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const AUTO_PLAY_INTERVAL = 5000;

function ApiTestimonialCard({ t }: { t: ApiTestimonial }) {
  return (
    <div className="bg-white rounded-xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="mb-6">
        <Quote className="w-10 h-10 text-primary/20" />
      </div>
      <blockquote className="mb-6">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-serif italic">
          "{t.content}"
        </p>
      </blockquote>
      <div className="mb-6">
        <StarRating rating={t.rating} size={18} />
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {t.avatarUrl ? (
            <img src={t.avatarUrl} alt={t.clientName} className="w-14 h-14 rounded-full object-cover bg-gray-200" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
              {t.clientName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900">{t.clientName}</p>
          {t.clientRole && <p className="text-sm text-gray-600 mt-0.5">{t.clientRole}</p>}
          {t.clientCompany && <p className="text-sm text-gray-500 mt-0.5">{t.clientCompany}</p>}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
    const { isRTL, language } = useLanguage();
    const { data: apiTestimonials = [] } = usePublishedTestimonials('homepage');
    const useApiData = apiTestimonials.length > 0;
    const itemCount = useApiData ? apiTestimonials.length : staticTestimonials.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Reset index when data source changes
    useEffect(() => { setCurrentIndex(0); }, [useApiData]);

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
    const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) return itemCount - 1;
            if (nextIndex >= itemCount) return 0;
            return nextIndex;
        });
    }, [itemCount]);

    const nextSlide = useCallback(() => paginate(isRTL ? -1 : 1), [paginate, isRTL]);
    const prevSlide = useCallback(() => paginate(isRTL ? 1 : -1), [paginate, isRTL]);

    const goToSlide = useCallback((index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    useEffect(() => {
        if (!isAutoPlaying || isPaused) return;
        const interval = setInterval(() => { nextSlide(); }, AUTO_PLAY_INTERVAL);
        return () => clearInterval(interval);
    }, [isAutoPlaying, isPaused, nextSlide]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide();
            else if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    if (itemCount === 0) return null;

    const safeIndex = Math.min(currentIndex, itemCount - 1);

    return (
        <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative h-auto min-h-[400px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={safeIndex}
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
                            if (swipe < -swipeConfidenceThreshold) nextSlide();
                            else if (swipe > swipeConfidenceThreshold) prevSlide();
                        }}
                        className="absolute w-full"
                    >
                        {useApiData
                            ? <ApiTestimonialCard t={apiTestimonials[safeIndex]} />
                            : <TestimonialCard testimonial={staticTestimonials[safeIndex]} />
                        }
                    </motion.div>
                </AnimatePresence>
            </div>

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

            <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: itemCount }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            index === safeIndex
                                ? "bg-primary w-8"
                                : "bg-gray-300 hover:bg-gray-400"
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === safeIndex ? 'true' : 'false'}
                    />
                ))}
            </div>

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
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
        </div>
    );
}
