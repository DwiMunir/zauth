import { zauth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default function proxy(req: Request) {

  const authResult = zauth.requireAuth(req);
  if (authResult) return authResult;

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
