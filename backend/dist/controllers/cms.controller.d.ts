import { Request, Response } from 'express';
export declare function listPages(req: Request, res: Response): Promise<void>;
export declare function getPage(req: Request, res: Response): Promise<void>;
export declare function publishPage(req: Request, res: Response): Promise<void>;
export declare function unpublishPage(req: Request, res: Response): Promise<void>;
export declare function updatePageMeta(req: Request, res: Response): Promise<void>;
export declare function toggleSection(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getSectionBlocks(req: Request, res: Response): Promise<void>;
export declare function updateBlock(req: Request, res: Response): Promise<void>;
export declare function getBlockHistory(req: Request, res: Response): Promise<void>;
export declare function revertBlock(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=cms.controller.d.ts.map