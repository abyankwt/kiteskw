import { Request, Response, NextFunction } from 'express';
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map