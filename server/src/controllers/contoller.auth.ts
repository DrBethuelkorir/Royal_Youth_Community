import type { Request, Response } from "express";
import { loginSchema, userInsertSchema, usersTable } from "../db/schema/user";
import { db } from "../db/index";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt  from 'jsonwebtoken';

export const registeruser = async (req: Request, res: Response): Promise<void> => {
    const parsedData = userInsertSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: "Invalid user data", details: parsedData.error.message });
        return;
    }
   

    const { email, password } = parsedData.data;

    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (existingUser.length > 0) {
            res.status(409).json({ error: "Email already exists" });
            return;
        }

        const [newUser] = await db.insert(usersTable).values({
            email,
            password: hashedPassword,
        }).returning({
            id: usersTable.id,
            email: usersTable.email,
            created_at: usersTable.created_at,
            updated_at: usersTable.updated_at
        });
        res.status(201).json({newUser});

    }catch (error: unknown) {
    res.status(500).json({ error: "Internal server error", details: (error as Error).message })
    }
}
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const parsedData = loginSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({ error: "Invalid user data", details: parsedData.error.message });
        return;
    }
    try{
        const {email,password} = parsedData.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if(!user){
        res.status(401).json({error: "invalid credentials"})
        return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
     res.status(401).json({ error: 'Invalid credentials' })
     return;
  }
  const token = jwt.sign(
  {
    userId: user.id,
    email: user.email
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "1h"
  }
);

res.json({token, message: 'Login successful' });
    }catch(error){
 res.status(500).json({error: "internal server error"})
    }
}