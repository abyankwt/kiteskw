CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Professional');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE IF NOT EXISTS courses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(500) NOT NULL,
  slug             VARCHAR(500) UNIQUE NOT NULL,
  description      TEXT,
  short_desc       VARCHAR(500),
  category         VARCHAR(100) NOT NULL,
  price            NUMERIC(10,3) NOT NULL DEFAULT 0,
  discount_percent SMALLINT NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  thumbnail_url    VARCHAR(1000),
  gallery_urls     TEXT[] DEFAULT '{}',
  duration         VARCHAR(100),
  level            course_level NOT NULL DEFAULT 'Intermediate',
  instructor       VARCHAR(255),
  tags             TEXT[] DEFAULT '{}',
  status           course_status NOT NULL DEFAULT 'draft',
  rating           NUMERIC(3,2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  enrollment_count INTEGER NOT NULL DEFAULT 0,
  certified        BOOLEAN NOT NULL DEFAULT false,
  color            VARCHAR(20) DEFAULT '#6b7280',
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_status   ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_slug     ON courses(slug);
