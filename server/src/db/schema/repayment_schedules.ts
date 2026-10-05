import { integer,serial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { loansTable } from "./loans";

export const repaymentSchedulesTable = pgTable("repayment_schedules", {
  id: serial("id").primaryKey(),
  loan_id: integer().notNull().references(() => loansTable.id),
  installment_number: integer().notNull(),
  due_date: timestamp("due_date").notNull(),
  principal_amount: integer().notNull(),
  interest_amount: integer().notNull(),
  total_amount: integer().notNull(),
  amount_paid: integer().notNull().default(0),
  remaining_amount: integer().notNull(),
  status: varchar({ length: 50 }).notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});