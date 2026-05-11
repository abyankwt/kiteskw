-- Seed CMS pages and home hero content from existing static data

INSERT INTO cms_pages (slug, title, meta_title, meta_description, is_published, published_at) VALUES
  ('home',      'Home',      'KITES — Engineer Tomorrow',          'Kuwait Institute for Training & Engineering Simulations', true, NOW()),
  ('services',  'Services',  'Engineering Services — KITES',       'Explore our full range of engineering simulation services', true, NOW()),
  ('training',  'Training',  'Training Programs — KITES',          'Professional engineering training and certification programs', true, NOW()),
  ('partners',  'Partners',  'Our Technology Partners — KITES',    'World-class engineering simulation technology partners', true, NOW()),
  ('expertise', 'Expertise', 'Engineering Expertise — KITES',      'Deep domain expertise across simulation disciplines', true, NOW()),
  ('contact',   'Contact',   'Contact KITES',                      'Get in touch with the KITES team', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Home: sections
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order) VALUES
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'hero',           'Hero Section',           1),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'kpi_stats',      'KPI Statistics',         2),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'services_intro', 'Services Introduction',  3),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'partners',       'Technology Partners',    4),
  ((SELECT id FROM cms_pages WHERE slug = 'home'), 'cta',            'Call to Action',         5)
ON CONFLICT (page_id, section_key) DO NOTHING;

-- Hero blocks — English
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'headline_line1', 'ENGINEER', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'headline_line2', 'TOMORROW', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'subheading',
  'Kuwait Institute for Training & Engineering Simulations — your long-term engineering capability partner.',
  'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_primary_text', 'Explore Services', 'en', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_primary_href', '/services', 'en', 5
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_secondary_text', 'Our Partners', 'en', 6
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_secondary_href', '/partners', 'en', 7
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

-- Hero blocks — Arabic
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'headline_line1', 'هندس', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'headline_line2', 'الغد', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'subheading',
  'معهد الكويت للتدريب والمحاكاة الهندسية — شريككم الهندسي طويل الأمد.',
  'ar', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_primary_text', 'استكشف خدماتنا', 'ar', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_secondary_text', 'شركاؤنا', 'ar', 5
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'hero'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

-- KPI stats
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'stats_array', 'kpi_items', '[
  {"label": "Years of Experience", "label_ar": "سنوات الخبرة",       "value": "15+"},
  {"label": "Certified Engineers",  "label_ar": "مهندسون معتمدون",   "value": "500+"},
  {"label": "Training Programs",    "label_ar": "برامج تدريبية",      "value": "50+"},
  {"label": "Partner Organizations","label_ar": "منظمات شريكة",       "value": "40+"}
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'kpi_stats'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

-- CTA section
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'headline', 'Ready to Engineer Tomorrow?', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'cta'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'subheading',
  'Connect with our engineering experts and discover how KITES can accelerate your capability development.',
  'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'cta'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_text', 'Contact Us', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'cta'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_href', '/contact', 'en', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'home' AND s.section_key = 'cta'
ON CONFLICT (section_id, field_key, locale) DO NOTHING;
