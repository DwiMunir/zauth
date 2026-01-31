export interface AuditLogEntry {
    id: string;
    event: string;
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export interface AuditLogOptions {
    maxEntries?: number;
    retentionDays?: number;
    enableConsole?: boolean;
    enableFile?: boolean;
    filePath?: string;
}
export declare class AuditLogger {
    private logs;
    private options;
    constructor(options?: AuditLogOptions);
    log(event: string, data: {
        userId?: string;
        email?: string;
        ip?: string;
        userAgent?: string;
        [key: string]: any;
    }): AuditLogEntry;
    getLogs(filters?: {
        userId?: string;
        email?: string;
        event?: string;
        startDate?: Date;
        endDate?: Date;
    }): AuditLogEntry[];
    getLogsByUser(userId: string, limit?: number): AuditLogEntry[];
    getRecentLogs(limit?: number): AuditLogEntry[];
    cleanupOldLogs(): number;
    clear(): void;
    getStats(): {
        totalLogs: number;
        uniqueUsers: number;
        eventsByType: Record<string, number>;
        oldestLog?: Date;
        newestLog?: Date;
    };
    private generateId;
    private extractMetadata;
    private logToConsole;
    private logToFile;
}
export declare const AuditEvents: {
    readonly SIGN_IN_SUCCESS: "SIGN_IN_SUCCESS";
    readonly SIGN_IN_FAILED: "SIGN_IN_FAILED";
    readonly SIGN_OUT: "SIGN_OUT";
    readonly SIGN_UP: "SIGN_UP";
    readonly PASSWORD_CHANGE: "PASSWORD_CHANGE";
    readonly PASSWORD_RESET_REQUEST: "PASSWORD_RESET_REQUEST";
    readonly PASSWORD_RESET_SUCCESS: "PASSWORD_RESET_SUCCESS";
    readonly EMAIL_VERIFICATION: "EMAIL_VERIFICATION";
    readonly SESSION_CREATED: "SESSION_CREATED";
    readonly SESSION_DESTROYED: "SESSION_DESTROYED";
    readonly ACCOUNT_LOCKED: "ACCOUNT_LOCKED";
    readonly ACCOUNT_UNLOCKED: "ACCOUNT_UNLOCKED";
    readonly MFA_ENABLED: "MFA_ENABLED";
    readonly MFA_DISABLED: "MFA_DISABLED";
    readonly API_KEY_CREATED: "API_KEY_CREATED";
    readonly API_KEY_REVOKED: "API_KEY_REVOKED";
};
//# sourceMappingURL=audit.d.ts.map