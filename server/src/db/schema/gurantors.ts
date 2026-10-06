import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { loansTable } from "./loans";
import { memberTable } from "./member";

export const guarantorTable = pgTable("guarantors", {
    id: serial().primaryKey(),
    loan_id: integer().notNull().references(() => loansTable.id),
    member_id: integer().notNull().references(() => memberTable.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});