import { up } from "drizzle-kit/api-postgres";
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "./user";
import {rolesTable} from "./role"
import { defineRelations } from "drizzle-orm";
import { contributionsTable } from "./contribution";
import { loanApplicationsTable } from "./loanApplication";
import { loansTable } from "./loans";

export const memberTable = pgTable("members", {
  id: serial("id").primaryKey(),
  user_id: integer().notNull().unique().references(() => usersTable.id),
  role_id: integer().notNull().references(() => rolesTable.id),
  member_number: varchar({ length: 255 }).notNull().unique(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  phone_number: varchar({ length: 20 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  address: varchar({ length: 255 }).notNull(),
  national_id: varchar({ length: 20 }).notNull().unique(),
  occupation: varchar({ length: 255 }).notNull(),
 date_joined: timestamp("date_joined").notNull().defaultNow(),
status: varchar({ length: 50 }).notNull().default("active"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

