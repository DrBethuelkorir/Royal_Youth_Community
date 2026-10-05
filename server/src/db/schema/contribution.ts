import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { memberTable } from "./member";


export const contributionsTable = pgTable("contributions", {
  id: serial().primaryKey(),
  member_id: integer().notNull().references(() => memberTable.id),
  amount: integer().notNull(),
  contribution_date: timestamp("contribution_date").defaultNow().notNull(),
  payment_method: varchar({ length: 50 }).notNull(),
  transaction_reference: varchar({ length: 255 }).notNull().unique(),
  recorded_by: integer().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});