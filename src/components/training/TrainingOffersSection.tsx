import { ArrowRight, Briefcase, GraduationCap, Users, Zap } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size: number }>> = {
    corporate: Briefcase,
    student: GraduationCap,
    earlybird: Zap,
    alumni: Users,
};

const COLOR_MAP: Record<number, { gradient: string; badge: string }> = {
    0: { gradient: 'from-blue-500 to-indigo-600',   badge: 'bg-blue-50 text-blue-600 border-blue-100' },
    1: { gradient: 'from-emerald-500 to-teal-600',  badge: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    2: { gradient: 'from-blue-400 to-blue-600',     badge: 'bg-blue-50 text-blue-700 border-blue-100' },
    3: { gradient: 'from-amber-500 to-orange-600',  badge: 'bg-amber-50 text-amber-700 border-amber-100' },
};

interface OfferItem {
    id: string;
    title: string;
    discount: string;
    description: string;
}

interface TrainingOffersSectionProps {
    tagline?: string;
    heading?: string;
    items?: OfferItem[];
}

const DEFAULT_OFFERS: OfferItem[] = [
    { id: "corporate", title: "Corporate Bundle",  discount: "20% OFF",      description: "Ideal for companies upskilling their engineering teams. Valid for groups of 5+." },
    { id: "student",   title: "Student Special",   discount: "Flat 50% OFF", description: "Valid for university students with a valid ID card. Start your career strong." },
    { id: "earlybird", title: "Early Bird",        discount: "10% OFF",      description: "Book any course 30 days in advance and secure your seat with a discount." },
    { id: "alumni",    title: "KITES Alumni",      discount: "15% OFF",      description: "Return for another course and get a loyalty discount. Keep learning." },
];

export function TrainingOffersSection({
    tagline = 'Unlock Savings',
    heading = 'Exclusive Offers & Discounts',
    items = DEFAULT_OFFERS,
}: TrainingOffersSectionProps = {}) {
    const whatsappUrl = "https://wa.me/96522092260";

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/50 skew-x-12 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">{tagline}</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{heading}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((offer, i) => {
                        const Icon = ICON_MAP[offer.id] ?? Briefcase;
                        const colors = COLOR_MAP[i % 4];
                        return (
                            <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center text-white bg-gradient-to-br ${colors.gradient} shadow-md`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-grow">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border ${colors.badge}`}>
                                        {offer.discount}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{offer.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{offer.description}</p>
                                </div>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto w-full py-3 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm bg-slate-50 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2"
                                >
                                    Claim Offer <ArrowRight size={14} />
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
