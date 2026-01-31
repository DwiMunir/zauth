export function createMiddleware(getUser: () => Promise<any>) {
  return function middleware() {
    return async function proxy(req: Request) {
      const user = await getUser();
      console.log({ user });

      if (!user) {
        const url = new URL("/auth/login", req.url);
        return Response.redirect(url, 302);
      }
    };
  };
}
