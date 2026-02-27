import db  from "../db/index";
import { financialAccount } from "../db/schema/financialAccounts";
import { eq } from "drizzle-orm";

export async function getDashboardData(userId: string) {
  return db.query.financialAccount.findMany({
    where: eq(financialAccount.userId, userId),
    with: {
      transactions: true,
      holdings: true,
    },
  });
}