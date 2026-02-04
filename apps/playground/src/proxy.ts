import { zauth } from "@/lib/auth";
import { createRequireAuth } from "@moonirdev/zauth/next";
import { NextResponse } from "next/server";

export default async function proxy(req: Request) {
  const authResult = createRequireAuth(zauth.session.getUser);
  const result = await authResult(req);
  if (result) return result;

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
