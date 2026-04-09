import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { jwtConfig } from '../config/jwt';
import { formatUser } from '../utils/helpers';

export async function loginUser(email: string, password: string) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email.toLowerCase().trim()]
  );

  if (rows.length === 0) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
  };

  const accessToken = jwt.sign(tokenPayload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  } as any);

  const refreshToken = jwt.sign(
    { id: user.id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn } as any
  );

  return { accessToken, refreshToken, user: formatUser(user) };
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: any;
  try {
    payload = jwt.verify(refreshToken, jwtConfig.refreshSecret);
  } catch {
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }

  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1 AND is_active = true',
    [payload.id]
  );

  if (rows.length === 0) {
    throw { status: 401, message: 'User not found' };
  }

  const user = rows[0];
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
  };

  const newAccessToken = jwt.sign(tokenPayload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  } as any);

  const newRefreshToken = jwt.sign(
    { id: user.id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn } as any
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: formatUser(user) };
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: string
) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw { status: 409, message: 'Email already in use' };
  }

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email.toLowerCase().trim(), hash, fullName, role]
  );

  return formatUser(rows[0]);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (rows.length === 0) throw { status: 404, message: 'User not found' };

  const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!valid) throw { status: 401, message: 'Current password is incorrect' };

  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [hash, userId]
  );
}
