// lib/auth.ts
import { createAuth } from "@moonirdev/zauth";
import prisma from "./prisma";
import { nextSessionTransport } from "@moonirdev/zauth/next";

export const zauth = createAuth({
  prisma,
  session: {
    transport: nextSessionTransport('ZAUTH_SESSION')
  },
  defaults: {
    role: 'admin'
  }
})
