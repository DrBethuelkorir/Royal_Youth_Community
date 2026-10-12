        import {Request, Response } from 'express'
        import { findMemberByIdSchema, memberTable } from '../db/schema/member';
        import { db } from '../db';

        import { eq } from 'drizzle-orm'
import { getMemberById } from '../service/service.member';

        export const findMemberByID = async(req:Request, res:Response) =>{
            const parsedData = findMemberByIdSchema.safeParse(req.body);
            if(!parsedData.success){
                res.status(401).json({
                    error: " invalid data"
                })
                return;
            }
            const { id } = parsedData.data
            try {
                const member = getMemberById(id)
            if(!member){
                res.status(404).json({
                    error: "member not found"
                })
                return
            }
            res.status(201).json({
                mesaage: "member retrived succefully",
                data: member
            })
            } catch (error) {
                res.status(500).json({
                    error: "internal server error"
                })
            }
        }