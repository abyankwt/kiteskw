-- Migration 019: Set prices and enrollment ranking for SOLIDWORKS courses

-- CAD Design SOLIDWORKS courses → 150 KWD
UPDATE courses SET
    price            = 150,
    enrollment_count = CASE slug
        WHEN 'solidworks-level-1'              THEN 420
        WHEN 'solidworks-level-2'              THEN 390
        WHEN 'solidworks-surfaces-modeling'    THEN 310
        WHEN 'solidworks-sheet-metal-modeling' THEN 280
        WHEN 'solidworks-weldment-modeling'    THEN 260
        WHEN 'solidworks-cam-level-1'          THEN 340
        WHEN 'solidworks-cam-level-2'          THEN 230
        ELSE enrollment_count
    END,
    updated_at = NOW()
WHERE slug IN (
    'solidworks-level-1',
    'solidworks-level-2',
    'solidworks-surfaces-modeling',
    'solidworks-sheet-metal-modeling',
    'solidworks-weldment-modeling',
    'solidworks-cam-level-1',
    'solidworks-cam-level-2'
);

-- Simulation SOLIDWORKS courses → 220 KWD
UPDATE courses SET
    price            = 220,
    enrollment_count = CASE slug
        WHEN 'solidworks-simulation-level-1' THEN 370
        WHEN 'solidworks-simulation-level-2' THEN 300
        ELSE enrollment_count
    END,
    updated_at = NOW()
WHERE slug IN (
    'solidworks-simulation-level-1',
    'solidworks-simulation-level-2'
);
