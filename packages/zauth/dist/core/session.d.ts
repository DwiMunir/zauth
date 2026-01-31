export declare function createSessionService(prisma: any, cookieName: string, ttlSeconds: number): {
    getSession: () => Promise<any>;
    create: (userId: string) => Promise<any>;
    clear: () => Promise<void>;
};
//# sourceMappingURL=session.d.ts.map