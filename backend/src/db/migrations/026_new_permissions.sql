INSERT INTO permissions (key, module, action, description) VALUES
  ('coupons:read',     'coupons',  'read',     'View coupons'),
  ('coupons:write',    'coupons',  'write',    'Create and edit coupons'),
  ('coupons:delete',   'coupons',  'delete',   'Delete coupons'),
  ('payment:settings', 'payments', 'settings', 'View and test payment gateway settings'),
  ('blog:read',        'blog',     'read',     'View blog posts'),
  ('blog:write',       'blog',     'write',    'Create and edit blog posts and testimonials'),
  ('blog:delete',      'blog',     'delete',   'Delete blog posts'),
  ('gallery:read',     'gallery',  'read',     'View galleries'),
  ('gallery:write',    'gallery',  'write',    'Create and manage galleries'),
  ('gallery:delete',   'gallery',  'delete',   'Delete galleries')
ON CONFLICT (key) DO NOTHING;

-- Grant all new permissions to super_admin (which already has ALL, so this is a safety net)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'super_admin'
  AND p.key IN (
    'coupons:read','coupons:write','coupons:delete','payment:settings',
    'blog:read','blog:write','blog:delete',
    'gallery:read','gallery:write','gallery:delete'
  )
ON CONFLICT DO NOTHING;

-- Also check the admin-area permission keys used in existing code
-- dashboard:view is used in AdminSidebar but seeded elsewhere
