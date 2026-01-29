import { ArrowRight, Briefcase, GraduationCap, Users, Zap } from "lucide-react";

const OFFERS = [
    {
        id: "corporate",
        title: "Corporate Bundle",
        discount: "20% OFF",
        description: "Ideal for companies upskilling their engineering teams. Valid for groups of 5+.",
        icon: Briefcase,
        color: "blue",
        gradient: "from-blue-500 to-indigo-600"
    },
    {
        id: "student",
        title: "Student Special",
        discount: "Flat 50% OFF",
        description: "Valid for university students with a valid ID card. Start your career strong.",
        icon: GraduationCap,
        color: "emerald",
        gradient: "from-emerald-500 to-teal-600"
    },
    {
        id: "earlybird",
        title: "Early Bird",
        discount: "10% OFF",
        description: "Book any course 30 days in advance and secure your seat with a discount.",
        icon: Zap,
        color: "purple",
        gradient: "from-purple-500 to-violet-600"
    },
    {
        id: "alumini",
        title: "KITES Alumni",
        discount: "15% OFF",
        description: "Return for another course and get a loyalty discount. Keep learning.",
        icon: Users,
        color: "amber",
        gradient: "from-amber-500 to-orange-600"
    }
];

export function TrainingOffersSection() {
    const whatsappUrl = "https://wa.me/96522092260";

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/50 skew-x-12 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Unlock Savings</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Exclusive Offers & Discounts</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {OFFERS.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col hover:-translate-y-1">
                            <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center text-white bg-gradient-to-br ${offer.gradient} shadow-md`}>
                                <offer.icon size={24} />
                            </div>

                            <div className="flex-grow">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 bg-${offer.color}-50 text-${offer.color}-600 border border-${offer.color}-100`}>
                                    {offer.discount}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{offer.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {offer.description}
                                </p>
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
                    ))}
                </div>
            </div>
        </section>
    );
}
