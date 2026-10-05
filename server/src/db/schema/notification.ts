import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const notificationsTable = pgTable("notifications", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => usersTable.id),
    title: varchar({ length: 255 }).notNull(),
    message: varchar({ length: 1000 }).notNull(),
    type: varchar({ length: 50 }).notNull(),
    is_read: integer().notNull().default(0),
    created_at: timestamp("created_at").defaultNow().notNull(),
});