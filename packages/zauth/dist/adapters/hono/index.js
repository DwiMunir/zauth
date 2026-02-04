import { getCookie, setCookie, deleteCookie } from "hono/cookie";
export function honoSessionTransport(c, cookieName = "zauth.session") {
    return {
        async get() {
            return getCookie(c, cookieName) ?? null;
        },
        async set(sessionId) {
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
//# sourceMappingURL=index.js.map