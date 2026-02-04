// src/adapters/express/index.ts
import type { Request, Response } from "express";
import type { SessionTransport } from "../../core/session-transport";

export function expressSessionTransport(
  req: Request,
  res: Response,
  cookieName = "zauth.session"
): SessionTransport {
  return {
    async get() {
      return req.cookies?.[cookieName] ?? null;
    },
    async set(sessionId: string) {
      res.cookie(cookieName, sessionId, { httpOnly: true });
    },
    async clear() {
      res.clearCookie(cookieName);
    },
  };
}
