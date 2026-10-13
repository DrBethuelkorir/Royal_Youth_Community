import { eq } from "drizzle-orm";
import { db } from "../db";
import { rolesTable } from "../db/schema/role";
import { memberToRolesTable } from "../db/schema/membersToRoles";
import { memberTable } from "../db/schema/member";


export const getRoleById = async (id:number) =>{
 const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id,id)).limit(1);
 return role;
}
export const updateMemberRole = async (memberId: number, roleId: number) => {
  const [updated] = await db
    .update(memberTable)
    .set({ role_id: roleId })
    .where(eq(memberTable.id, memberId))
    .returning();

  return updated;
};