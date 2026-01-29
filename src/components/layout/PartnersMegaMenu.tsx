import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Zap, Factory, HardHat, Building2, Beaker, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { partners, Partner } from '@/data/partners';
import { cn } from '@/lib/utils';

interface PartnersMegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

// Partner Categories
type Category = 'engineering' | 'sustainability' | 'research' | 'manufacturing';

const CATEGORIES: { id: Category; labelEn: string; labelAr: string; icon: any }[] = [
    { id: 'engineering', labelEn: 'Engineering Software', labelAr: 'برمجيات هندسية', icon: Zap },
    { id: 'sustainability', labelEn: 'Sustainability Solutions', labelAr: 'حلول الاستدامة', icon: ShieldCheck },
    { id: 'research', labelEn: 'Research & Analytics', labelAr: 'البحث والتحليلات', icon: Beaker },
    { id: 'manufacturing', labelEn: 'Advanced Manufacturing', labelAr: 'التصنيع المتقدم', icon: Factory },
];

export function PartnersMegaMenu({ isOpen, onClose }: PartnersMegaMenuProps) {
    const { language, isRTL } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<Category>('engineering');

    if (!isOpen) return null;

    // Filter partners by active category
    const activePartners = partners.filter(p => p.category === activeCategory);

    return (
        <div
            className="absolute top-full inset-x-0 bg-white shadow-xl border-t border-slate-100 py-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ease-out"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-6 lg:gap-8">

                    {/* Left Column: Categories List */}
                    <div className="col-span-3 flex flex-col space-y-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={cn(
                                    "group flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors duration-200 w-full text-left rounded-md",
                                    activeCategory === cat.id
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                                onMouseEnter={() => setActiveCategory(cat.id)}
                            >
                                <div className="flex items-center gap-2.5">
                                    <cat.icon
                                        size={16}
                                        className={cn(
                                            activeCategory === cat.id ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                                        )}
                                        strokeWidth={1.5}
                                    />
                                    <span className="tracking-wide">
                                        {language === 'ar' ? cat.labelAr : cat.labelEn}
                                    </span>
                                </div>
                                {activeCategory === cat.id && (
                                    <ChevronRight size={14} className={cn("text-white", isRTL ? "rotate-180" : "")} />
                                )}
                            </button>
                        ))}

                        <Link
                            to="/partners"
                            onClick={onClose}
                            className="mt-4 px-3 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
                        >
                            {language === 'ar' ? "عرض جميع الشركاء" : "View all partners"}
                            <ArrowRight size={12} className={cn("transition-transform duration-200", isRTL ? "rotate-180" : "")} />
                        </Link>
                    </div>

                    {/* Right Column: Logo Grid Context Panel */}
                    <div className="col-span-9 bg-slate-50/50 rounded-lg p-6 border border-slate-100 min-h-[260px]">
                        <div className="flex flex-col h-full">
                            <h3 className="font-heading text-xs font-bold text-slate-400 mb-5 tracking-widest uppercase">
                                {language === 'ar' ? "الشركاء المعتمدون" : "Authorized Partners"}
                            </h3>

                            {/* Grid of Logos */}
                            <div className="grid grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in duration-200" key={activeCategory}>
                                {activePartners.map((partner) => (
                                    <Link
                                        key={partner.id}
                                        to={`/partners/${partner.id}`}
                                        onClick={onClose}
                                        className="group relative bg-white p-4 rounded-lg border border-slate-200/60 hover:border-blue-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center aspect-[3/2] overflow-hidden"
                                    >
                                        {partner.logo ? (
                                            <img
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="w-full h-full object-contain p-1 transition-all duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 text-center">{partner.name}</span>
                                        )}
                                    </Link>
                                ))}
                                {activePartners.length === 0 && (
                                    <div className="col-span-5 text-center py-10 text-slate-400 text-sm">
                                        {language === 'ar' ? "لا يوجد شركاء في هذه الفئة حاليا" : "No partners available in this category."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
