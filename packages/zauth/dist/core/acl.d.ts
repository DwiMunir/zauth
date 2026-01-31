type PermissionKey = string;
type AuthUser = {
    id: string;
    email: string;
    permissions: PermissionKey[];
};
export declare function createACLService(prisma: any): {
    loadUserWithPermissions: (userId: string) => Promise<any>;
    can: (user: AuthUser | null, permission: PermissionKey) => boolean;
    sync: (config: {
        roles: Record<string, PermissionKey[]>;
    }) => Promise<void>;
};
export {};
//# sourceMappingURL=acl.d.ts.map