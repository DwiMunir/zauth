import { Hono } from 'hono'
import { createAuth } from '@moonirdev/zauth'
import { PrismaClient } from '@prisma/client'
import { honoSessionTransport } from '@moonirdev/zauth/adapters/hono'
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { env } from 'bun';

const app = new Hono()

const adapter = new PrismaLibSql({
  url: env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({
  adapter
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const auth = createAuth({
    prisma,
    session: {
      transport: honoSessionTransport(c),
    },
  });

  await auth.auth.login(email, password);
  return c.json({ ok: true });
});

app.post("/register", async (c) => {
  const { email, password } = await c.req.json();

  const auth = createAuth({
    prisma,
    session: {
      transport: honoSessionTransport(c),
    },
    defaults: {
      role: "user",
    },
  });

  const user = await auth.auth.register(email, password);
  return c.json({
    user: {
      id: user.id,
      email: user.email,
    }
  });
});

app.post("/logout", async (c) => {
  const auth = createAuth({
    prisma,
    session: {
      transport: honoSessionTransport(c),
    },
  });

  await auth.auth.logout();
  return c.json({ ok: true });
});

app.get("/me", async (c) => {
  const auth = createAuth({
    prisma,
    session: {
      transport: honoSessionTransport(c),
    },
  });

  const user = await auth.session.getUser();
  if (!user) {
    return c.json({ user: null });
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      permissions: user.permissions,
      roles: user.roles,
    },
  });
});

app.get("/secure-data", async (c) => {
  const auth = createAuth({
    prisma,
    session: {
      transport: honoSessionTransport(c),
    },
  });

  const user = await auth.session.getUser();
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const canAccess = auth.acl.can(user, 'secure.read');
  if (!canAccess) {
    return c.json({ error: "Forbidden, you don\'t have permission!" }, 403);
  }

  return c.json({ data: 'This is secure data.' });
});

export default app
