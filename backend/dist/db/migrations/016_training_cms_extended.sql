-- ═══════════════════════════════════════════════════════════════════
-- Migration 016: Extend Training CMS — banner details, hero stats,
--   special offers, trust badges, final CTA
-- Run in Supabase SQL Editor. Fully idempotent (ON CONFLICT DO UPDATE).
-- ═══════════════════════════════════════════════════════════════════

-- ── NEW TRAINING SECTIONS ───────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'stats',          'Hero Stats',          4 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'special_offers', 'Special Offer Cards', 5 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'trust',          'Trust Badges',        6 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'final_cta',      'Final CTA Section',   7 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

-- ── BANNER — add discount, expiry_date, remaining_seats ─────────────
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'discount', '20%', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='banner'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'expiry_date', '2026-07-01T23:59:59', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='banner'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'remaining_seats', '12', 'en', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='banner'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- ── STATS — hero inline animated counters ───────────────────────────
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'enrolled_count', '500', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'rating_value', '4.9', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'career_growth_pct', '98', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'enrolled_label', 'Engineers Enrolled', 'en', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'enrolled_label', 'مهندس مسجل', 'ar', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'rating_label', 'Average Rating', 'en', 5
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'rating_label', 'متوسط التقييم', 'ar', 5
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'career_label', 'Career Growth', 'en', 6
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'career_label', 'نمو مهني', 'ar', 6
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='stats'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- ── SPECIAL OFFERS — two offer cards JSON ───────────────────────────
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {
    "id": "bundle",
    "title": "Bundle & Save Big",
    "title_ar": "وفر أكثر مع الباقات",
    "description": "Enroll in 2 or more courses and get exclusive discounts plus bonus materials",
    "description_ar": "سجل في دورتين أو أكثر واحصل على خصومات حصرية ومواد إضافية",
    "discount": "30%",
    "features": ["Enroll in 2+ courses simultaneously","Free downloadable resource library","Priority placement assistance","Exclusive networking events access"],
    "features_ar": ["التسجيل في دورتين أو أكثر في وقت واحد","مكتبة موارد مجانية للتنزيل","أولوية في التوظيف","الوصول لفعاليات التواصل الحصرية"],
    "ctaText": "View Course Bundles",
    "ctaText_ar": "عرض الباقات",
    "ctaLink": "https://wa.me/96522092260",
    "variant": "primary"
  },
  {
    "id": "earlybird",
    "title": "Early Bird Special",
    "title_ar": "عرض المبكر الخاص",
    "description": "Register before the deadline and secure your spot with exclusive early bird benefits",
    "description_ar": "سجل قبل الموعد النهائي واحجز مكانك مع مزايا حصرية للمبكرين",
    "discount": "20%",
    "features": ["First 50 enrollments only","Free 1-on-1 consultation session","Lifetime access to course updates","Certificate fast-track processing"],
    "features_ar": ["أول 50 تسجيلاً فقط","جلسة استشارة مجانية فردية","وصول مدى الحياة لتحديثات الدورة","معالجة سريعة للشهادة"],
    "ctaText": "Claim Early Bird Discount",
    "ctaText_ar": "احصل على خصم المبكر",
    "ctaLink": "https://wa.me/96522092260",
    "variant": "secondary"
  }
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='special_offers'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- ── TRUST BADGES ────────────────────────────────────────────────────
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Trusted by Professionals Across the GCC', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'موثوق به من المهنيين في منطقة الخليج', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'Industry-recognized certifications and partnerships that guarantee quality training', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'شهادات واعتمادات معترف بها صناعياً تضمن جودة التدريب', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {"icon":"Shield","title":"ISO 9001 Certified","title_ar":"معتمد ISO 9001","description":"Quality Management","description_ar":"إدارة الجودة","color":"blue"},
  {"icon":"Award","title":"Industry Partners","title_ar":"شركاء الصناعة","description":"SolidWorks & ANSYS","description_ar":"SolidWorks وANSYS","color":"purple"},
  {"icon":"Users","title":"500+ Graduates","title_ar":"+500 خريج","description":"95% Placement Rate","description_ar":"معدل توظيف 95%","color":"green"},
  {"icon":"CheckCircle2","title":"Money-Back Guarantee","title_ar":"ضمان استرداد المال","description":"100% Satisfaction","description_ar":"رضا 100%","color":"emerald"},
  {"icon":"Lock","title":"Secure Payment","title_ar":"دفع آمن","description":"SSL Encrypted","description_ar":"مشفر SSL","color":"slate"}
]'::jsonb, 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- ── FINAL CTA ───────────────────────────────────────────────────────
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'urgency_text', 'Limited Spots for Next Intake', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'urgency_text', 'مقاعد محدودة للدفعة القادمة', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Ready to Start Learning?', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'هل أنت مستعد للبدء؟', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'Join 500+ engineers who have advanced their careers with KITES training.', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'انضم لأكثر من 500 مهندس طوروا مسيرتهم المهنية مع تدريب KITES.', 'ar', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'trust_signals', '["Money-back guarantee","Free trial lesson","Industry-certified trainers"]'::jsonb, 'en', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='final_cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;
