import crypto from "crypto";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { and, eq, gt } from "drizzle-orm";

import { db } from "../db/index";
import {
  loginSchema,
  userInsertSchema,
  usersTable,
  verifyEmailSchema,
} from "../db/schema/user";
import { sendVerificationEmail } from "../mail/email.service ";

const SALT_ROUNDS = 10;
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const JWT_EXPIRES_IN = "1h";

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = userInsertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid user data",
      details: parsed.error.flatten(),
    });
    return;
  }

  // Normalize email once, use everywhere
  const email = parsed.data.email.toLowerCase().trim();
  const { password } = parsed.data;

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existing.length > 0) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const code = crypto.randomInt(100000, 1000000).toString();
    const hashedCode = await bcrypt.hash(code, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

    const inserted = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        verificationCode: hashedCode,
        verificationCodeExpiresAt: expiresAt,
        emailVerified: false,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
      });

    // Narrow the type explicitly — insert always returns one row, but TS
    // can't prove it, so we guard and also get a real error path.
    const newUser = inserted[0];
    if (!newUser) {
      console.error("Insert returned no row for", email);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    try {
      await sendVerificationEmail(email, code);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);
      // Roll back the user so they can retry cleanly.
      await db.delete(usersTable).where(eq(usersTable.id, newUser.id));
      res.status(502).json({
        error: "Could not send verification email. Please try again.",
      });
      return;
    }

    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error("registerUser failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid user data",
      details: parsed.error.flatten(),
    });
    return;
  }

  const email = parsed.data.email.toLowerCase().trim();
  const { password } = parsed.data;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Enforce email verification (uncomment when ready)
    // if (!user.emailVerified) {
    //   res.status(403).json({ error: "Please verify your email first" });
    //   return;
    // }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("loginUser failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------------------------------------------------------------
// Verify email
// ---------------------------------------------------------------------------
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = verifyEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid data",
      details: parsed.error.flatten(),
    });
    return;
  }

  const email = parsed.data.email.toLowerCase().trim();
  const { code } = parsed.data;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          gt(usersTable.verificationCodeExpiresAt, new Date())
        )
      );

    if (!user || !user.verificationCode) {
      res.status(400).json({ error: "Invalid or expired code" });
      return;
    }

    const ok = await bcrypt.compare(code, user.verificationCode);
    if (!ok) {
      res.status(400).json({ error: "Invalid or expired code" });
      return;
    }

    await db
      .update(usersTable)
      .set({
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      })
      .where(eq(usersTable.id, user.id));

    res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("verifyEmail failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};