CREATE TABLE "member_to_roles" (
	"member_id" integer,
	"role_id" integer,
	CONSTRAINT "member_to_roles_pkey" PRIMARY KEY("member_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "member_to_roles" ADD CONSTRAINT "member_to_roles_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "member_to_roles" ADD CONSTRAINT "member_to_roles_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id");