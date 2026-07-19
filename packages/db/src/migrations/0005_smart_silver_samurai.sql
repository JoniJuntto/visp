ALTER TABLE "app_user" ADD COLUMN "read_secret_encrypted" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_scenes" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_current_scene" text;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "obs_desired_scene" text;
