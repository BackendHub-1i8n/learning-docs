CREATE TYPE IF NOT EXISTS "public"."state" AS ENUM('created', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"state" "state" NOT NULL,
	"createdAt" text NOT NULL,
	"updatedAt" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
