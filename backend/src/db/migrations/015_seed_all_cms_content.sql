-- ═══════════════════════════════════════════════════════════════════
-- Migration 015: Seed all CMS content for all 6 pages
-- Run in Supabase SQL Editor. Fully idempotent (ON CONFLICT DO UPDATE).
-- ═══════════════════════════════════════════════════════════════════

-- ── SERVICES PAGE ──────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'hero',     'Hero Section',       1 FROM cms_pages p WHERE p.slug = 'services'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'approach', 'Our Approach',        2 FROM cms_pages p WHERE p.slug = 'services'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'services', 'Service Cards',       3 FROM cms_pages p WHERE p.slug = 'services'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'cta',      'Call to Action',      4 FROM cms_pages p WHERE p.slug = 'services'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

-- Services hero — EN
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Engineering Services', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'Integrated simulation, training, and consulting solutions designed to build lasting organizational capability.', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Services hero — AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'الخدمات الهندسية', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'حلول متكاملة للمحاكاة والتدريب والاستشارات مصممة لبناء قدرات مؤسسية دائمة.', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Services approach — label EN/AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'label', 'Our Approach', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='approach'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'label', 'منهجيتنا', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='approach'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Services approach — steps JSON
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'steps', '[
  {"label":"Assess","label_ar":"تقييم","icon":"Target","desc":"Understand requirements and organizational readiness.","desc_ar":"فهم المتطلبات والجاهزية المؤسسية."},
  {"label":"Train","label_ar":"تدريب","icon":"BookOpen","desc":"Build foundational and advanced competencies.","desc_ar":"بناء الكفاءات الأساسية والمتقدمة."},
  {"label":"Implement","label_ar":"تنفيذ","icon":"Settings","desc":"Deploy solutions with hands-on support.","desc_ar":"نشر الحلول مع دعم عملي."},
  {"label":"Support","label_ar":"دعم","icon":"HeartHandshake","desc":"Ensure long-term adoption and success.","desc_ar":"ضمان التبني والنجاح طويل المدى."}
]'::jsonb, 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='approach'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- Services — service cards JSON
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {
    "id":"prototype-development","icon":"Cpu","category":"Engineering","category_ar":"هندسة",
    "title":"Prototype Development","title_ar":"تطوير النماذج الأولية",
    "solves":"Validate technical concepts before production through simulation-driven prototyping—reducing risk and supporting engineering innovation.",
    "solves_ar":"التحقق من المفاهيم التقنية قبل الإنتاج من خلال النمذجة القائمة على المحاكاة.",
    "how":["Technical feasibility and concept validation","High-fidelity digital twin development","Iterative simulation-driven refinement"],
    "how_ar":["الجدوى التقنية والتحقق من المفاهيم","تطوير التوائم الرقمية عالية الدقة","التحسين الفني التكراري القائم على المحاكاة"],
    "outcomes":["Reduced Uncertainty","Workflow Optimization","Design Reliability"],
    "outcomes_ar":["تقليل عدم اليقين","تحسين سير العمل","وثوقية التصميم"]
  },
  {
    "id":"consultation","icon":"LineChart","category":"Consulting","category_ar":"استشارات",
    "title":"Engineering Consultation","title_ar":"الاستشارات الهندسية",
    "solves":"Expert advisory to help organizations navigate technical complexity and make evidence-based engineering decisions.",
    "solves_ar":"توجيه استشاري متخصص لمساعدة المؤسسات على التنقل في التعقيدات التقنية.",
    "how":["Institutional process assessment","Simulation technology strategy","Workflow integration and optimization"],
    "how_ar":["تقييم العمليات المؤسسية","استراتيجية تقنيات المحاكاة","تكامل وتحسين سير العمل"],
    "outcomes":["Process Excellence","Strategic Clarity","Technical Readiness"],
    "outcomes_ar":["تميز العمليات","وضوح استراتيجي","الجاهزية التقنية"]
  },
  {
    "id":"training","icon":"GraduationCap","category":"Capability Building","category_ar":"بناء القدرات",
    "title":"Professional Training","title_ar":"التدريب المهني",
    "solves":"Establish and scale simulation competency—from foundational engineering skills to advanced system mastery.",
    "solves_ar":"تأسيس وتوسيع كفاءات المحاكاة — من المهارات الهندسية الأساسية إلى الإتقان المتقدم.",
    "how":["Industry-certified curriculum delivery","Custom organizational capability mapping","Ongoing technical competency development"],
    "how_ar":["تقديم مناهج معتمدة صناعياً","رسم خرائط القدرات المؤسسية المخصصة","تطوير الكفاءات التقنية المستمر"],
    "outcomes":["Sustainable Adoption","Institutional Knowledge","Operational Capacity"],
    "outcomes_ar":["تبني مستدام","معرفة مؤسسية","القدرة التشغيلية"]
  },
  {
    "id":"software-distribution","icon":"Leaf","category":"Technology","category_ar":"تقنية",
    "title":"Simulation Technology","title_ar":"تقنية المحاكاة",
    "solves":"Access proven engineering platforms selected based on objective requirements rather than vendor preference.",
    "solves_ar":"الوصول إلى منصات هندسية مثبتة مختارة بناءً على متطلبات موضوعية.",
    "how":["Requirements-led platform selection","Multi-vendor technology integration","Deployment and technical support"],
    "how_ar":["اختيار المنصات بناءً على المتطلبات","تكامل التقنيات متعددة البائعين","النشر والدعم الفني"],
    "outcomes":["Right-Fit Technology","Integrated Workflow","Long-Term Capability"],
    "outcomes_ar":["التقنية المناسبة","سير عمل متكامل","قدرات طويلة المدى"]
  }
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='services'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- Services CTA — EN
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'trust', 'Established partner to academic, government, and industrial entities across the GCC region', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Ready to establish advanced engineering capability?', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'btn', 'Contact KITES', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Services CTA — AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'trust', 'شريك مؤسس للكيانات الأكاديمية والحكومية والصناعية في منطقة الخليج', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'مستعد لبناء القدرات الهندسية المتقدمة؟', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'btn', 'تواصل مع كايتس', 'ar', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='services' AND s.section_key='cta'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;


