export function createAuditService(prisma: any) {
  return {
    log(data: { userId?: string; action: string; resource: string; meta?: any }) {
      return prisma.auditLog.create({ data });
    },
  };
}
