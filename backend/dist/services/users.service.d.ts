export declare function listUsers(filters: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
}): Promise<{
    data: {
        id: any;
        email: any;
        fullName: any;
        role: any;
        isActive: any;
        createdAt: any;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getUserById(id: string): Promise<{
    enrollments: any[];
    id: any;
    email: any;
    fullName: any;
    role: any;
    isActive: any;
    createdAt: any;
}>;
export declare function updateUser(id: string, updates: {
    role?: string;
    isActive?: boolean;
}): Promise<{
    id: any;
    email: any;
    fullName: any;
    role: any;
    isActive: any;
    createdAt: any;
}>;
export declare function deactivateUser(id: string): Promise<void>;
//# sourceMappingURL=users.service.d.ts.map