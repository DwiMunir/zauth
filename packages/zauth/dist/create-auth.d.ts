import { SessionTransport } from "./core/session-transport";
export declare function createAuth(opts: {
    prisma: any;
    session: {
        transport: SessionTransport;
        ttlSeconds?: number;
    };
    defaults?: {
        role?: string;
    };
}): {
    auth: {
        register: (email: string, password: string) => Promise<any>;
        login(email: string, password: string): Promise<any>;
        logout: () => Promise<void>;
    };
    session: {
        getUser: () => Promise<any>;
        requireUser: () => Promise<any>;
    };
    acl: {
        loadUserWithPermissions: (userId: string) => Promise<any>;
        can: (user: {
            id: string;
            email: string;
            permissions: string[];
        } | null, permission: string) => boolean;
        sync: (config: {
            roles: Record<string, string[]>;
        }) => Promise<void>;
    };
    audit: {
        log(data: {
            userId?: string;
            action: string;
            resource: string;
            meta?: any;
        }): any;
    };
};
//# sourceMappingURL=create-auth.d.ts.map