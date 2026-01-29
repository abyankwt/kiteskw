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
    'training'
];

export function ServicesMegaMenu({ isOpen, onClose }: ServicesMegaMenuProps) {
    const { language, isRTL } = useLanguage();

    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full left-0 w-full bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border-t border-slate-100 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="md:grid flex flex-col md:grid-cols-4 gap-6 lg:gap-10">
                    {SERVICE_ORDER.map((id, index) => {
                        const service = servicesDetailData[id];
                        if (!service) return null;

                        const content = service[language];
                        const Icon = service.icon;

                        return (
                            <Link
                                key={id}
                                to={`/services/${id}`}
                                onClick={onClose}
                                className="group flex flex-col items-start gap-4 p-5 -m-5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Icon Container */}
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm">
                                    <Icon size={20} strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                        {content.head.title}
                                    </h3>
                                    <p className="font-body text-xs text-slate-500 leading-relaxed line-clamp-2">
                                        {content.head.subtitle}
                                    </p>
                                </div>

                                {/* Link Action */}
                                <div className="mt-auto pt-3 flex items-center text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                                    <span>{language === 'ar' ? "التفاصيل" : "Learn more"}</span>
                                    <ArrowRight size={14} className={cn("ml-1.5 transition-transform group-hover:translate-x-0.5", isRTL ? "rotate-180 mr-1.5 ml-0 group-hover:-translate-x-0.5" : "")} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer/Prompt - Centered & Styled */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-center">
                    <Link
                        to="/services"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors py-2 px-4 rounded-full hover:bg-slate-50"
                    >
                        <span>{language === 'ar' ? "عرض جميع الخدمات" : "View Services Overview"}</span>
                        <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
