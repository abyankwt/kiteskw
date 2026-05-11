import { Request, Response, NextFunction } from 'express';
export declare function login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function refresh(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function logout(_req: Request, res: Response): Promise<void>;
export declare function me(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function registerPublic(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function changePassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map