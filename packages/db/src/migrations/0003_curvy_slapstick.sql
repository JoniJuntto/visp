ALTER TABLE "app_user" ADD COLUMN "obs_control_token_id" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_control_token_hash" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_desired_streaming" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_streaming" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_command_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_applied_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_last_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_obs_control_token_id_unique" UNIQUE("obs_control_token_id");