-- ── EXPERTISE PAGE ──────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'hero',        'Hero Section',        1 FROM cms_pages p WHERE p.slug = 'expertise'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'methodology', 'Our Approach',         2 FROM cms_pages p WHERE p.slug = 'expertise'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'areas',       'Core Expertise Areas', 3 FROM cms_pages p WHERE p.slug = 'expertise'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'industries',  'Industries List',      4 FROM cms_pages p WHERE p.slug = 'expertise'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'leadership',  'Leadership & Impact',  5 FROM cms_pages p WHERE p.slug = 'expertise'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'metrics',     'Key Metrics',          6 FROM cms_pages p WHERE p.slug = 'expertise'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

-- Expertise hero — EN
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'eyebrow', 'Enterprise Simulation Capabilities', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Our Expertise', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'Our expertise is built on advanced simulation, engineering knowledge, research, and practical experience, enabling us to solve complex challenges across industries.', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Expertise hero — AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'eyebrow', 'قدرات المحاكاة للمؤسسات', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'خبراتنا', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'تعتمد خبراتنا على المحاكاة المتقدمة، والمعرفة الهندسية، والبحث العلمي، والخبرة العملية، مما يمكننا من معالجة التحديات المعقدة في مختلف القطاعات.', 'ar', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Expertise methodology — EN/AR title + steps JSON
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Our Approach', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='methodology'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'نهجنا', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='methodology'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'steps', '[
  {"title":"Simulation-Led","title_ar":"قائم على المحاكاة","desc":"Digital verification before physical prototypes.","desc_ar":"التحقق الرقمي قبل النماذج الأولية المادية."},
  {"title":"Data-Driven","title_ar":"مدفوع بالبيانات","desc":"Decisions backed by rigorous computational analysis.","desc_ar":"قرارات مدعومة بتحليل حسابي دقيق."},
  {"title":"Validation-Focused","title_ar":"التركيز على التحقق","desc":"Ensuring real-world accuracy and reliability.","desc_ar":"ضمان الدقة والموثوقية في العالم الحقيقي."}
]'::jsonb, 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='methodology'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- Expertise areas JSON
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {"icon":"cpu","title":"Simulation & CAE","title_ar":"المحاكاة والتحليل الهندسي","description":"De-risk innovation with high-fidelity digital verification before physical prototyping.","description_ar":"تقليل مخاطر الابتكار من خلال التحقق الرقمي عالي الدقة.","outcome":"Reduce prototyping costs by up to 40%.","outcome_ar":"تقليل تكاليف النماذج الأولية بنسبة تصل إلى 40٪."},
  {"icon":"chart","title":"Engineering Consulting","title_ar":"الاستشارات الهندسية","description":"Optimize complex systems through rigorous data validation and physics-based modeling.","description_ar":"تحسين الأنظمة المعقدة من خلال التحقق الدقيق من البيانات.","outcome":"Actionable reliability improvements.","outcome_ar":"تحسينات عملية وموثوقة."},
  {"icon":"leaf","title":"Sustainability Analysis","title_ar":"الاستدامة والتحليل البيئي","description":"Ensure regulatory compliance and minimize environmental footprint with LCA studies.","description_ar":"ضمان الامتثال التنظيمي وتقليل البصمة البيئية.","outcome":"Global environmental standard adherence.","outcome_ar":"الامتثال للمعايير البيئية العالمية."},
  {"icon":"graduation","title":"Training & Knowledge","title_ar":"التدريب ونقل المعرفة","description":"Build internal capability with applied technical mastery in simulation tools.","description_ar":"بناء القدرات الداخلية من خلال الإتقان التقني التطبيقي.","outcome":"Empowered, self-sufficient engineering teams.","outcome_ar":"فرق هندسية متمكنة ومكتفية ذاتياً."}
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='areas'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- Expertise industries
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Industries We Support', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='industries'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'الصناعات التي ندعمها', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='industries'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'list', '[
  {"en":"Energy & Oil & Gas","ar":"الطاقة والنفط والغاز"},
  {"en":"Infrastructure & Construction","ar":"البنية التحتية والإنشاءات"},
  {"en":"Manufacturing","ar":"التصنيع"},
  {"en":"Academia & Research","ar":"الأوساط الأكاديمية والبحثية"},
  {"en":"Government & Public Sector","ar":"القطاع الحكومي والعام"}
]'::jsonb, 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='industries'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;

