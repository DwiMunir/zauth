// core/session.ts
import { cookies } from "next/headers";

export function createSessionService(
  prisma: any,
  cookieName: string,
  ttlSeconds: number
) {
  async function getSessionId() {
    return (await cookies()).get(cookieName)?.value;
  }

  async function getSession() {
    const sessionId = await getSessionId();
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) return null;
    return session;
  }

  async function create(userId: string) {
    const session = await prisma.session.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      },
    });

    (await cookies()).set(cookieName, session.id, {
      httpOnly: true,
      path: "/",
    });

    return session;
  }

  async function clear() {
    const session = await getSession();
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => { });
    }
    (await cookies()).delete(cookieName);
  }

  return {
    getSession,
    create,
    clear,
  };
}
