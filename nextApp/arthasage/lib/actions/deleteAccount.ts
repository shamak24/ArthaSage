"use server";

import { getSession } from "../session";
import db from "../db";
import { financialAccount } from "../db/schema/financialAccounts";
import { user } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function deleteFinancialAccount(
  accountId: string
): Promise<{ redirectToOnboarding: boolean }> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  await db
    .delete(financialAccount)
    .where(
      and(
        eq(financialAccount.id, accountId),
        eq(financialAccount.userId, session.user.id)
      )
    );

  // Check if any accounts remain
  const remaining = await db.query.financialAccount.findMany({
    where: eq(financialAccount.userId, session.user.id),
    columns: { id: true },
  });

  if (remaining.length === 0) {
    await db
      .update(user)
      .set({ firstTimeUser: true })
      .where(eq(user.id, session.user.id));
    return { redirectToOnboarding: true };
  }

  return { redirectToOnboarding: false };
}
