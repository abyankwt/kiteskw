import pool from '../db/pool';
import { formatUser } from '../utils/helpers';

export async function listUsers(filters: { page?: number; limit?: number; role?: string; search?: string }) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, filters.limit || 20);
  const offset = (page - 1) * limit;

  const conditions: string[] = ['1=1'];
  const params: any[] = [];
  let i = 0;

  if (filters.role) {
    i++; conditions.push(`role = $${i}`); params.push(filters.role);
  }
  if (filters.search) {
    i++; conditions.push(`(email ILIKE $${i} OR full_name ILIKE $${i})`); params.push(`%${filters.search}%`);
  }

  const where = conditions.join(' AND ');
  const countResult = await pool.query(`SELECT COUNT(*) FROM users WHERE ${where}`, params);
  const total = parseInt(countResult.rows[0].count);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE ${where} ORDER BY created_at DESC LIMIT $${i+1} OFFSET $${i+2}`,
    params
  );

  return {
    data: rows.map(formatUser),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getUserById(id: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (rows.length === 0) throw { status: 404, message: 'User not found' };

  const enrollments = await pool.query(
    `SELECT e.*, c.title as course_title, c.thumbnail_url
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1
     ORDER BY e.enrolled_at DESC`,
    [id]
  );

  return {
    ...formatUser(rows[0]),
    enrollments: enrollments.rows,
  };
}

export async function updateUser(id: string, updates: { role?: string; isActive?: boolean }) {
  const fields: string[] = [];
  const params: any[] = [];
  let i = 0;

  if (updates.role !== undefined) {
    i++; fields.push(`role = $${i}`); params.push(updates.role);
  }
  if (updates.isActive !== undefined) {
    i++; fields.push(`is_active = $${i}`); params.push(updates.isActive);
  }

  if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const { rows } = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${i+1} RETURNING *`,
    params
  );

  if (rows.length === 0) throw { status: 404, message: 'User not found' };
  return formatUser(rows[0]);
}

export async function deactivateUser(id: string) {
  const { rows } = await pool.query(
    'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: 'User not found' };
}
