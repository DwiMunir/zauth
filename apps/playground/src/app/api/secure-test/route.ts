import { zauth } from "@/lib/auth";

export async function POST() {
  const user = await zauth.session.requireUser();

  if (!zauth.acl.can(user, "post.create")) {
    return new Response("Forbidden", { status: 403 });
  }

  await zauth.audit.log({
    userId: user.id,
    action: "post.create",
    resource: "post",
  });

  return Response.json({ ok: true });
}
