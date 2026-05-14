export interface GalleryDto {
    title: string;
    description?: string;
    eventDate?: string | null;
    coverImageUrl?: string | null;
    isPublished?: boolean;
    sortOrder?: number;
}
export declare function listGalleries(publishedOnly?: boolean): Promise<{
    id: any;
    title: any;
    description: any;
    eventDate: any;
    coverImageUrl: any;
    isPublished: any;
    sortOrder: any;
    photoCount: any;
    createdAt: any;
}[]>;
export declare function getGallery(id: string): Promise<{
    items: {
        id: any;
        galleryId: any;
        mediaId: any;
        caption: any;
        sortOrder: any;
        url: string;
        filename: any;
        originalName: any;
    }[];
    id: any;
    title: any;
    description: any;
    eventDate: any;
    coverImageUrl: any;
    isPublished: any;
    sortOrder: any;
    photoCount: any;
    createdAt: any;
}>;
export declare function createGallery(dto: GalleryDto, createdBy: string): Promise<{
    id: any;
    title: any;
    description: any;
    eventDate: any;
    coverImageUrl: any;
    isPublished: any;
    sortOrder: any;
    photoCount: any;
    createdAt: any;
}>;
export declare function updateGallery(id: string, dto: Partial<GalleryDto>): Promise<{
    id: any;
    title: any;
    description: any;
    eventDate: any;
    coverImageUrl: any;
    isPublished: any;
    sortOrder: any;
    photoCount: any;
    createdAt: any;
}>;
export declare function deleteGallery(id: string): Promise<void>;
export declare function addGalleryItem(galleryId: string, mediaId: string, caption?: string): Promise<any>;
export declare function removeGalleryItem(itemId: string): Promise<void>;
export declare function reorderGalleryItems(galleryId: string, orderedIds: string[]): Promise<void>;
//# sourceMappingURL=gallery.service.d.ts.map