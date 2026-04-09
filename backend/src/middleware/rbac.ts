import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';

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

// Convenience guards
export const requireAdmin = requireRole(['SUPER_ADMIN', 'ADMIN', 'STAFF']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);
export const requireAdminOrAbove = requireRole(['SUPER_ADMIN', 'ADMIN']);
