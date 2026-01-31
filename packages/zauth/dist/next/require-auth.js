import { NextResponse } from "next/server";
export function createRequireAuth(getUser) {
    return async function requireAuth(req) {
        const user = await getUser();
        if (!user) {
            const url = new URL("/auth/login", req.url);
            return NextResponse.redirect(url);
        }
    };
}
//# sourceMappingURL=require-auth.js.map