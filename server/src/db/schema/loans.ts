import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { memberTable } from "./member";
import { loanApplicationsTable } from "./loanApplication";

export const loansTable = pgTable("loans", {
  id: serial().primaryKey(),
  user_id: integer().notNull().references(() => usersTable.id),
  loan_application_id: integer().notNull().references(() => loanApplicationsTable.id),
  member_id: integer().notNull().references(() => memberTable.id),
  loan_number: integer().notNull().unique(),
  principle_amount: integer().notNull(),
    interest_amount: integer().notNull(),
    total_amount: integer().notNull(),
    amount_paid: integer().notNull().default(0),
    outstanding_amount: integer().notNull(),
    start_date: timestamp("start_date").notNull(),
    due_date: timestamp("due_date").notNull(),
    status: integer().notNull().default(0),
    approved_by: integer().notNull(),
    approved_at: timestamp("approved_at"),
    disbursed_at: timestamp("disbursed_at").defaultNow().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});