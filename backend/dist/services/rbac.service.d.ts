export declare function getUserPermissions(userId: string): Promise<string[]>;
export declare function invalidateUserCache(userId: string): void;
export declare function getRoles(): Promise<any[]>;
export declare function createRole(name: string, displayName: string, description?: string): Promise<any>;
export declare function updateRole(id: string, displayName: string, description?: string): Promise<any>;
export declare function deleteRole(id: string): Promise<void>;
export declare function setRolePermissions(roleId: string, permissionKeys: string[]): Promise<void>;
export declare function getAllPermissions(): Promise<any[]>;
export declare function getUserRoles(userId: string): Promise<any[]>;
export declare function assignRoleToUser(userId: string, roleId: string, grantedBy: string): Promise<void>;
export declare function removeRoleFromUser(userId: string, roleId: string): Promise<void>;
//# sourceMappingURL=rbac.service.d.ts.map