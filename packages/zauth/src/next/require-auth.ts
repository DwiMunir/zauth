import { NextResponse } from "next/server";

export function createRequireAuth(getUser: () => Promise<any>) {
  return async function requireAuth(
    req: Request
  ): Promise<NextResponse | void> {
    const user = await getUser();

    if (!user) {
      const url = new URL("/auth/login", req.url);
      return NextResponse.redirect(url);
    }
  };
}
