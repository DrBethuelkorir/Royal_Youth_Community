import { up } from "drizzle-kit/api-postgres";
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "./user";
import {rolesTable} from "./role"
import { defineRelations } from "drizzle-orm";
import { contributionsTable } from "./contribution";
import { loanApplicationsTable } from "./loanApplication";
import { loansTable } from "./loans";
import { z } from "zod";
import { createInsertSchema } from "drizzle-orm/zod";

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
export const findMemberByIdSchema = z.object({
  id: z.number().int().positive()
})
export const registerMemberSchema = createInsertSchema(memberTable, {
  first_name: z.string().min(1, "please enter your first name"),
  last_name: z.string().min(1, "please enter your last name"),
  phone_number: z.string().min(9, "please enter a valid phone number"),
  email: z.email("must be an email"),
  occupation: z.string().min(1, "please enter your occupation"),
  address: z.string().min(1, "please enter your address"),
  national_id: z.string().min(6, "please enter a valid national ID"),
}).omit({
  id: true,
  user_id: true,
  role_id: true,
  member_number: true,
  date_joined: true,
  status: true,
  created_at: true,
  updated_at: true,
});