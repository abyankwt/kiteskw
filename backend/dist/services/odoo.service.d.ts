export declare function queueSync(entityType: 'user' | 'payment' | 'course' | 'enrollment', entityId: string, operation: 'create' | 'update' | 'delete', payload: Record<string, any>): Promise<void>;
export declare function getPendingQueue(limit?: number): Promise<any[]>;
export declare function markSynced(id: string): Promise<void>;
export declare function markFailed(id: string, error: string): Promise<void>;
//# sourceMappingURL=odoo.service.d.ts.map