import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user";


export const auditLogsTable = pgTable("audit_logs", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => usersTable.id),
    action: varchar({ length: 255 }).notNull(),
    details: varchar({ length: 1000 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
});