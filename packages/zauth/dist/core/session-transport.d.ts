export interface SessionTransport {
    get(): Promise<string | null>;
    set(sessionId: string): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=session-transport.d.ts.map