export function createMiddleware(getUser) {
    return function middleware() {
        return async function proxy(req) {
            const user = await getUser();
            console.log({ user });
            if (!user) {
                const url = new URL("/auth/login", req.url);
                return Response.redirect(url, 302);
            }
        };
    };
}
//# sourceMappingURL=middleware.js.map