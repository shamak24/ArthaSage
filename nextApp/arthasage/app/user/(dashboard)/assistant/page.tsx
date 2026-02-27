import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AssistantClient from "./assistantClient";

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <AssistantClient username={session.user.name} userId={session.user.id} />;
}