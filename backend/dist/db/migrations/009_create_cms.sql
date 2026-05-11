-- CMS: media library + page/section/block content model

CREATE TABLE IF NOT EXISTS media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  size_bytes    INTEGER NOT NULL,
  storage_path  VARCHAR(1000) NOT NULL,
  alt_text      VARCHAR(500),
  uploaded_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_pages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(255) UNIQUE NOT NULL,
  title            VARCHAR(255) NOT NULL,
  meta_title       VARCHAR(255),
  meta_description TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  published_at     TIMESTAMPTZ,
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_sections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id      UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  section_key  VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page_id, section_key)
);

CREATE TABLE IF NOT EXISTS cms_blocks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id     UUID NOT NULL REFERENCES cms_sections(id) ON DELETE CASCADE,
  block_type     VARCHAR(100) NOT NULL,
  field_key      VARCHAR(255) NOT NULL,
  value_text     TEXT,
  value_json     JSONB,
  value_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  locale         VARCHAR(10) NOT NULL DEFAULT 'en',
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section_id, field_key, locale)
);

CREATE TABLE IF NOT EXISTS cms_revisions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id       UUID NOT NULL REFERENCES cms_blocks(id) ON DELETE CASCADE,
  previous_value TEXT,
  new_value      TEXT,
  changed_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_sections_page    ON cms_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_blocks_section   ON cms_blocks(section_id, locale);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_block  ON cms_revisions(block_id);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by    ON media(uploaded_by);
