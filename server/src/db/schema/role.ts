import { serial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-orm/zod";
import { z } from "zod";

export const rolesTable = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull().unique(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});

const roleName = z
    .string()
    .min(3, "Role must be more than 3 letters")
    .max(10, "Role should not exceed 10 letters");

export const createRoleSchema = createInsertSchema(rolesTable, {
    name: roleName,
}).pick({ name: true });

export const updateRoleSchema = z.object({
    id: z.number().int().positive(),
    name: roleName,
});

export const deleteRoleSchema = z.object({
    id: z.number().int().positive(),
});
export const findRoleWithIDSchema = z.object({
 id: z.number().int().positive()
})