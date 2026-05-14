export interface TestimonialDto {
    clientName: string;
    clientRole?: string;
    clientCompany?: string;
    content: string;
    rating?: number;
    avatarUrl?: string;
    courseId?: string | null;
    isPublished?: boolean;
    sortOrder?: number;
}
export declare function listTestimonials(publishedOnly?: boolean): Promise<{
    id: any;
    clientName: any;
    clientRole: any;
    clientCompany: any;
    content: any;
    rating: any;
    avatarUrl: any;
    courseId: any;
    courseTitle: any;
    isPublished: any;
    sortOrder: any;
    createdAt: any;
}[]>;
export declare function createTestimonial(dto: TestimonialDto): Promise<{
    id: any;
    clientName: any;
    clientRole: any;
    clientCompany: any;
    content: any;
    rating: any;
    avatarUrl: any;
    courseId: any;
    courseTitle: any;
    isPublished: any;
    sortOrder: any;
    createdAt: any;
}>;
export declare function updateTestimonial(id: string, dto: Partial<TestimonialDto>): Promise<{
    id: any;
    clientName: any;
    clientRole: any;
    clientCompany: any;
    content: any;
    rating: any;
    avatarUrl: any;
    courseId: any;
    courseTitle: any;
    isPublished: any;
    sortOrder: any;
    createdAt: any;
}>;
export declare function deleteTestimonial(id: string): Promise<void>;
export declare function reorderTestimonials(orderedIds: string[]): Promise<void>;
//# sourceMappingURL=testimonials.service.d.ts.map