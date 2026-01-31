export declare function createAuth(opts: {
    prisma: any;
    session?: {
        cookieName?: string;
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
        requireUser: () => Promise<any>;
        getUser: () => Promise<any>;
    };
    acl: {
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
    middleware: () => (req: Request) => Promise<import("undici-types").Response | undefined>;
    requireAuth: (req: Request) => Promise<import("next/server").NextResponse | void>;
};
//# sourceMappingURL=create-auth.d.ts.map