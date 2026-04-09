CREATE TYPE enrollment_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status       enrollment_status NOT NULL DEFAULT 'pending',
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  amount_paid  NUMERIC(10,3),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user   ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_date   ON enrollments(enrolled_at);
