import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { memberTable } from "./member";
import { loansTable } from "./loans";
import { paymentsTable } from "./payments";

export const penaltiesTable = pgTable("penalties", {
  id: serial().primaryKey(),
  member_id: integer().notNull().references(() => memberTable.id),
  loan_id: integer().notNull().references(() => loansTable.id),
  payment_id: integer().notNull().references(() => paymentsTable.id),
  amount: integer().notNull(),
  reason: varchar({ length: 255 }).notNull(),
  penalty_date: timestamp("penalty_date").defaultNow().notNull(),
  status: varchar({ length: 50 }).notNull().default("unpaid"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});