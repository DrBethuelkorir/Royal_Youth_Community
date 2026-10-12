ALTER TABLE "users" ADD COLUMN "emailVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verificationCode" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verificationCodeExpiresAt" timestamp;