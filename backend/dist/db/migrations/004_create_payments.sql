CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id       UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES users(id),
  course_id           UUID NOT NULL REFERENCES courses(id),
  amount              NUMERIC(10,3) NOT NULL,
  currency            VARCHAR(10) NOT NULL DEFAULT 'KWD',
  status              payment_status NOT NULL DEFAULT 'pending',
  hesabe_order_id     VARCHAR(255),
  hesabe_payment_id   VARCHAR(255),
  hesabe_result_code  VARCHAR(50),
  gateway_response    JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user    ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status  ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_hesabe  ON payments(hesabe_order_id);
