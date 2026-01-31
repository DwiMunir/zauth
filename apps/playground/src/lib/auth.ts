// lib/auth.ts
import { createAuth } from "@moonirdev/zauth";
import prisma from "./prisma";

export const zauth = createAuth({
  prisma,
});
