import { pgTable, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { loansProductsTable } from "./loanProduct";

export const loanApplicationsTable = pgTable("loan_applications", {
  id: serial().primaryKey(),
  user_id: integer().notNull().references(() => usersTable.id),
  loan_product_id: integer().notNull().references(() => loansProductsTable.id),
  amount_requested: integer().notNull(),
  purpose: varchar({ length: 255 }).notNull(),
  application_date: timestamp("application_date").defaultNow().notNull(),
    status: integer().notNull().default(0),
    reviewed_by: integer(),
    reviewed_at: timestamp("reviewed_at"),
    rejection_reason: varchar({ length: 255 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});