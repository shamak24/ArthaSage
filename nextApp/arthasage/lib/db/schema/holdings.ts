import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./better-auth";
import { financialAccount } from "./financialAccounts";
import { relations } from "drizzle-orm/relations";

export const holdings = pgTable(
  "holdings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    accountId: uuid("account_id")
      .notNull()
      .references(() => financialAccount.id, { onDelete: "cascade" }),

    symbol: text("symbol").notNull(),
    companyName: text("company_name").notNull(),

    quantity: integer("quantity").notNull(),

    avgPrice: numeric("avg_price").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("holdings_user_idx").on(table.userId),
    index("holdings_symbol_idx").on(table.symbol),
  ]
);

export const holdingsRelations = relations(
  holdings,
  ({ one }) => ({
    user: one(user, {
      fields: [holdings.userId],
      references: [user.id],
    }),

    account: one(financialAccount, {
      fields: [holdings.accountId],
      references: [financialAccount.id],
    }),
  })
);