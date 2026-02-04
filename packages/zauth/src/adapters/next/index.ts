import { cookies } from "next/headers";
import { SessionTransport } from "../../core/session-transport";

export * from './require-auth';
export * from './middleware';

export function nextSessionTransport(
  cookieName: string
): SessionTransport {
  return {
    async get() {
      return (await cookies()).get(cookieName)?.value ?? null;
    },
    async set(sessionId: string) {
      (await cookies()).set(cookieName, sessionId, {
        httpOnly: true,
        path: "/",
      });
    },
    async clear() {
      (await cookies()).delete(cookieName);
    },
  };
}