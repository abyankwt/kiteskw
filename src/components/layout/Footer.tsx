import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, Linkedin, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/hooks/useContent";
import kitesLogo from "@/assets/kites-logo.png";
import { cn } from "@/lib/utils";

interface CommonContent {
  footer: {
    sections: {
      company: string;
      services: string;
      resources: string;
      contact: string;
    };
    contactLabels: {
      email: string;
      phone: string;
      location: string;
      locationValue: string;
    };
    copyright: string;
    links: {
      expertise: string;
      partners: string;
      contact: string;
      prototypeDevelopment: string;
      consultation: string;
      training: string;
      softwareDistribution: string;
      insights: string;
      events: string;
    };
  };
}

export function Footer() {
  const { language } = useLanguage();
  const common = useContent<CommonContent>('common');

  return (
    <footer className="relative bg-[#080D17] text-slate-400 overflow-hidden border-t border-white/5">

      {/* Background Noise & Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#080D17] to-[#05080F] pointer-events-none" />
      <div
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">

        {/* Subtle Top Divider */}
        <div className="absolute top-0 left-0 w-full h-px bg-white/5" />

        {/* Footer Grid - 3 Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Zone 1: Institutional Identity (Left - Primary) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <img
                src={kitesLogo}
                alt="KITES"
                className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-white tracking-[0.1em] uppercase">
                  KITES
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase">
                  Scientific Institute
                </span>
              </div>
            </Link>

            {/* Institutional Description - Polish: Reduced Opacity, Increased Leading */}
            <p className="font-body text-base text-logo-gunsmoke leading-loose max-w-md">
              {language === 'ar'
                ? "مركز إقليمي للتميز في المحاكاة الهندسية والتدريب المهني والبحث التطبيقي - يدعم المؤسسات الأكاديمية والحكومية والصناعية عبر دول مجلس التعاون الخليجي."
                : "A regional center of excellence for engineering simulation, professional training, and applied research — supporting academic, government, and industrial organizations across the GCC."}
            </p>

            {/* Social Links */}
            <div className="flex flex-col gap-4 mt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'ar' ? "تواصل معنا" : "Connect with us"}
              </span>
              <div className="flex items-center gap-4">
                {[
                  { Icon: Linkedin, label: "LinkedIn" },
                  { Icon: Twitter, label: "Twitter / X" },
                  { Icon: Youtube, label: "YouTube" }
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation (Center - Secondary) */}
          <div className="lg:col-span-3 flex flex-col gap-8 lg:pl-8 border-l-0 lg:border-l border-white/5">
            <h4 className="font-heading text-white font-bold text-xs uppercase tracking-[0.15em] opacity-80">
              {common.footer.sections.company}
            </h4>
            <ul className="space-y-4">
              {[
                { label: common.footer.links.expertise, href: "/expertise" },
                { label: common.footer.links.partners, href: "/partners" },
                { label: common.footer.sections.services, href: "/services" },
                { label: common.footer.links.insights, href: "/insights" },
                { label: common.footer.links.events, href: "/events" },
                { label: common.footer.links.contact, href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-logo-gunsmoke hover:text-white hover:translate-x-1 transition-all duration-300 block py-3"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Zone 3: Contact & Presence (Right - Primary) */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:pl-8 border-l-0 lg:border-l border-white/5">
            <h4 className="font-heading text-white font-bold text-xs uppercase tracking-[0.15em] opacity-80">
              {language === 'ar' ? "المقر الرئيسي" : "Head Office"}
            </h4>

            <ul className="space-y-6">
              {/* Location - Emphasized */}
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-white/70" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">
                    {language === 'ar' ? "الكويت" : "Kuwait"}
                  </span>
                  <span className="text-sm text-slate-400 leading-relaxed block max-w-[240px] opacity-80">
                    {common.footer.contactLabels.locationValue}
                  </span>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <Mail size={16} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <a href="mailto:info@kites.com.kw" className="text-sm font-medium text-logo-gunsmoke group-hover:text-white transition-colors">
                  info@kites.com.kw
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <Phone size={16} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <a href="tel:+96522092260" className="text-sm font-medium text-logo-gunsmoke group-hover:text-white transition-colors" dir="ltr">
                  +965 22092260
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium tracking-wide">
          <p>
            {common.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

