import { eq } from "drizzle-orm";
import { db } from "../db";
import { memberTable } from "../db/schema/member";



export const getMemberById = async (id: number) => {
    const [member] = await db
        .select()
        .from(memberTable)
        .where(eq(memberTable.id, id))
        .limit(1);
    return member;   
};