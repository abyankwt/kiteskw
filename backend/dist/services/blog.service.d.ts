export interface BlogPostDto {
    title: string;
    content?: string;
    excerpt?: string;
    thumbnailUrl?: string;
    category?: string;
    tags?: string[];
}
export declare function listPosts(publishedOnly?: boolean, page?: number, limit?: number, category?: string): Promise<{
    data: {
        id: any;
        title: any;
        slug: any;
        content: any;
        excerpt: any;
        thumbnailUrl: any;
        category: any;
        tags: any;
        isPublished: any;
        publishedAt: any;
        authorName: any;
        createdAt: any;
        updatedAt: any;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getPostBySlug(slug: string): Promise<{
    id: any;
    title: any;
    slug: any;
    content: any;
    excerpt: any;
    thumbnailUrl: any;
    category: any;
    tags: any;
    isPublished: any;
    publishedAt: any;
    authorName: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function getPostById(id: string): Promise<{
    id: any;
    title: any;
    slug: any;
    content: any;
    excerpt: any;
    thumbnailUrl: any;
    category: any;
    tags: any;
    isPublished: any;
    publishedAt: any;
    authorName: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function createPost(dto: BlogPostDto, authorId: string): Promise<{
    id: any;
    title: any;
    slug: any;
    content: any;
    excerpt: any;
    thumbnailUrl: any;
    category: any;
    tags: any;
    isPublished: any;
    publishedAt: any;
    authorName: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function updatePost(id: string, dto: Partial<BlogPostDto>): Promise<{
    id: any;
    title: any;
    slug: any;
    content: any;
    excerpt: any;
    thumbnailUrl: any;
    category: any;
    tags: any;
    isPublished: any;
    publishedAt: any;
    authorName: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function publishPost(id: string): Promise<{
    id: any;
    title: any;
    slug: any;
    content: any;
    excerpt: any;
    thumbnailUrl: any;
    category: any;
    tags: any;
    isPublished: any;
    publishedAt: any;
    authorName: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function unpublishPost(id: string): Promise<{
    id: any;
    title: any;
    slug: any;
    content: any;
    excerpt: any;
    thumbnailUrl: any;
    category: any;
    tags: any;
    isPublished: any;
    publishedAt: any;
    authorName: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function deletePost(id: string): Promise<void>;
//# sourceMappingURL=blog.service.d.ts.map