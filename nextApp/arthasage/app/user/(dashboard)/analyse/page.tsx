import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getRawAnalysis } from "@/lib/dashboard/dashboardApi";
import AnalyticsClient from "./analyticsClient";

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const data = await getRawAnalysis(session.user.id);

  return <AnalyticsClient data={data} />;
}