CREATE TYPE "public"."streaming_software" AS ENUM('obs', 'visp', 'larix', 'moblin', 'other');--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "device_count" integer;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "streaming_software" "streaming_software";--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "onboarded_at" timestamp with time zone;