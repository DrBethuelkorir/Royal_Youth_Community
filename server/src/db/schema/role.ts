import { serial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm/relations";

import { memberTable } from "./member";

export const rolesTable = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});



