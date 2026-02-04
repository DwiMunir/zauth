// core/session.ts
import { SessionTransport } from "./session-transport";

export function createSessionService(
  prisma: any,
  transport: SessionTransport,
  ttlSeconds: number
) {
  async function getSession() {
    const sessionId = await transport.get();
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

    await transport.set(session.id);
    return session;
  }

  async function clear() {
    const sessionId = await transport.get();
    if (sessionId) {
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => { });
    }
    await transport.clear();
  }

  return { getSession, create, clear };
}
