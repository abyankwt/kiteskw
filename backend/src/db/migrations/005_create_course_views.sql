CREATE TABLE IF NOT EXISTS course_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address  INET
);

CREATE INDEX IF NOT EXISTS idx_course_views_course ON course_views(course_id);
CREATE INDEX IF NOT EXISTS idx_course_views_date   ON course_views(viewed_at);
