// src/adapters/hono/index.ts
import type { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { SessionTransport } from "../../core/session-transport";

export function honoSessionTransport(
  c: Context,
  cookieName = "zauth.session"
): SessionTransport {
  return {
    async get() {
      return getCookie(c, cookieName) ?? null;
    },
    async set(sessionId: string) {
      setCookie(c, cookieName, sessionId, {
        httpOnly: true,
        sameSite: "Lax",
      });
    },
    async clear() {
      deleteCookie(c, cookieName);
    },
  };
}
