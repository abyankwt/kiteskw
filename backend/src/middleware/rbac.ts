import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';

// Permission-based guard (preferred — fine-grained)
export function requirePermission(key: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!req.user.permissions.includes(key)) {
      return res.status(403).json({ error: 'Insufficient permissions', required: key });
    }
    next();
  };
}

// Role-based guard (kept for backwards compatibility with existing routes)
export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export const requireAdmin      = requireRole(['SUPER_ADMIN', 'ADMIN', 'STAFF']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);
export const requireAdminOrAbove = requireRole(['SUPER_ADMIN', 'ADMIN']);
