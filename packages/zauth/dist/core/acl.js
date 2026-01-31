export function createACLService(prisma) {
    async function loadUserWithPermissions(userId) {
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
        if (!user)
            return null;
        const permissions = new Set();
        for (const ur of user.roles) {
            for (const rp of ur.role.permissions) {
                permissions.add(rp.permission.key);
            }
        }
        return { ...user, permissions: [...permissions] };
    }
    function can(user, permission) {
        if (!user || !Array.isArray(user.permissions))
            return false;
        // exact
        if (user.permissions.includes(permission))
            return true;
        // wildcard: post.*
        const [scope] = permission.split(".");
        if (user.permissions.includes(`${scope}.*`))
            return true;
        // super admin: *
        if (user.permissions.includes("*"))
            return true;
        return false;
    }
    async function sync(config) {
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
            const existingKeys = new Set(existing.map((rp) => rp.permission.key));
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
//# sourceMappingURL=acl.js.map