import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { servicesDetailData } from '@/data/serviceDetailData';
import { cn } from '@/lib/utils';

interface ServicesMegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

// Map service IDs to the order requested
const SERVICE_ORDER = [
    'consultation',
    'software-distribution',
    'prototype-development',
    'environmental-consulting'
];

// Category labels for each service
const CATEGORY_LABELS = {
    'consultation': {
        en: 'CONSULTING',
        ar: 'استشارات'
    },
    'software-distribution': {
        en: 'SOFTWARE',
        ar: 'برمجيات'
    },
    'prototype-development': {
        en: 'DEVELOPMENT',
        ar: 'تطوير'
    },
    'environmental-consulting': {
        en: 'ENVIRONMENT',
        ar: 'بيئة'
    }
} as const;

export function ServicesMegaMenu({ isOpen, onClose }: ServicesMegaMenuProps) {
    const { language, isRTL } = useLanguage();

    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full left-0 w-full bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border-t-2 border-black z-50 animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {/* Cards Grid with Dividers */}
                <div className="md:grid flex flex-col md:grid-cols-4 gap-0 md:divide-x divide-gray-200">
                    {SERVICE_ORDER.map((id, index) => {
                        const service = servicesDetailData[id];
                        if (!service) return null;

                        const content = service[language];
                        const Icon = service.icon;
                        const categoryLabel = CATEGORY_LABELS[id as keyof typeof CATEGORY_LABELS][language];

                        return (
                            <Link
                                key={id}
                                to={`/services/${id}`}
                                onClick={onClose}
                                className="group relative flex flex-col gap-5 px-8 py-6 bg-white hover:bg-gray-50 transition-all duration-300 border-b md:border-b-0 border-gray-100 last:border-b-0 hover:shadow-lg"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Hover Left Border Accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                                {/* Category Label with Icon */}
                                <div className="flex items-center gap-4">
                                    {/* Larger Service Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300 shadow-sm flex-shrink-0">
                                        <Icon size={24} strokeWidth={2.5} />
                                    </div>
                                    {/* Larger Category Label */}
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700 group-hover:text-black transition-colors">
                                        {categoryLabel}
                                    </span>
                                </div>

                                {/* Title - More Spacing */}
                                <h3 className="font-heading text-lg font-bold text-gray-900 leading-tight group-hover:text-black transition-colors">
                                    {content.head.title}
                                </h3>

                                {/* Description - Better Line Height */}
                                <p className="font-body text-sm text-gray-600 leading-relaxed line-clamp-3 group-hover:text-gray-800 transition-colors min-h-[63px]">
                                    {content.head.subtitle}
                                </p>

                                {/* Link Action with Better Spacing */}
                                <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-black transition-colors">
                                    <span>{language === 'ar' ? "التفاصيل" : "Learn more"}</span>
                                    <ArrowRight size={16} className={cn("transition-transform group-hover:translate-x-1.5", isRTL ? "rotate-180 group-hover:-translate-x-1.5" : "")} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Services Link */}
                <div className="text-center pt-12 mt-8 border-t border-gray-100">
                    <Link
                        to="/services"
                        onClick={onClose}
                        className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors group"
                    >
                        <span>{language === 'ar' ? "عرض جميع الخدمات" : "View All Services"}</span>
                        <ArrowRight size={18} className={cn("transition-transform group-hover:translate-x-1", isRTL ? "rotate-180 group-hover:-translate-x-1" : "")} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
