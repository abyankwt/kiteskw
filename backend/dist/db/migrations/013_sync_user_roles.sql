-- Sync existing users into user_roles based on their legacy role column.
-- This ensures users created before the RBAC tables existed get permissions immediately.
-- Safe to re-run (ON CONFLICT DO NOTHING).

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = LOWER(u.role::text)
ON CONFLICT DO NOTHING;
