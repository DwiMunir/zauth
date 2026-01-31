import { zauth } from "@/lib/auth";

export default zauth.middleware();

export const config = {
  matcher: ["/dashboard/:path*"],
};
