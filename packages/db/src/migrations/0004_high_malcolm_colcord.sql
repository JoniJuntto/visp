CREATE TYPE "public"."publish_origin" AS ENUM('native', 'web');--> statement-breakpoint
ALTER TABLE "path" ADD COLUMN "publish_secret_hash" text;--> statement-breakpoint
ALTER TABLE "path" ADD COLUMN "publish_secret_encrypted" text;--> statement-breakpoint
ALTER TABLE "path" ADD COLUMN "publish_origin" "publish_origin";--> statement-breakpoint
ALTER TABLE "path" ADD COLUMN "native_installation_id" text;--> statement-breakpoint
ALTER TABLE "path" ADD COLUMN "publish_last_connected_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "path" ADD CONSTRAINT "path_user_native_installation_unique" UNIQUE("user_id","native_installation_id");