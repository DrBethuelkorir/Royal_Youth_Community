import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema/user";



export const getUserById = async (id: number) => {
    const [member] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);
    return member;   
};