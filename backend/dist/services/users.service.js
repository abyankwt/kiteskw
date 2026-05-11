"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deactivateUser = deactivateUser;
const pool_1 = __importDefault(require("../db/pool"));
const helpers_1 = require("../utils/helpers");
async function listUsers(filters) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];
    let i = 0;
    if (filters.role) {
        i++;
        conditions.push(`role = $${i}`);
        params.push(filters.role);
    }
    if (filters.search) {
        i++;
        conditions.push(`(email ILIKE $${i} OR full_name ILIKE $${i})`);
        params.push(`%${filters.search}%`);
    }
    const where = conditions.join(' AND ');
    const countResult = await pool_1.default.query(`SELECT COUNT(*) FROM users WHERE ${where}`, params);
    const total = parseInt(countResult.rows[0].count);
    params.push(limit, offset);
    const { rows } = await pool_1.default.query(`SELECT * FROM users WHERE ${where} ORDER BY created_at DESC LIMIT $${i + 1} OFFSET $${i + 2}`, params);
    return {
        data: rows.map(helpers_1.formatUser),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
async function getUserById(id) {
    const { rows } = await pool_1.default.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'User not found' };
    const enrollments = await pool_1.default.query(`SELECT e.*, c.title as course_title, c.thumbnail_url
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1
     ORDER BY e.enrolled_at DESC`, [id]);
    return {
        ...(0, helpers_1.formatUser)(rows[0]),
        enrollments: enrollments.rows,
    };
}
async function updateUser(id, updates) {
    const fields = [];
    const params = [];
    let i = 0;
    if (updates.role !== undefined) {
        i++;
        fields.push(`role = $${i}`);
        params.push(updates.role);
    }
    if (updates.isActive !== undefined) {
        i++;
        fields.push(`is_active = $${i}`);
        params.push(updates.isActive);
    }
    if (fields.length === 0)
        throw { status: 400, message: 'No fields to update' };
    fields.push(`updated_at = NOW()`);
    params.push(id);
    const { rows } = await pool_1.default.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${i + 1} RETURNING *`, params);
    if (rows.length === 0)
        throw { status: 404, message: 'User not found' };
    return (0, helpers_1.formatUser)(rows[0]);
}
async function deactivateUser(id) {
    const { rows } = await pool_1.default.query('UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id', [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'User not found' };
}
//# sourceMappingURL=users.service.js.map