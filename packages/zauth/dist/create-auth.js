import { createAuthService } from "./core/auth";
import { createSessionService } from "./core/session";
import { createACLService } from "./core/acl";
import { createAuditService } from "./core/audit";
import { createMiddleware } from "./next/middleware";
import { createRequireAuth } from "./next/require-auth";
// create-auth.ts
export function createAuth(opts) {
    const prisma = opts.prisma;
    const cookieName = opts.session?.cookieName ?? "zauth.session";
    const ttl = opts.session?.ttlSeconds ?? 60 * 60 * 24 * 7;
    const authSvc = createAuthService(prisma);
    const sessionSvc = createSessionService(prisma, cookieName, ttl);
    const aclSvc = createACLService(prisma);
    const auditSvc = createAuditService(prisma);
    const requireAuth = createRequireAuth(getUser);
    const defaultRole = opts.defaults?.role ?? "admin";
    async function requireUser() {
        const session = await sessionSvc.getSession();
        if (!session)
            throw new Error("Unauthenticated");
        const user = await aclSvc.loadUserWithPermissions(session.userId);
        if (!user)
            throw new Error("User not found");
        return user;
    }
    async function getUser() {
        const session = await sessionSvc.getSession();
        if (!session)
            return null;
        return aclSvc.loadUserWithPermissions(session.userId);
    }
    async function register(email, password) {
        const user = await authSvc.register(email, password);
        if (defaultRole) {
            const role = await prisma.role.findUnique({
                where: { name: defaultRole },
            });
            if (!role) {
                throw new Error(`[zauth] Default role '${defaultRole}' not found. Did you run acl.sync()?`);
            }
            await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id,
                },
            });
        }
        return user;
    }
    return {
        auth: {
            register,
            async login(email, password) {
                const user = await authSvc.verifyCredentials(email, password);
                await sessionSvc.create(user.id);
                return user;
            },
            logout: sessionSvc.clear,
        },
        session: {
            requireUser,
            getUser,
        },
        acl: {
            can: aclSvc.can,
            sync: aclSvc.sync,
        },
        audit: auditSvc,
        middleware: createMiddleware(getUser),
        requireAuth,
    };
}
//# sourceMappingURL=create-auth.js.map