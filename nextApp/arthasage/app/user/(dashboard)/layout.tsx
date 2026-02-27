import DashboardView from "./dashboard/dashboardView";
import { getAnalysis } from "@/lib/dashboard/getAnalysis";
import { useSession } from "@/providers/session-provider";

export default async function Page() {
  const session = useSession();
  const userId = session?.session?.user?.id;

  const data = await getAnalysis(userId as string);

  return <DashboardView data={data} />;
}