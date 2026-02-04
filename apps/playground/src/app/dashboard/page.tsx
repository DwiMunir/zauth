import { zauth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardPage from "./dashboard";

export default async function Dashboard() {
  const user = await zauth.session.requireUser();
  console.log("Dashboard user:", user);
  if (!user) {
    return redirect("/auth/login");
  }

  return <DashboardPage user={user} />;
}
