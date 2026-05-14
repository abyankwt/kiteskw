ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS display_location VARCHAR(20) NOT NULL DEFAULT 'all'
    CHECK (display_location IN ('all', 'homepage', 'training'));
