import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./dashboard-layout-client";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient userName={session.user.name}>
      {children}
    </DashboardLayoutClient>
  );
}