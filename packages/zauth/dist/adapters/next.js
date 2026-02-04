import { cookies } from "next/headers";
export function nextSessionTransport(cookieName) {
    return {
        async get() {
            return (await cookies()).get(cookieName)?.value ?? null;
        },
        async set(sessionId) {
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
//# sourceMappingURL=next.js.map