import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SettingsClient from "./settingsClient";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const { user, session: currentSession } = session;
  const data = await getDashboardData(user.id);
  const accounts = (data ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    provider: a.provider,
    type: a.type,
    isSimulated: a.isSimulated,
    transactionCount: a.transactions.length,
    holdingCount: a.holdings.length,
  }));

  return (
    <SettingsClient
      userId={user.id}
      name={user.name}
      email={user.email}
      image={user.image ?? null}
      emailVerified={user.emailVerified}
      createdAt={user.createdAt}
      currentToken={currentSession.token}
      accounts={accounts}
    />
  );
}
