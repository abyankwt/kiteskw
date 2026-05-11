import pool from '../db/pool';

// Simple in-process permission cache: userId → permission keys[]
// Invalidated on role assignment changes.
const permissionCache = new Map<string, { keys: string[]; cachedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getUserPermissions(userId: string): Promise<string[]> {
  const cached = permissionCache.get(userId);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.keys;
  }

  const { rows } = await pool.query(
    `SELECT DISTINCT p.key
     FROM user_roles ur
     JOIN role_permissions rp ON rp.role_id = ur.role_id
     JOIN permissions p ON p.id = rp.permission_id
     WHERE ur.user_id = $1`,
    [userId]
  );

  const keys = rows.map((r: any) => r.key as string);
  permissionCache.set(userId, { keys, cachedAt: Date.now() });
  return keys;
}

export function invalidateUserCache(userId: string) {
  permissionCache.delete(userId);
}

export async function getRoles() {
  const { rows } = await pool.query(
    `SELECT r.id, r.name, r.display_name, r.description, r.is_system, r.created_at,
            COALESCE(json_agg(p.key) FILTER (WHERE p.key IS NOT NULL), '[]') AS permissions
     FROM roles r
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     GROUP BY r.id
     ORDER BY r.is_system DESC, r.created_at ASC`
  );
  return rows;
}

export async function createRole(name: string, displayName: string, description?: string) {
  const { rows } = await pool.query(
    `INSERT INTO roles (name, display_name, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [name.toLowerCase().replace(/\s+/g, '_'), displayName, description || null]
  );
  return rows[0];
}

export async function updateRole(id: string, displayName: string, description?: string) {
  const { rows } = await pool.query(
    `UPDATE roles SET display_name = $1, description = $2 WHERE id = $3 AND is_system = false RETURNING *`,
    [displayName, description || null, id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Role not found or is a system role' };
  return rows[0];
}

export async function deleteRole(id: string) {
  const { rows } = await pool.query(
    `DELETE FROM roles WHERE id = $1 AND is_system = false RETURNING id`,
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Role not found or is a system role' };
}

export async function setRolePermissions(roleId: string, permissionKeys: string[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Replace all permissions for this role
    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
    if (permissionKeys.length > 0) {
      const { rows: perms } = await client.query(
        'SELECT id FROM permissions WHERE key = ANY($1)',
        [permissionKeys]
      );
      for (const perm of perms) {
        await client.query(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [roleId, perm.id]
        );
      }
    }
    await client.query('COMMIT');
    // Invalidate all user caches for this role
    const { rows: users } = await client.query(
      'SELECT user_id FROM user_roles WHERE role_id = $1',
      [roleId]
    );
    users.forEach((u: any) => invalidateUserCache(u.user_id));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getAllPermissions() {
  const { rows } = await pool.query(
    'SELECT * FROM permissions ORDER BY module, action'
  );
  return rows;
}

export async function getUserRoles(userId: string) {
  const { rows } = await pool.query(
    `SELECT r.id, r.name, r.display_name, r.description, ur.granted_at
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY ur.granted_at ASC`,
    [userId]
  );
  return rows;
}

export async function assignRoleToUser(userId: string, roleId: string, grantedBy: string) {
  await pool.query(
    `INSERT INTO user_roles (user_id, role_id, granted_by) VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [userId, roleId, grantedBy]
  );
  invalidateUserCache(userId);
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  await pool.query(
    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
    [userId, roleId]
  );
  invalidateUserCache(userId);
}
