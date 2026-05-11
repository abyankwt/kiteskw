import { Request, Response, NextFunction } from 'express';
export declare function listPublished(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function recordView(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listFeatured(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listAll(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function update(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function publish(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function unpublish(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function setFeatured(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function reorderFeatured(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=courses.controller.d.ts.map