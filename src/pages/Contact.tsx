import { useState } from "react";
import { SEO } from "@/components/common/SEO";

import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle, Send, Clock, Building2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface ContactContent {
  pageTitle: string;
  intro: string;
  form: {
    labels: {
      name: string;
      email: string;
      phone: string;
      company: string;
      subject: string;
      message: string;
    };
    placeholders: {
      subject: string;
    };
    submit: string;
    sending: string;
    success: string;
    successDesc: string;
    reassurance: string;
  };
  validation: {
    nameRequired: string;
    nameMax: string;
    emailRequired: string;
    emailInvalid: string;
    phoneRequired: string;
    phoneInvalid: string;
    companyMax: string;
    messageRequired: string;
    messageMax: string;
  };
  contactDetails: {
    heading: string;
    email: string;
    phone: string;
    location: string;
    emailValue: string;
    phoneValue: string;
    locationValue: string;
  };
}

export default function Contact() {
  const { language } = useLanguage();
  const t = useContent<ContactContent>('contact');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const contactSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, t.validation.nameRequired)
      .max(100, t.validation.nameMax),
    email: z
      .string()
      .trim()
      .min(1, t.validation.emailRequired)
      .email(t.validation.emailInvalid),
    phone: z
      .string()
      .trim()
      .min(1, t.validation.phoneRequired)
      .regex(/^[\d\s+()-]*$/, t.validation.phoneInvalid),
    company: z.string().trim().max(100, t.validation.companyMax).optional(),
    subject: z.string().optional(),
    message: z
      .string()
      .trim()
      .min(1, t.validation.messageRequired)
      .max(1000, t.validation.messageMax),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "" });

    toast({
      title: t.form.success,
      description: t.form.successDesc,
    });
  };

  return (
    <>
      <SEO page="contact" />


      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-black relative overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Mail className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wide">Get In Touch</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {t.pageTitle}
            </h1>
            <p className="font-body text-base sm:text-lg lg:text-xl text-white/80 font-light max-w-2xl mx-auto px-2 sm:px-0 mb-8">
              {t.intro}
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-8">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold">24h Response</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2 text-white/90">
                <Building2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-semibold">500+ Consultations</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold">4.9★ Rating</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form & Details */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-3 items-start">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-10 shadow-sm">
                  {isSuccess ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2} />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                        {t.form.success}
                      </h3>
                      <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">{t.form.successDesc}</p>
                      <Button
                        variant="outline"
                        onClick={() => setIsSuccess(false)}
                        className="min-w-[200px]"
                      >
                        {language === "en" ? "Send Another Message" : "إرسال رسالة أخرى"}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-foreground/80">{t.form.labels.name} <span className="text-logo-gunsmoke">*</span></Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`h-12 bg-background transition-all ${errors.name ? "border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive" : "border-input focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"}`}
                            maxLength={100}
                            autoComplete="name"
                          />
                          {errors.name && (
                            <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground/80">{t.form.labels.email} <span className="text-logo-gunsmoke">*</span></Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`h-12 bg-background transition-all ${errors.email ? "border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive" : "border-input focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"}`}
                            maxLength={255}
                            autoComplete="email"
                          />
                          {errors.email && (
                            <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">{t.form.labels.phone} <span className="text-logo-gunsmoke">*</span></Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`h-12 bg-background transition-all ${errors.phone ? "border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive" : "border-input focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"}`}
                            maxLength={20}
                            autoComplete="tel"
                          />
                          {errors.phone && (
                            <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Subject (Inquiry Type) */}
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-sm font-medium text-foreground/80">Inquiry Type</Label>
                          <Select onValueChange={handleSelectChange}>
                            <SelectTrigger className="h-12 bg-background focus:ring-2 focus:ring-logo-alto/20 border-input">
                              <SelectValue placeholder={language === 'en' ? "Select a topic..." : "اختر موضوعاً..."} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">{language === 'en' ? "Consultation" : "استشارة"}</SelectItem>
                              <SelectItem value="training">{language === 'en' ? "Professional Training" : "تدريب مهني"}</SelectItem>
                              <SelectItem value="software">{language === 'en' ? "Software Licensing" : "تراخيص البرمجيات"}</SelectItem>
                              <SelectItem value="general">{language === 'en' ? "General Inquiry" : "استفسار عام"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Company (Full Width) */}
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium text-foreground/80">{t.form.labels.company}</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className={`h-12 bg-background focus:ring-2 focus:ring-logo-alto/20 transition-all ${errors.company ? "border-destructive focus:ring-destructive/20" : "border-input"}`}
                          maxLength={100}
                          autoComplete="organization"
                        />
                        {errors.company && (
                          <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                            {errors.company}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="message" className="text-sm font-medium text-foreground/80">{t.form.labels.message} <span className="text-logo-gunsmoke">*</span></Label>
                          <span className="text-xs text-muted-foreground">
                            {formData.message.length}/1000
                          </span>
                        </div>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className={`min-h-[160px] resize-y bg-background transition-all ${errors.message ? "border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive" : "border-input focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"}`}
                          maxLength={1000}
                        />
                        {errors.message && (
                          <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <Button
                          type="submit"
                          variant="default"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto min-w-[180px] h-14 text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {t.form.sending}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              {t.form.submit}
                              <Send size={18} className="rtl:-scale-x-100" />
                            </span>
                          )}
                        </Button>

                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 opacity-80">
                          <Clock size={14} />
                          {language === 'en' ? "We typically reply within 24 hours." : "نرد عادةً خلال 24 ساعة."}
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-1">
              <ScrollReveal delay={200}>
                <div className="space-y-6">
                  {/* Contact Info Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      {t.contactDetails.heading}
                    </h3>

                    <div className="space-y-6">
                      {/* Email */}
                      <a
                        href={`mailto:${t.contactDetails.emailValue}`}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-200"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Mail className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                            {t.contactDetails.email}
                          </p>
                          <span className="text-foreground font-bold text-sm group-hover:text-blue-600 transition-colors">
                            {t.contactDetails.emailValue}
                          </span>
                        </div>
                      </a>

                      {/* Phone */}
                      <a
                        href={`tel:${t.contactDetails.phoneValue.replace(/\s/g, "")}`}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-transparent hover:border-green-200"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Phone className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                            {t.contactDetails.phone}
                          </p>
                          <span className="text-foreground font-bold text-sm group-hover:text-green-600 transition-colors" dir="ltr">
                            {t.contactDetails.phoneValue}
                          </span>
                        </div>
                      </a>

                      {/* Location */}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <MapPin className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                            {t.contactDetails.location}
                          </p>
                          <p className="text-foreground font-bold text-sm">
                            {t.contactDetails.locationValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Quick Action */}
                  <a
                    href="https://wa.me/96522092260"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                        <Phone className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/90 text-xs font-bold uppercase tracking-wide mb-1">
                          {language === 'en' ? 'Quick Contact' : 'تواصل سريع'}
                        </p>
                        <p className="text-white font-bold text-lg">
                          {language === 'en' ? 'Chat on WhatsApp' : 'الدردشة عبر واتساب'}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </div>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
