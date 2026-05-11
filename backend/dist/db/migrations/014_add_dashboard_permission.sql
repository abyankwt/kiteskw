-- Add dashboard:view permission and assign to super_admin only
INSERT INTO permissions (module, action, key, description)
VALUES ('dashboard', 'view', 'dashboard:view', 'View the admin dashboard overview')
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'super_admin' AND p.key = 'dashboard:view'
ON CONFLICT DO NOTHING;
