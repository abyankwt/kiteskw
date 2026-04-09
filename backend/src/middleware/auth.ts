import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, jwtConfig.accessSecret) as any;
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
}
