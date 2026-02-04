import { createAuthService } from "./core/auth";
import { createSessionService } from "./core/session";
import { createACLService } from "./core/acl";
import { createAuditService } from "./core/audit";
import { SessionTransport } from "./core/session-transport";

// create-auth.ts
export function createAuth(opts: {
  prisma: any;
  session: {
    transport: SessionTransport;
    ttlSeconds?: number;
  };
  defaults?: { role?: string };
}) {
  const ttl = opts.session.ttlSeconds ?? 60 * 60 * 24 * 7;

  const authSvc = createAuthService(opts.prisma);
  const aclSvc = createACLService(opts.prisma);
  const auditSvc = createAuditService(opts.prisma);
  const defaultRole = opts.defaults?.role ?? "admin";

  const sessionSvc = createSessionService(
    opts.prisma,
    opts.session.transport,
    ttl
  );

  async function getUser() {
    const session = await sessionSvc.getSession();
    if (!session) return null;
    return aclSvc.loadUserWithPermissions(session.userId);
  }

  async function requireUser() {
    const user = await getUser();
    if (!user) throw new Error("Unauthenticated");
    return user;
  }


  async function register(email: string, password: string) {
    const user = await authSvc.register(email, password);

    if (defaultRole) {
      const role = await opts.prisma.role.findUnique({
        where: { name: defaultRole },
      });

      if (!role) {
        throw new Error(
          `[zauth] Default role '${defaultRole}' not found. Did you run acl.sync()?`
        );
      }

      await opts.prisma.userRole.create({
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
      async login(email: string, password: string) {
        const user = await authSvc.verifyCredentials(email, password);
        await sessionSvc.create(user.id);
        return user;
      },
      logout: sessionSvc.clear,
    },
    session: {
      getUser,
      requireUser,
    },
    acl: aclSvc,
    audit: auditSvc,
  };
}