-- Expertise leadership — EN/AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Leadership & Impact', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='leadership'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'Through research-driven methodologies and global partnerships, KITES empowers organizations to innovate confidently and responsibly.', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='leadership'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'الريادة والأثر', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='leadership'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'من خلال منهجيات قائمة على البحث العلمي وشراكات عالمية، يمكّن KITES المؤسسات من الابتكار بثقة ومسؤولية.', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='leadership'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Expertise metrics JSON
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {"value":"15+ Years","label":"Regional Experience","label_ar":"خبرة إقليمية"},
  {"value":"100+","label":"Simulation Projects","label_ar":"مشاريع محاكاة"},
  {"value":"30+","label":"Enterprise Clients","label_ar":"عملاء مؤسسيين"}
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='expertise' AND s.section_key='metrics'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;


-- ── TRAINING PAGE ───────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'hero',   'Hero Section',          1 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'banner', 'Offer Banner',           2 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'reviews','Student Reviews',        3 FROM cms_pages p WHERE p.slug = 'training'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

-- Training hero — EN
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Master Engineering Simulation', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'Industry-certified programs designed to build real engineering competency — from foundational skills to expert-level mastery.', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_primary', 'Explore Courses', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_secondary', 'Contact Us', 'en', 4
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Training hero — AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'أتقن المحاكاة الهندسية', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'subtitle', 'برامج معتمدة صناعياً مصممة لبناء كفاءة هندسية حقيقية — من المهارات الأساسية إلى الإتقان على مستوى الخبراء.', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'cta', 'cta_primary', 'استكشف الدورات', 'ar', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Training banner
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'message', 'Limited seats available — enroll now to secure your spot in the next cohort.', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='banner'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'message', 'مقاعد محدودة — سجّل الآن لتضمن مكانك في الدفعة القادمة.', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='banner'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Training reviews JSON
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {"name":"Abdullah K.","role":"Mechanical Engineer","company":"Kuwait Petroleum Corp","text":"The FEA training was game-changing. I applied the simulation techniques immediately to my current project. Highly recommended.","avatar":"AK"},
  {"name":"Sarah M.","role":"Architecture Student","company":"Kuwait University","text":"KITES helped me master SolidWorks before graduation. The certification gave me a huge advantage in job interviews.","avatar":"SM"},
  {"name":"Omar F.","role":"Senior Design Engineer","company":"KIPCO Group","text":"Professional instructors, practical curriculum, and real-world case studies. Best technical training I have attended.","avatar":"OF"}
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='training' AND s.section_key='reviews'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;


