import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/hooks/useContent";
import kitesLogo from "@/assets/kites-logo.png";
import { ServicesMegaMenu } from "./ServicesMegaMenu";
import { PartnersMegaMenu } from "./PartnersMegaMenu";

interface CommonContent {
  nav: {
    home: string;
    expertise: string;
    services: string;
    training: string;
    partners: string;
    insights: string;
    events: string;
    blog: string;
    gallery: string;
    contact: string;
  };
  language: {
    switchToEnglish: string;
    switchToArabic: string;
    languageLabel: string;
  };
  header: {
    titleLine1: string;
    titleLine2: string;
  };
}

// Define navigation structure (hrefs stay the same across languages)
const navStructure = [
  { key: "home", href: "/" },
  { key: "expertise", href: "/expertise" },
  { key: "services", href: "/services", hasMegaMenu: true },
  { key: "partners", href: "/partners", hasMegaMenu: true },
  { key: "training", href: "/training" },
  // { key: "insights", href: "/insights" }, // Temporarily hidden
  { key: "events", href: "/events" },
  { key: "blog", href: "/blog" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
];

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const common = useContent<CommonContent>('common');
  const location = useLocation();

  // Mega Menu State
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Mobile Accordion State
  const [expandedMobileNav, setExpandedMobileNav] = useState<string | null>(null);

  const toggleMobileNav = (key: string) => {
    setExpandedMobileNav(prev => prev === key ? null : key);
  };

  // Check if we are on the homepage
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Determine header appearance
  // If NOT homepage, always use the "scrolled" (solid/visible) style
  // If homepage, use scroll state to toggle between transparent and solid
  const shouldShowSolidHeader = !isHomePage || isScrolled || hoveredNav !== null; // Solid when mega menu is open too

  // Close mega menu on route change
  useEffect(() => {
    setHoveredNav(null);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-[var(--header-height)] flex items-center",
          "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
          shouldShowSolidHeader
            ? "bg-[#0B0F14] backdrop-blur-md shadow-md border-b border-white/10"
            : "bg-[#0B0F14]/50 backdrop-blur-sm border-b border-white/5"
        )}
        onMouseLeave={() => setHoveredNav(null)}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full transition-all duration-300">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 group">
              <img
                src={kitesLogo}
                alt="KITES - Kuwait Institute for Training & Engineering Simulations"
                className="h-[60px] lg:h-[84px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Full Text - Responsive Sizing & Weight */}
              {/* Full Text - Responsive Sizing & Weight */}
              <div
                className={cn(
                  "flex flex-col items-start leading-tight transition-all duration-300 ease-out overflow-hidden whitespace-nowrap",
                  isScrolled
                    ? "w-0 opacity-0 -translate-y-1 pointer-events-none"
                    : "w-auto opacity-100 translate-y-0 group-hover:opacity-100 pl-2 lg:pl-[8px]"
                )}
              >
                <span className="font-heading font-normal text-[13px] md:text-[14px] lg:text-[15px] text-white/90 tracking-wider uppercase drop-shadow-sm">
                  {common.header.titleLine1}
                </span>
                <span className="font-heading font-normal text-[13px] md:text-[14px] lg:text-[15px] text-white/90 tracking-wider uppercase drop-shadow-sm">
                  {common.header.titleLine2}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 h-full">
              {navStructure.map((item) => (
                <div
                  key={item.key}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setHoveredNav(item.hasMegaMenu ? item.key : null)}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => cn(
                      "relative py-2 font-body text-lg font-medium transition-colors duration-200 flex items-center gap-1",
                      "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-white after:origin-center after:transition-transform after:duration-300",
                      // Keep text interactions consistent
                      shouldShowSolidHeader
                        ? (isActive || hoveredNav === item.key ? "text-white after:scale-x-100 font-semibold" : "text-white/90 hover:text-white after:scale-x-0 hover:after:scale-x-100")
                        : (isActive || hoveredNav === item.key ? "text-white after:scale-x-100 font-semibold" : "text-white/90 hover:text-white after:scale-x-0 hover:after:scale-x-100")
                    )}
                  >
                    {common.nav[item.key as keyof typeof common.nav]}
                    {item.hasMegaMenu && (
                      <ChevronDown size={14} className={cn("transition-transform duration-200", hoveredNav === item.key ? "rotate-180" : "")} strokeWidth={2} />
                    )}
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Language Switcher - Desktop */}
            <div className="hidden lg:flex items-center gap-1 shrink-0 ms-4">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "px-3 py-1.5 text-base font-body font-medium transition-colors duration-200",
                  language === "en" ? "text-white" : "text-white/60 hover:text-white/90"
                )}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLanguage("ar")}
                className={cn(
                  "px-3 py-1.5 text-base font-body font-medium transition-colors duration-200",
                  language === "ar" ? "text-white" : "text-white/60 hover:text-white/90"
                )}
                aria-label="Switch to Arabic"
              >
                AR
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/90 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mega Menus Rendered Outside Container but inside Header relative context */}
        <ServicesMegaMenu
          isOpen={hoveredNav === 'services'}
          onClose={() => setHoveredNav(null)}
        />
        <PartnersMegaMenu
          isOpen={hoveredNav === 'partners'}
          onClose={() => setHoveredNav(null)}
        />

      </header>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-200",
          isMobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={cn(
            "absolute top-0 end-0 h-full w-full max-w-sm bg-[#0B0F14]/90 backdrop-blur-xl border-l border-white/5 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
            isMobileMenuOpen ? "translate-x-0 rtl:-translate-x-0" : "translate-x-full rtl:-translate-x-full"
          )}
        >
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10 shrink-0">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
              <img
                src={kitesLogo}
                alt="KITES"
                className="h-12 w-auto"
              />
              <span className="font-heading font-bold text-xl text-white tracking-wider uppercase">
                KITES
              </span>
            </Link>

            {/* Prominent Close Button - 44x44px tap target */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative z-50 flex items-center justify-center w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-200"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Navigation Items - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {navStructure.map((item, index) => {
              // Render standard links
              if (!item.hasMegaMenu) {
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center min-h-[56px] px-4 text-white/80 hover:text-white hover:bg-white/5 font-body text-lg font-medium transition-all duration-200 rounded-xl border border-transparent hover:border-white/5 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {common.nav[item.key as keyof typeof common.nav]}
                  </Link>
                );
              }

              // Render Accordion for Mega Menu items
              const isExpanded = expandedMobileNav === item.key;
              return (
                <div key={item.key} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Accordion Trigger - Full width tappable */}
                  <button
                    onClick={() => toggleMobileNav(item.key)}
                    className={cn(
                      "flex items-center justify-between w-full min-h-[56px] px-4 text-lg font-medium transition-all duration-200 rounded-xl border border-transparent",
                      isExpanded
                        ? "text-white bg-white/5 font-semibold border-white/5 shadow-inner"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="font-body">
                      {common.nav[item.key as keyof typeof common.nav]}
                    </span>
                    <ChevronDown
                      size={20}
                      strokeWidth={2}
                      className={cn(
                        "text-white/70 transition-transform duration-300",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {/* Mobile Submenu Content */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[500px] mt-1 mb-2 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {item.key === 'services' && (
                      <div className="flex flex-col py-2 px-2 bg-white/5 rounded-lg">
                        {['consultation', 'software-distribution', 'prototype-development', 'training'].map(id => (
                          <Link
                            key={id}
                            to={`/services/${id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="min-h-[44px] flex items-center px-4 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                          >
                            {id === 'consultation' ? (language === 'ar' ? "الاستشارات الهندسية" : "Engineering Consulting") :
                              id === 'software-distribution' ? (language === 'ar' ? "البرمجيات والمنصات" : "Software & Platforms") :
                                id === 'prototype-development' ? (language === 'ar' ? "النماذج الأولية" : "Prototyping") : (language === 'ar' ? "التدريب المهني" : "Training")}
                          </Link>
                        ))}
                        <Link
                          to="/services"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="min-h-[40px] flex items-center mt-2 px-4 text-xs font-semibold text-logo-gunsmoke hover:text-white uppercase tracking-wider transition-colors rounded-lg hover:bg-white/5"
                        >
                          {language === 'ar' ? "عرض جميع الخدمات" : "View All Services"}
                        </Link>
                      </div>
                    )}

                    {item.key === 'partners' && (
                      <div className="flex flex-col py-2 px-2 bg-white/5 rounded-lg">
                        <Link
                          to="/partners"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="min-h-[44px] flex items-center px-4 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                          {language === 'ar' ? "الشركاء التقنيون" : "Technology Partners"}
                        </Link>
                        <Link
                          to="/partners"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="min-h-[44px] flex items-center px-4 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                          {language === 'ar' ? "المؤسسات الأكاديمية والبحثية" : "Academic & Research"}
                        </Link>
                        <Link
                          to="/partners"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="min-h-[44px] flex items-center px-4 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                          {language === 'ar' ? "الجهات الحكومية والصناعية" : "Government & Industrial"}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Language Switcher - Fixed at Bottom */}
          <div className="shrink-0 px-6 py-6 border-t border-white/10 bg-[#0B0F14]">
            <p className="text-white/40 text-xs font-body font-semibold mb-4 uppercase tracking-widest">
              {common.language.languageLabel}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 min-h-[48px] text-sm font-body font-semibold rounded-lg border-2 transition-all duration-200",
                  language === "en"
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-transparent text-white/70 border-white/20 hover:border-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {common.language.switchToEnglish}
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className={cn(
                  "flex-1 min-h-[48px] text-sm font-body font-semibold rounded-lg border-2 transition-all duration-200",
                  language === "ar"
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-transparent text-white/70 border-white/20 hover:border-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {common.language.switchToArabic}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
