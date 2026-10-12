import type { Request, Response } from "express";
import { db } from "../db";
import { createRoleSchema, deleteRoleSchema, findRoleWithIDSchema, rolesTable, updateRoleSchema } from "../db/schema/role";
import { eq } from "drizzle-orm";
import { assignRoleToMemberSchema } from "../db/schema/membersToRoles";
import { findMemberByID } from "./contoller.member";

export const createRole = async (req: Request, res: Response): Promise<void> => {
    const parsedData = createRoleSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({
            error: "Invalid role data",
            details: parsedData.error.flatten(),
        });
        return;
    }

    const { name } = parsedData.data;

    try {
        const newRole = await db
            .insert(rolesTable)
            .values({
                name: name,
            })
            .returning();
        res.status(201).json({
            message: "Role created successfully",
            role: newRole[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create role",
        });
    }
};
export const deleteRole = async (req:Request, res:Response): Promise<void> =>{
    const parsedData = deleteRoleSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({
            error: "Invalid role data",
            details: parsedData.error.flatten(),
        });
        return;
    }
    const {id} = parsedData.data

    try {
        const existingRole = await db.select().from(rolesTable).where(eq(rolesTable.id,id));
        
        if (existingRole.length === 0) {
            res.status(404).json({
                error: "Role not found",
                message: `No role found with id: ${id}`,
            });
            return;
        }
        await db.delete(rolesTable).where(eq(rolesTable.id,id)).returning();
          res.status(200).json({
            message: "Role deleted successfully"
        });
    } catch (error) {
                res.status(500).json({
            error: "Internal server error",
            message: "Failed to delete role",
        });

    }
}
export const updateRole = async (req: Request, res:Response) =>{
    const parsedData = updateRoleSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(401).json({
            error:"invalid role data",
        })
        return;
    }
    const { id, name } = parsedData.data
    const existingRole = await db.select().from(rolesTable).where(eq(rolesTable.id, id));

    if(existingRole.length === 0){
        res.status(404).json({
            error: "role not found"
        })
    }
    await db.update(rolesTable).set({name}).where(eq(rolesTable.id,id)).returning();
    res.status(201).json({
        message: "role updated"
    })
}
export const asignRoleToUser = async(req:Request, res:Response):Promise<void> =>{
 const parsedData = assignRoleToMemberSchema.safeParse(req.body);

 if(!parsedData.success){
    res.status(401).json({
        message: " invalid data"
    })
    return;
 }
 const {member_id, role_id } = parsedData.data;
 try {
    
 } catch (error) {
    
 }
}

export const findRoleWithID = async(req:Request,res:Response):Promise<void> =>{
    const parsedData = findRoleWithIDSchema.safeParse(req.body);
     if(!parsedData.success){
        res.status(401).json({
            error:"invalid role data",
        })
        return;
    }
    try {
    const { id } = parsedData.data
    const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id,id)).limit(1);

        if (!role) {
            res.status(404).json({
                error: "Role not found"
            });
            return;
        }
    res.status(200).json({ data: role });

    } catch (error) {
     res.status(500).json({ error: "Internal server error" });
    }
}