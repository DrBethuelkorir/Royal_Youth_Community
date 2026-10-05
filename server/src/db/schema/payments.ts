import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { loansTable } from "./loans";
import { memberTable } from "./member";


export const paymentsTable = pgTable("payments", {
  id: serial().primaryKey(),
  loan_id: integer().notNull().references(() => loansTable.id),
  member_id: integer().notNull().references(() => memberTable.id),
  amount: integer().notNull(),
  payment_date: timestamp("payment_date").defaultNow().notNull(),
  payment_method: varchar({ length: 50 }).notNull(),
  transaction_reference: varchar({ length: 255 }).notNull().unique(),
  recorded_by: integer().notNull(),
  notes: varchar({ length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});