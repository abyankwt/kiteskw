-- Seed all permissions and system roles

INSERT INTO permissions (key, module, action, description) VALUES
  ('cms:read',            'cms',         'read',    'View CMS pages and content'),
  ('cms:edit',            'cms',         'edit',    'Edit CMS content blocks'),
  ('cms:publish',         'cms',         'publish', 'Publish / unpublish CMS pages'),
  ('courses:read',        'courses',     'read',    'View all courses including drafts'),
  ('courses:create',      'courses',     'create',  'Create new courses'),
  ('courses:edit',        'courses',     'edit',    'Edit existing courses'),
  ('courses:delete',      'courses',     'delete',  'Archive / delete courses'),
  ('courses:publish',     'courses',     'publish', 'Publish or unpublish courses'),
  ('enrollments:read',    'enrollments', 'read',    'View enrollments'),
  ('enrollments:manage',  'enrollments', 'manage',  'Change enrollment status'),
  ('payments:view',       'payments',    'view',    'View payment records'),
  ('payments:refund',     'payments',    'refund',  'Process refunds'),
  ('users:read',          'users',       'read',    'View user accounts'),
  ('users:manage',        'users',       'manage',  'Create / edit / deactivate users'),
  ('analytics:view',      'analytics',   'view',    'View analytics dashboard'),
  ('roles:manage',        'roles',       'manage',  'Manage roles and permissions'),
  ('media:upload',        'media',       'upload',  'Upload media files'),
  ('media:delete',        'media',       'delete',  'Delete media files')
ON CONFLICT (key) DO NOTHING;

-- System roles
INSERT INTO roles (name, display_name, description, is_system) VALUES
  ('super_admin',    'Super Admin',    'Full system access — cannot be deleted', true),
  ('content_editor', 'Content Editor', 'Manage website content via CMS',         true),
  ('course_manager', 'Course Manager', 'Manage courses and enrollments',          true),
  ('analyst',        'Analyst',        'Read-only analytics and reports',         true)
ON CONFLICT (name) DO NOTHING;

-- super_admin → ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r CROSS JOIN permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- content_editor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.key = ANY(ARRAY[
  'cms:read', 'cms:edit', 'media:upload'
])
WHERE r.name = 'content_editor'
ON CONFLICT DO NOTHING;

-- course_manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.key = ANY(ARRAY[
  'courses:read', 'courses:create', 'courses:edit', 'courses:delete', 'courses:publish',
  'enrollments:read', 'enrollments:manage', 'media:upload'
])
WHERE r.name = 'course_manager'
ON CONFLICT DO NOTHING;

-- analyst permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.key = ANY(ARRAY[
  'analytics:view', 'payments:view', 'enrollments:read', 'courses:read'
])
WHERE r.name = 'analyst'
ON CONFLICT DO NOTHING;
