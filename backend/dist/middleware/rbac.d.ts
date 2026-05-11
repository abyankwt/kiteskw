import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';
export declare function requirePermission(key: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare function requireRole(roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireSuperAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireAdminOrAbove: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=rbac.d.ts.map