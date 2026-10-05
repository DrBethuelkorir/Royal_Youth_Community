import { up } from "drizzle-kit/api-postgres";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const loansProductsTable = pgTable("loans_products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
    description: varchar({ length: 255 }).notNull(),
    minimum_amount: integer().notNull(),
    maximum_amount: integer().notNull(),
    interest_rate: integer().notNull(),
    interest_type: varchar({ length: 50 }).notNull(),
    repayment_period: integer().notNull(),
    processing_fee: integer().notNull(),
    status: varchar({ length: 50 }).notNull().default("available"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});