import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import pool from '../db/pool';
import { formatUser } from '../utils/helpers';

const REFRESH_COOKIE = 'kites_refresh';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { accessToken, refreshToken, user } = await authService.loginUser(email, password);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const { accessToken, refreshToken, user } = await authService.refreshAccessToken(token);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/' });
  res.json({ message: 'Logged out' });
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user!.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(rows[0]));
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, fullName, role = 'STUDENT' } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }
    const user = await authService.createUser(email, password, fullName, role);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}
