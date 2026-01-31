import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { zauth } from "../src/lib/auth";

const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ======================
  // 1. SYNC RBAC
  // ======================
  await zauth.acl.sync({
    roles: {
      admin: ["*"],
      editor: ["post.create", "post.update", "post.read"],
      viewer: ["post.read"],
    },
  });

  // ======================
  // 2. ASSIGN ROLE KE USER PERTAMA
  // ======================
  const firstUser = await prisma.user.findFirst();
  if (!firstUser) {
    console.log("No user found, skipping role assignment");
    return;
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" },
  });

  if (!adminRole) {
    throw new Error("Admin role not found after sync");
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: firstUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: firstUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("Seed complete");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });