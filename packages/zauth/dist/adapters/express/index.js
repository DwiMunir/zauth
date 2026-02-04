export function expressSessionTransport(req, res, cookieName = "zauth.session") {
    return {
        async get() {
            return req.cookies?.[cookieName] ?? null;
        },
        async set(sessionId) {
            res.cookie(cookieName, sessionId, { httpOnly: true });
        },
        async clear() {
            res.clearCookie(cookieName);
        },
    };
}
//# sourceMappingURL=index.js.map