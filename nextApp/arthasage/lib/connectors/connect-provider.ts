import db  from "../db/index";
import { financialAccount } from "../db/schema/financialAccounts";
import { transactions } from "../db/schema/transactions";
import { holdings } from "../db/schema/holdings";
import { loadProvider } from "./loader";
import type { Provider } from "./providers";
import { eq, and } from "drizzle-orm";

export async function connectProvider(
  userId: string,
  provider: Provider
) {
  const { type, data } = await loadProvider(provider);

  await db.transaction(async (tx) => {
    // ✅ prevent duplicate linking
    const existing = await tx
      .select()
      .from(financialAccount)
      .where(
        and(
          eq(financialAccount.userId, userId),
          eq(financialAccount.provider, provider)
        )
      )
      .limit(1);

    if (existing.length > 0) return;

    // ✅ create financial account
    const [account] = await tx
      .insert(financialAccount)
      .values({
        userId,
        name: data.accountName,
        provider,
        type,
        isSimulated: true,
      })
      .returning();

    // ✅ BANK DATA
    if (type === "bank") {
      await tx.insert(transactions).values(
        data.transactions.map((t: any) => ({
          userId,
          accountId: account.id,
          date: new Date(t.date),
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
        }))
      );
    }

    // ✅ DEMAT DATA
    if (type === "demat") {
      await tx.insert(holdings).values(
        data.holdings.map((h: any) => ({
          userId,
          accountId: account.id,
          symbol: h.symbol,
          companyName: h.companyName,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
        }))
      );
    }
  });
}