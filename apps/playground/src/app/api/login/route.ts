// apps/playground/src/app/api/login/route.ts
import { zauth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await zauth.auth.login(body.email, body.password);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ message: (error as Error).message }, { status: 401 });
  }
}
