CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"action" varchar(255) NOT NULL,
	"details" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributions" (
	"id" serial PRIMARY KEY,
	"member_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"contribution_date" timestamp DEFAULT now() NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"transaction_reference" varchar(255) NOT NULL UNIQUE,
	"recorded_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guarantors" (
	"id" serial PRIMARY KEY,
	"loan_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_applications" (
	"id" serial PRIMARY KEY,
	"member_id" integer NOT NULL,
	"loan_product_id" integer NOT NULL,
	"amount_requested" integer NOT NULL,
	"purpose" varchar(255) NOT NULL,
	"application_date" timestamp DEFAULT now() NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"rejection_reason" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans_products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "loans_products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL UNIQUE,
	"description" varchar(255) NOT NULL,
	"minimum_amount" integer NOT NULL,
	"maximum_amount" integer NOT NULL,
	"interest_rate" integer NOT NULL,
	"interest_type" varchar(50) NOT NULL,
	"repayment_period" integer NOT NULL,
	"processing_fee" integer NOT NULL,
	"status" varchar(50) DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"loan_application_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"loan_number" integer NOT NULL UNIQUE,
	"principle_amount" integer NOT NULL,
	"interest_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"outstanding_amount" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"approved_by" integer NOT NULL,
	"approved_at" timestamp,
	"disbursed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL UNIQUE,
	"role_id" integer NOT NULL,
	"member_number" varchar(255) NOT NULL UNIQUE,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL UNIQUE,
	"address" varchar(255) NOT NULL,
	"national_id" varchar(20) NOT NULL UNIQUE,
	"occupation" varchar(255) NOT NULL,
	"date_joined" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" varchar(1000) NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_read" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY,
	"loan_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"transaction_reference" varchar(255) NOT NULL UNIQUE,
	"recorded_by" integer NOT NULL,
	"notes" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "penalties" (
	"id" serial PRIMARY KEY,
	"member_id" integer NOT NULL,
	"loan_id" integer NOT NULL,
	"payment_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"reason" varchar(255) NOT NULL,
	"penalty_date" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'unpaid' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repayment_schedules" (
	"id" serial PRIMARY KEY,
	"loan_id" integer NOT NULL,
	"installment_number" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"principal_amount" integer NOT NULL,
	"interest_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"remaining_amount" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"dob" timestamp NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "guarantors" ADD CONSTRAINT "guarantors_loan_id_loans_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id");--> statement-breakpoint
ALTER TABLE "guarantors" ADD CONSTRAINT "guarantors_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_member_id_users_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_loan_product_id_loans_products_id_fkey" FOREIGN KEY ("loan_product_id") REFERENCES "loans_products"("id");--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_loan_application_id_loan_applications_id_fkey" FOREIGN KEY ("loan_application_id") REFERENCES "loan_applications"("id");--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_member_id_users_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_loan_id_loans_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_loan_id_loans_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id");--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_payment_id_payments_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id");--> statement-breakpoint
ALTER TABLE "repayment_schedules" ADD CONSTRAINT "repayment_schedules_loan_id_loans_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id");