export interface SaveMediaDTO {
    filename: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    storagePath: string;
    uploadedBy: string;
}
export declare function saveMedia(dto: SaveMediaDTO): Promise<any>;
export declare function listMedia(page?: number, limit?: number): Promise<{
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
export declare function getMediaById(id: string): Promise<any>;
export declare function updateAltText(id: string, altText: string): Promise<any>;
export declare function deleteMedia(id: string): Promise<any>;
//# sourceMappingURL=media.service.d.ts.map