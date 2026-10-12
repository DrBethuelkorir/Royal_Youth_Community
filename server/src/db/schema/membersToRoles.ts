import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { rolesTable } from "./role";
import { memberTable } from "./member";

import {createInsertSchema } from 'drizzle-orm/zod'


export const memberToRolesTable = pgTable("member_to_roles", {
    member_id: integer().notNull().references(() => memberTable.id),
    role_id: integer().notNull().references(() => rolesTable.id),
}, 
(t) => [primaryKey({ columns: [t.member_id, t.role_id] })]
)
export const assignRoleToMemberSchema = createInsertSchema(memberToRolesTable)
    .pick({ member_id: true, role_id: true });