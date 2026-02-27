import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./better-auth";
import { financialAccount } from "./financialAccounts";
import { relations } from "drizzle-orm/relations";

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    accountId: uuid("account_id")
      .notNull()
      .references(() => financialAccount.id, { onDelete: "cascade" }),

    date: timestamp("date").notNull(),

    description: text("description"),

    amount: numeric("amount").notNull(),

    // income | expense
    type: text("type").notNull(),

    category: text("category"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("transactions_user_idx").on(table.userId),
    index("transactions_account_idx").on(table.accountId),
  ]
);

export const transactionsRelations = relations(
  transactions,
  ({ one }) => ({
    user: one(user, {
      fields: [transactions.userId],
      references: [user.id],
    }),

    account: one(financialAccount, {
      fields: [transactions.accountId],
      references: [financialAccount.id],
    }),
  })
);