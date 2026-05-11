-- Migration 017: Add remaining Training page CMS sections
-- Sections: offers_section, why_kites, comparison, learning_paths
-- Also adds partners block to the existing trust section

-- ─── 1. OFFERS SECTION ───────────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'offers_section', 'Exclusive Offers Section', 35 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'tagline', 'en', 'Unlock Savings', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='offers_section'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'en', 'Exclusive Offers & Discounts', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='offers_section'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'tagline', 'ar', 'وفّر أكثر', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='offers_section'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'ar', 'عروض وخصومات حصرية', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='offers_section'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_json, sort_order)
SELECT s.id, 'json', 'items', 'en', '[
  {"id":"corporate","title":"Corporate Bundle","discount":"20% OFF","description":"Ideal for companies upskilling their engineering teams. Valid for groups of 5+."},
  {"id":"student","title":"Student Special","discount":"Flat 50% OFF","description":"Valid for university students with a valid ID card. Start your career strong."},
  {"id":"earlybird","title":"Early Bird","discount":"10% OFF","description":"Book any course 30 days in advance and secure your seat with a discount."},
  {"id":"alumni","title":"KITES Alumni","discount":"15% OFF","description":"Return for another course and get a loyalty discount. Keep learning."}
]'::jsonb, 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='offers_section'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- ─── 2. WHY KITES (Bento Grid) ───────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'why_kites', 'Why Choose KITES (Features Grid)', 45 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'tagline', 'en', 'Why Choose KITES', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'en', 'Engineering Excellence Redefined', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'en', 'We don''t just teach software; we build careers. Our training methodology is designed for rapid skill acquisition and professional impact.', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'tagline', 'ar', 'لماذا تختار KITES', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'ar', 'إعادة تعريف التميز الهندسي', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'ar', 'لا نكتفي بتعليم البرامج؛ نبني مسيرات مهنية.', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_json, sort_order)
SELECT s.id, 'json', 'features', 'en', '[
  {"title":"Simulation-Driven Learning","description":"Forget theory-heavy lectures. Our courses are 80% hands-on simulation labs using industry-standard tools like ANSYS, Abaqus, and SolidWorks."},
  {"title":"Certified Instructors","description":"Learn from certified experts with 10+ years of field experience in oil & gas and construction."},
  {"title":"Global Recognition","description":"Our certifications are recognized by major engineering firms across the GCC region."},
  {"title":"Career Placement Support","description":"Top performers get direct referrals to our partner network of engineering firms in Kuwait and Saudi Arabia.","stat":"92%","stat_label":"Placement Rate"}
]'::jsonb, 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='why_kites'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- ─── 3. COMPARISON MATRIX ────────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'comparison', 'Comparison Table (KITES vs Self-Learning)', 50 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'badge_text', 'en', 'Why Choose KITES?', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'en', 'Professional Training vs Self-Learning', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'en', 'See what sets our comprehensive professional training apart from trying to learn on your own', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'cta_text', 'en', 'Browse Our Courses', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'cta_note', 'en', 'Invest in professional training for guaranteed results', 5
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'badge_text', 'ar', 'لماذا تختار KITES?', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'ar', 'التدريب الاحترافي مقابل التعلم الذاتي', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'ar', 'اكتشف ما يميز تدريبنا الاحترافي الشامل عن التعلم بمفردك', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'cta_text', 'ar', 'تصفح الدورات', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_json, sort_order)
SELECT s.id, 'json', 'features', 'en', '[
  {"name":"Expert Instructor Guidance","self_learning":"no","kites":"yes"},
  {"name":"ISO 9001 Certified Training","self_learning":"no","kites":"yes"},
  {"name":"Hands-on Industry Projects","self_learning":"limited","kites":"yes"},
  {"name":"Job Placement Assistance","self_learning":"no","kites":"yes"},
  {"name":"Recognized Certification","self_learning":"no","kites":"yes"},
  {"name":"Lifetime Access to Materials","self_learning":"maybe","kites":"yes"},
  {"name":"1-on-1 Mentorship","self_learning":"no","kites":"yes"},
  {"name":"Industry Network Access","self_learning":"no","kites":"yes"},
  {"name":"Real-world Case Studies","self_learning":"limited","kites":"yes"},
  {"name":"Money-Back Guarantee","self_learning":"no","kites":"yes"}
]'::jsonb, 6
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='comparison'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- ─── 4. LEARNING PATHS ───────────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'learning_paths', 'Learning Paths (Your Journey)', 55 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'tagline', 'en', 'Career Roadmap', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'en', 'Your Journey to Expertise', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'en', 'Choose your path and join 500+ engineers advancing their careers.', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'tagline', 'ar', 'خارطة طريق مهنية', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'heading', 'heading', 'ar', 'رحلتك نحو الخبرة', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'ar', 'اختر مسارك وانضم إلى أكثر من 500 مهندس يطورون مسيرتهم.', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_json, sort_order)
SELECT s.id, 'json', 'paths', 'en', $json$[
  {
    "title":"Foundation",
    "duration":"4-6 weeks",
    "description":"Master the basics of engineering simulation and CAD design to ace your capstone projects.",
    "cta_text":"Start Foundation Path",
    "cta_link":"https://wa.me/96522092260?text=Interested in Foundation program",
    "completed":340
  },
  {
    "title":"Certification",
    "duration":"8-12 weeks",
    "description":"Earn professional credentials (CFD, FEA) to demonstrate competency to top employers.",
    "cta_text":"Get Certified Now",
    "cta_link":"https://wa.me/96522092260?text=Interested in Certification program",
    "completed":215,
    "badge":"Most Popular"
  },
  {
    "title":"Mastery",
    "duration":"12+ weeks",
    "description":"Lead teams and innovation. Advanced corporate training to upskill entire departments.",
    "cta_text":"Achieve Mastery",
    "cta_link":"https://wa.me/96522092260?text=Interested in Mastery program",
    "completed":87
  }
]$json$::jsonb, 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='learning_paths'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- ─── 5. PARTNERS (extend existing trust section) ──────────────────────────────
INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'partners_label', 'en', 'Proud Training Partners', 10
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_text, sort_order)
SELECT s.id, 'text', 'partners_label', 'ar', 'شركاؤنا في التدريب', 10
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, locale, value_json, sort_order)
SELECT s.id, 'json', 'partners', 'en', '[
  {"name":"SolidWorks","logo_url":null},
  {"name":"ANSYS","logo_url":null},
  {"name":"MATLAB","logo_url":null}
]'::jsonb, 11
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;
