export function expressSessionTransport(req, res, cookieName = "zauth.session") {
    return {
        async get() {
            return req.cookies?.[cookieName] ?? null;
        },
        async set(sessionId) {
            res.cookie(cookieName, sessionId, {
                httpOnly: true,
                sameSite: "lax",
            });
        },
        async clear() {
            res.clearCookie(cookieName);
        },
    };
}
//# sourceMappingURL=express.js.map