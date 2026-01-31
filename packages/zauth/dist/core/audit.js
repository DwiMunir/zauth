export function createAuditService(prisma) {
    return {
        log(data) {
            return prisma.auditLog.create({ data });
        },
    };
}
//# sourceMappingURL=audit.js.map