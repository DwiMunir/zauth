# zauth

Opinionated authentication & RBAC engine for **Next.js** —  
built for **internal tools, admin dashboards, and agency workflows**.

Zauth focuses on:

- predictable behavior
- explicit setup
- clean developer experience
- zero magic in security-critical paths

---

## Why zauth?

Most auth libraries are either:

- too simple (no RBAC, no audit), or
- too complex (UI-heavy, SaaS-first, hard to customize)

**zauth sits in the middle**.

It gives you:

- authentication
- session management
- role-based access control
- permission checks
- audit logging

without forcing:

- hosted SaaS
- dashboards
- hidden conventions

---

## Features

- Email & password authentication
- Session-based auth (httpOnly cookie)
- Role-based access control (RBAC)
- Wildcard permissions (`post.*`, `*`)
- Declarative RBAC sync (no manual DB seeding)
- Next.js middleware support
- Audit logging
- Prisma-first (no raw SQL)
- Works with Bun or Node

---

## Requirements

- **Node.js >= 20** or **Bun**
- **Next.js >= 15**
- **Prisma >= 7**
- Any database supported by Prisma (Postgres, MySQL, SQLite, etc.)

---

## Database Schema (Required)

Zauth does **not** create database tables automatically.

You are expected to define the required tables in your database schema  
(using Prisma or any other migration tool).

Below is the **minimum required schema** for zauth to work properly.

---

### Required Tables

Zauth expects the following entities:

- User
- Session
- Role
- Permission
- RolePermission (join table)
- UserRole (join table)
- AuditLog

---

### Example Prisma Schema

Below is a **reference Prisma schema** that works with zauth.

You may rename fields or tables **as long as the relations remain equivalent**.

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  createdAt DateTime   @default(now())

  sessions  Session[]
  roles     UserRole[]
  audits    AuditLog[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Role {
  id    String @id @default(cuid())
  name  String @unique

  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id   String @id @default(cuid())
  key  String @unique

  roles RolePermission[]
}

model RolePermission {
  roleId       String
  permissionId String

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}

model UserRole {
  userId String
  roleId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  resource  String
  meta      Json?
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
}
```

---

## Installation

```bash
npm install @moonirdev/zauth
# or
bun add @moonirdev/zauth
```

---

## Basic Setup

### Create auth instance

```ts
// lib/auth.ts
import { PrismaClient } from "@prisma/client";
import { createAuth } from "@moonirdev/zauth";

const prisma = new PrismaClient();

export const auth = createAuth({
  prisma,

  // optional defaults
  defaults: {
    role: "admin", // default role assigned on register
  },

  session: {
    cookieName: "zauth.session",
    ttlSeconds: 60 * 60 * 24 * 7, // 7 days
  },
});
```

---

## Authentication

### Register user

```ts
await auth.auth.register(email, password);
```

What happens:

- user is created
- password is hashed
- default role is assigned (if configured)

### Login user

```ts
await auth.auth.login(email, password);
```

What happens:

- credentials are verified
- session is created
- httpOnly cookie is set

### Logout user

```ts
await auth.auth.logout();
```

---

## Session

### Require authenticated user

```ts
const user = await auth.session.requireUser();
```

- throws if unauthenticated
- returns user with permissions

### Get optional user

```ts
const user = await auth.session.getUser();
```

- returns null if not logged in

---

## RBAC (Roles & Permissions)

### Permission check

```ts
if (!auth.acl.can(user, "post.create")) {
  throw new Error("Forbidden");
}
```

Supported patterns:

- exact: `post.create`
- wildcard: `post.*`
- super admin: `*`

---

## RBAC Sync (IMPORTANT)

Zauth does not require manual database inserts for roles or permissions.

RBAC is defined declaratively and synced explicitly.

### Example RBAC config

```ts
await auth.acl.sync({
  roles: {
    admin: ["*"],
    editor: ["post.create", "post.update", "post.read"],
    viewer: ["post.read"],
  },
});
```

What `acl.sync()` does:

- creates roles if missing
- creates permissions if missing
- assigns permissions to roles
- removes stale permissions
- safe to run multiple times (idempotent)

### Where to run `acl.sync()`

Run it once during setup or deployment, not per request.

**Recommended: Prisma seed**

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { createAuth } from "zauth";

const prisma = new PrismaClient();
const auth = createAuth({ prisma });

async function main() {
  await auth.acl.sync({
    roles: {
      admin: ["*"],
      user: ["post.read"],
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run:

```bash
bunx prisma db seed
```

---

## Middleware (Route Protection)

Protect routes using Next.js middleware.

```ts
// middleware.ts
import { auth } from "@/lib/auth";

export default auth.middleware();
```

Behavior:

- checks session cookie
- redirects unauthenticated users
- works on Edge or Node runtime

---

## Audit Logging

```ts
await auth.audit.log({
  userId: user.id,
  action: "post.create",
  resource: "post",
  meta: { postId },
});
```

---

## Design Philosophy

Zauth is intentionally opinionated:

- no implicit magic
- no background sync
- no hidden side effects
- explicit lifecycle control
- easy to reason about

This makes it suitable for:

- internal tools
- admin panels
- agency projects
- B2B dashboards

---

## Roadmap

- Multi-tenant / organization support
- Advanced audit export
- Admin UI (paid)
- CLI (`npx zauth sync`)
- Policy-based permissions

---

## License

MIT