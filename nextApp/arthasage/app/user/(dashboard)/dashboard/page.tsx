import DashboardView from "./dashboardView";
import { getAnalysis } from "@/lib/dashboard/dashboardApi";
import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();

  const data = await getAnalysis(session!.user.id);
  console.log("Dashboard data:", data);

  return (
    <DashboardView data={data} />
  );
}