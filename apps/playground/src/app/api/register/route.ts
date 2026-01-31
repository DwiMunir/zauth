import { zauth } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const user = await zauth.auth.register(body.email, body.password);
  return Response.json(user);
}
