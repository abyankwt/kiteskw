import * as hesabeService from './hesabe.service';
export declare function guestCheckout({ courseId, fullName, email, phone }: {
    courseId: string;
    fullName: string;
    email: string;
    phone?: string;
}): Promise<{
    free: boolean;
    courseTitle: any;
    paymentUrl?: undefined;
    orderId?: undefined;
} | {
    free: boolean;
    paymentUrl: string;
    orderId: any;
    courseTitle?: undefined;
}>;
export declare function initiateCheckout(userId: string, courseId: string): Promise<{
    free: boolean;
    courseTitle: any;
    paymentUrl?: undefined;
    orderId?: undefined;
} | {
    free: boolean;
    paymentUrl: string;
    orderId: any;
    courseTitle?: undefined;
}>;
export declare function handleWebhook(encryptedData: string): Promise<hesabeService.HesabeDecryptedResponse>;
export declare function getUserEnrollments(userId: string): Promise<any[]>;
export declare function getAllEnrollments(filters: {
    page?: number;
    limit?: number;
    courseId?: string;
    status?: string;
}): Promise<{
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
//# sourceMappingURL=enrollments.service.d.ts.map