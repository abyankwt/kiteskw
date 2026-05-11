-- Migration 020: Add featured flag and order to courses for admin-controlled trending section

ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS featured       BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS featured_order INTEGER NOT NULL DEFAULT 0;

-- Mark the 9 SOLIDWORKS courses as featured, in enrollment-count order
UPDATE courses SET featured = TRUE, featured_order = CASE slug
    WHEN 'solidworks-level-1'              THEN 1
    WHEN 'solidworks-level-2'              THEN 2
    WHEN 'solidworks-simulation-level-1'   THEN 3
    WHEN 'solidworks-cam-level-1'          THEN 4
    WHEN 'solidworks-surfaces-modeling'    THEN 5
    WHEN 'solidworks-simulation-level-2'   THEN 6
    WHEN 'solidworks-sheet-metal-modeling' THEN 7
    WHEN 'solidworks-weldment-modeling'    THEN 8
    WHEN 'solidworks-cam-level-2'          THEN 9
    ELSE featured_order
END
WHERE slug IN (
    'solidworks-level-1', 'solidworks-level-2',
    'solidworks-simulation-level-1', 'solidworks-cam-level-1',
    'solidworks-surfaces-modeling', 'solidworks-simulation-level-2',
    'solidworks-sheet-metal-modeling', 'solidworks-weldment-modeling',
    'solidworks-cam-level-2'
);