-- ── PARTNERS PAGE ───────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'hero', 'Hero Section', 1 FROM cms_pages p WHERE p.slug = 'partners'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'intro_text', 'Intro Text', 2 FROM cms_pages p WHERE p.slug = 'partners'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

-- Partners hero — EN/AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Our Technology Partners', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='partners' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'We partner with the world''s leading engineering simulation software companies to deliver best-in-class solutions across every discipline.', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='partners' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'شركاؤنا التقنيون', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='partners' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'نتشارك مع كبرى شركات برامج المحاكاة الهندسية في العالم لتقديم أفضل الحلول عبر كل التخصصات.', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='partners' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;


-- ── CONTACT PAGE ────────────────────────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'hero',    'Hero Section',     1 FROM cms_pages p WHERE p.slug = 'contact'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'details', 'Contact Details',  2 FROM cms_pages p WHERE p.slug = 'contact'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'trust',   'Trust Indicators', 3 FROM cms_pages p WHERE p.slug = 'contact'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

-- Contact hero — EN/AR
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Get In Touch', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'Whether you need a technical consultation, training program, or want to explore a long-term engineering partnership — we are here to help.', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'تواصل معنا', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'intro', 'سواء احتجت إلى استشارة تقنية أو برنامج تدريبي أو أردت استكشاف شراكة هندسية طويلة الأمد — نحن هنا للمساعدة.', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='hero'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Contact details
INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'email', 'info@kites-kw.com', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='details'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'phone', '+965 2200 0000', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='details'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'location', 'Kuwait City, Kuwait', 'en', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='details'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'text', 'location', 'مدينة الكويت، الكويت', 'ar', 3
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='details'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

-- Contact trust indicators
INSERT INTO cms_blocks (section_id, block_type, field_key, value_json, locale, sort_order)
SELECT s.id, 'json_array', 'items', '[
  {"label":"24h Response","label_ar":"رد خلال 24 ساعة"},
  {"label":"500+ Consultations","label_ar":"500+ استشارة"},
  {"label":"4.9★ Rating","label_ar":"تقييم 4.9★"}
]'::jsonb, 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='contact' AND s.section_key='trust'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_json = EXCLUDED.value_json;


-- ── HOME PAGE — add missing sections ────────────────────────────────
INSERT INTO cms_sections (page_id, section_key, display_name, sort_order)
SELECT p.id, 'who_we_are', 'Who We Are', 6 FROM cms_pages p WHERE p.slug = 'home'
ON CONFLICT (page_id, section_key) DO UPDATE SET display_name = EXCLUDED.display_name;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'Who We Are', 'en', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='home' AND s.section_key='who_we_are'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'KITES is Kuwait''s premier engineering simulation institute, delivering capability-building programs and technology solutions to government, academic, and industrial organizations across the GCC.', 'en', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='home' AND s.section_key='who_we_are'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'heading', 'title', 'من نحن', 'ar', 1
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='home' AND s.section_key='who_we_are'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;

INSERT INTO cms_blocks (section_id, block_type, field_key, value_text, locale, sort_order)
SELECT s.id, 'paragraph', 'description', 'كايتس هو المعهد الرائد في الكويت للمحاكاة الهندسية، يقدم برامج بناء القدرات وحلول التقنية للمنظمات الحكومية والأكاديمية والصناعية في منطقة الخليج.', 'ar', 2
FROM cms_sections s JOIN cms_pages p ON s.page_id = p.id WHERE p.slug='home' AND s.section_key='who_we_are'
ON CONFLICT (section_id, field_key, locale) DO UPDATE SET value_text = EXCLUDED.value_text;
