// core/acl.ts
type PermissionKey = string;

type AuthUser = {
  id: string;
  email: string;
  permissions: PermissionKey[];
};

export function createACLService(prisma: any) {
  async function loadUserWithPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const permissions = new Set<string>();
    const roleNames = new Set<string>();
    for (const ur of user.roles) {
      roleNames.add(ur.role.name);
      for (const rp of ur.role.permissions) {
        permissions.add(rp.permission.key);
      }
    }

    return { ...user, permissions: [...permissions], roles: [...roleNames] };
  }

  function can(user: AuthUser | null, permission: PermissionKey): boolean {
    if (!user || !Array.isArray(user.permissions)) return false;

    // exact
    if (user.permissions.includes(permission)) return true;

    // wildcard: post.*
    const [scope] = permission.split(".");
    if (user.permissions.includes(`${scope}.*`)) return true;

    // super admin: *
    if (user.permissions.includes("*")) return true;

    return false;
  }

  async function sync(config: {
    roles: Record<string, PermissionKey[]>;
  }) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[zauth] acl.sync() running in production");
    }

    for (const [roleName, desiredPermissions] of Object.entries(config.roles)) {
      const role = await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
      });

      // fetch existing
      const existing = await prisma.rolePermission.findMany({
        where: { roleId: role.id },
        include: { permission: true },
      });

      const existingKeys = new Set(
        existing.map((rp: { permission: { key: string } }) => rp.permission.key)
      );

      const desiredKeys = new Set(desiredPermissions);

      // add missing
      for (const key of desiredKeys) {
        const permission = await prisma.permission.upsert({
          where: { key },
          update: {},
          create: { key },
        });

        if (!existingKeys.has(key)) {
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });
        }
      }

      // revoke stale
      for (const rp of existing) {
        if (!desiredKeys.has(rp.permission.key)) {
          await prisma.rolePermission.delete({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: rp.permission.id,
              },
            },
          });
        }
      }
    }
  }

  return { loadUserWithPermissions, can, sync };
}
