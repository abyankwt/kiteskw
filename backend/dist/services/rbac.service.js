"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPermissions = getUserPermissions;
exports.invalidateUserCache = invalidateUserCache;
exports.getRoles = getRoles;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
exports.setRolePermissions = setRolePermissions;
exports.getAllPermissions = getAllPermissions;
exports.getUserRoles = getUserRoles;
exports.assignRoleToUser = assignRoleToUser;
exports.removeRoleFromUser = removeRoleFromUser;
const pool_1 = __importDefault(require("../db/pool"));
// Simple in-process permission cache: userId → permission keys[]
// Invalidated on role assignment changes.
const permissionCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
async function getUserPermissions(userId) {
    const cached = permissionCache.get(userId);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        return cached.keys;
    }
    const { rows } = await pool_1.default.query(`SELECT DISTINCT p.key
     FROM user_roles ur
     JOIN role_permissions rp ON rp.role_id = ur.role_id
     JOIN permissions p ON p.id = rp.permission_id
     WHERE ur.user_id = $1`, [userId]);
    const keys = rows.map((r) => r.key);
    permissionCache.set(userId, { keys, cachedAt: Date.now() });
    return keys;
}
function invalidateUserCache(userId) {
    permissionCache.delete(userId);
}
async function getRoles() {
    const { rows } = await pool_1.default.query(`SELECT r.id, r.name, r.display_name, r.description, r.is_system, r.created_at,
            COALESCE(json_agg(p.key) FILTER (WHERE p.key IS NOT NULL), '[]') AS permissions
     FROM roles r
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     GROUP BY r.id
     ORDER BY r.is_system DESC, r.created_at ASC`);
    return rows;
}
async function createRole(name, displayName, description) {
    const { rows } = await pool_1.default.query(`INSERT INTO roles (name, display_name, description)
     VALUES ($1, $2, $3) RETURNING *`, [name.toLowerCase().replace(/\s+/g, '_'), displayName, description || null]);
    return rows[0];
}
async function updateRole(id, displayName, description) {
    const { rows } = await pool_1.default.query(`UPDATE roles SET display_name = $1, description = $2 WHERE id = $3 AND is_system = false RETURNING *`, [displayName, description || null, id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Role not found or is a system role' };
    return rows[0];
}
async function deleteRole(id) {
    const { rows } = await pool_1.default.query(`DELETE FROM roles WHERE id = $1 AND is_system = false RETURNING id`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Role not found or is a system role' };
}
async function setRolePermissions(roleId, permissionKeys) {
    const client = await pool_1.default.connect();
    try {
        await client.query('BEGIN');
        // Replace all permissions for this role
        await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
        if (permissionKeys.length > 0) {
            const { rows: perms } = await client.query('SELECT id FROM permissions WHERE key = ANY($1)', [permissionKeys]);
            for (const perm of perms) {
                await client.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [roleId, perm.id]);
            }
        }
        await client.query('COMMIT');
        // Invalidate all user caches for this role
        const { rows: users } = await client.query('SELECT user_id FROM user_roles WHERE role_id = $1', [roleId]);
        users.forEach((u) => invalidateUserCache(u.user_id));
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}
async function getAllPermissions() {
    const { rows } = await pool_1.default.query('SELECT * FROM permissions ORDER BY module, action');
    return rows;
}
async function getUserRoles(userId) {
    const { rows } = await pool_1.default.query(`SELECT r.id, r.name, r.display_name, r.description, ur.granted_at
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY ur.granted_at ASC`, [userId]);
    return rows;
}
async function assignRoleToUser(userId, roleId, grantedBy) {
    await pool_1.default.query(`INSERT INTO user_roles (user_id, role_id, granted_by) VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`, [userId, roleId, grantedBy]);
    invalidateUserCache(userId);
}
async function removeRoleFromUser(userId, roleId) {
    await pool_1.default.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
    invalidateUserCache(userId);
}
//# sourceMappingURL=rbac.service.js.map