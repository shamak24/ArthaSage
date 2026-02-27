import PortfolioView from "./portfolioView";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();
  const data = await getDashboardData(session!.user.id);

  return (
    <PortfolioView data={data} />
  );
}