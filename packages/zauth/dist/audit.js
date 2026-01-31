// Audit logging for authentication events
import { createHash } from 'crypto';
export class AuditLogger {
    constructor(options) {
        this.logs = [];
        this.options = {
            maxEntries: 1000,
            retentionDays: 30,
            enableConsole: true,
            enableFile: false,
            ...options
        };
    }
    log(event, data) {
        const entry = {
            id: this.generateId(),
            event,
            userId: data.userId,
            email: data.email,
            ip: data.ip,
            userAgent: data.userAgent,
            timestamp: new Date(),
            metadata: this.extractMetadata(data)
        };
        this.logs.push(entry);
        // Trim logs if exceeding maxEntries
        if (this.logs.length > this.options.maxEntries) {
            this.logs = this.logs.slice(-this.options.maxEntries);
        }
        // Log to console if enabled
        if (this.options.enableConsole) {
            this.logToConsole(entry);
        }
        // Log to file if enabled
        if (this.options.enableFile && this.options.filePath) {
            this.logToFile(entry);
        }
        return entry;
    }
    getLogs(filters) {
        let filteredLogs = [...this.logs];
        if (filters?.userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        }
        if (filters?.email) {
            filteredLogs = filteredLogs.filter(log => log.email === filters.email);
        }
        if (filters?.event) {
            filteredLogs = filteredLogs.filter(log => log.event === filters.event);
        }
        if (filters?.startDate) {
            filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate);
        }
        if (filters?.endDate) {
            filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate);
        }
        return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    getLogsByUser(userId, limit) {
        const userLogs = this.logs.filter(log => log.userId === userId);
        const sorted = userLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        return limit ? sorted.slice(0, limit) : sorted;
    }
    getRecentLogs(limit = 10) {
        return this.logs
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    cleanupOldLogs() {
        const retentionDate = new Date();
        retentionDate.setDate(retentionDate.getDate() - (this.options.retentionDays || 30));
        const initialCount = this.logs.length;
        this.logs = this.logs.filter(log => log.timestamp >= retentionDate);
        return initialCount - this.logs.length;
    }
    clear() {
        this.logs = [];
    }
    getStats() {
        const eventsByType = {};
        const uniqueUsers = new Set();
        for (const log of this.logs) {
            eventsByType[log.event] = (eventsByType[log.event] || 0) + 1;
            if (log.userId) {
                uniqueUsers.add(log.userId);
            }
        }
        const sortedLogs = [...this.logs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        return {
            totalLogs: this.logs.length,
            uniqueUsers: uniqueUsers.size,
            eventsByType,
            oldestLog: sortedLogs[0]?.timestamp,
            newestLog: sortedLogs[sortedLogs.length - 1]?.timestamp
        };
    }
    generateId() {
        return createHash('sha256')
            .update(`${Date.now()}-${Math.random()}`)
            .digest('hex')
            .substring(0, 16);
    }
    extractMetadata(data) {
        const { userId, email, ip, userAgent, ...metadata } = data;
        return metadata;
    }
    logToConsole(entry) {
        const timestamp = entry.timestamp.toISOString();
        const message = `[${timestamp}] [${entry.event}] ${entry.email || entry.userId || 'unknown'}`;
        console.log(message);
        if (entry.metadata && Object.keys(entry.metadata).length > 0) {
            console.log('  Metadata:', entry.metadata);
        }
    }
    logToFile(entry) {
        // File logging implementation would go here
        // For now, this is a placeholder
        // In a real implementation, you would use fs.appendFile or similar
    }
}
// Predefined event types
export const AuditEvents = {
    SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
    SIGN_IN_FAILED: 'SIGN_IN_FAILED',
    SIGN_OUT: 'SIGN_OUT',
    SIGN_UP: 'SIGN_UP',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    SESSION_CREATED: 'SESSION_CREATED',
    SESSION_DESTROYED: 'SESSION_DESTROYED',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
    MFA_ENABLED: 'MFA_ENABLED',
    MFA_DISABLED: 'MFA_DISABLED',
    API_KEY_CREATED: 'API_KEY_CREATED',
    API_KEY_REVOKED: 'API_KEY_REVOKED'
};
//# sourceMappingURL=audit.js.map