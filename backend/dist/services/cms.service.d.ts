export declare function getPages(): Promise<any[]>;
export declare function getPageBySlug(slug: string): Promise<{
    id: any;
    slug: any;
    title: any;
    meta_title: any;
    meta_description: any;
    is_published: any;
    updated_at: any;
    sections: Record<string, any>;
}>;
export declare function publishPage(slug: string, userId: string): Promise<any>;
export declare function unpublishPage(slug: string, userId: string): Promise<any>;
export declare function updatePageMeta(slug: string, userId: string, data: {
    title?: string;
    meta_title?: string;
    meta_description?: string;
}): Promise<any>;
export declare function toggleSection(sectionId: string, isVisible: boolean): Promise<any>;
export declare function getSectionBlocks(sectionId: string): Promise<any[]>;
export declare function getBlock(blockId: string): Promise<any>;
export declare function updateBlock(blockId: string, userId: string, data: {
    value_text?: string;
    value_json?: any;
    value_media_id?: string | null;
}): Promise<any>;
export declare function getBlockHistory(blockId: string): Promise<any[]>;
export declare function revertBlock(blockId: string, revisionId: string, userId: string): Promise<any>;
//# sourceMappingURL=cms.service.d.ts.map