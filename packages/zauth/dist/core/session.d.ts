import { SessionTransport } from "./session-transport";
export declare function createSessionService(prisma: any, transport: SessionTransport, ttlSeconds: number): {
    getSession: () => Promise<any>;
    create: (userId: string) => Promise<any>;
    clear: () => Promise<void>;
};
//# sourceMappingURL=session.d.ts.map