import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./better-auth";
import { transactions } from "./transactions";
import { holdings } from "./holdings";
import { relations } from "drizzle-orm/relations";

export const financialAccount = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: text("name").notNull(),

    // bank | demat | csv
    type: text("type").notNull(),

    // HDFC | Zerodha | Upload
    provider: text("provider").notNull(),

    isSimulated: boolean("is_simulated")
      .default(true)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("accounts_user_idx").on(table.userId),
  ]
);

export const financialAccountRelations = relations(financialAccount, ({ one, many }) => ({
  user: one(user, {
    fields: [financialAccount.userId],
    references: [user.id],
  }),

  transactions: many(transactions),

  holdings: many(holdings),
}));