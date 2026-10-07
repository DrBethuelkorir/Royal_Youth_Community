  import { serial, pgTable, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-orm/zod";
import { z} from "zod";

  export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    emailVerified: boolean().default(false).notNull(),
    verificationCode: varchar({ length: 255 }),
    verificationCodeExpiresAt: timestamp(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
  });

  export const userInsertSchema = createInsertSchema(usersTable, {
    email: z.email("must be an email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }).omit({id:true,created_at:true,updated_at:true});

  export const loginSchema = createInsertSchema(usersTable, {
     email: z.email("must be an email"),
    password: z.string().min(1, "Password is required"),
  })