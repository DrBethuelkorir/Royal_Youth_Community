import { up } from "drizzle-kit/api-postgres";
import { serial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  DOB: timestamp("dob").notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  phone_number: varchar({ length: 20 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const usersRelations = defineRelations({ usersTable },(r) =>({
 
}));