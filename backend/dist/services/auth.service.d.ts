export declare function loginUser(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: any;
        email: any;
        fullName: any;
        role: any;
        isActive: any;
        createdAt: any;
    };
    permissions: string[];
}>;
export declare function refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: any;
        email: any;
        fullName: any;
        role: any;
        isActive: any;
        createdAt: any;
    };
    permissions: string[];
}>;
export declare function createUser(email: string, password: string, fullName: string, role: string): Promise<{
    id: any;
    email: any;
    fullName: any;
    role: any;
    isActive: any;
    createdAt: any;
}>;
export declare function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map