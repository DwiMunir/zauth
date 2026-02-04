// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { createAuth } from "@moonirdev/zauth";
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: 'file:./dev.db',
});

const prisma = new PrismaClient({
  adapter
});

async function main() {
  const auth = createAuth({
    prisma,
    session: {
      transport: {
        async get() {
          return null;
        },
        async set() { },
        async clear() { },
      },
    },
    defaults: {
      role: "admin",
    },
  });

  await auth.acl.sync({
    roles: {
      admin: ["*"],
      user: ["post.read"],
    },
  });

  console.log("RBAC seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
