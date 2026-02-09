import { Quote } from 'lucide-react';
import { Testimonial } from '@/data/testimonialsData';
import { StarRating } from './StarRating';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
    testimonial: Testimonial;
    className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
    const { language } = useLanguage();

    return (
        <div className={cn(
            "bg-white rounded-xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300",
            "border border-gray-100",
            className
        )}>
            {/* Quote Icon */}
            <div className="mb-6">
                <Quote className="w-10 h-10 text-primary/20" />
            </div>

            {/* Quote Text */}
            <blockquote className="mb-6">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-serif italic">
                    "{testimonial.quote[language]}"
                </p>
            </blockquote>

            {/* Star Rating */}
            <div className="mb-6">
                <StarRating rating={testimonial.rating} size={18} />
            </div>

            {/* Client Info */}
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={testimonial.photo}
                        alt={testimonial.clientName[language]}
                        className="w-14 h-14 rounded-full object-cover bg-gray-200"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900">
                        {testimonial.clientName[language]}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                        {testimonial.clientTitle[language]}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {testimonial.company[language]}
                    </p>
                    {testimonial.location && (
                        <p className="text-xs text-gray-400 mt-1">
                            {testimonial.location[language]}
                        </p>
                    )}
                </div>
            </div>

            {/* Optional Project Tag */}
            {testimonial.project && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-block text-xs font-medium text-primary bg-primary/5 px-3 py-1 rounded-full">
                        {testimonial.project[language]}
                    </span>
                </div>
            )}
        </div>
    );
}
