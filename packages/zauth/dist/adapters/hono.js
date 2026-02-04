export function honoSessionTransport(c, cookieName = "zauth.session") {
    return {
        async get() {
            return c.req.cookie(cookieName) ?? null;
        },
        async set(sessionId) {
            c.cookie(cookieName, sessionId, {
                httpOnly: true,
                sameSite: "Lax",
            });
        },
        async clear() {
            c.cookie(cookieName, "", { maxAge: 0 });
        },
    };
}
//# sourceMappingURL=hono.js.map