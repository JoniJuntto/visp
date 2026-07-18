CREATE TYPE "public"."chat_provider" AS ENUM('twitch', 'kick');--> statement-breakpoint
CREATE TABLE "chat_connection" (
	"user_id" text NOT NULL,
	"provider" "chat_provider" NOT NULL,
	"kick_subscription_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_connection_user_id_provider_pk" PRIMARY KEY("user_id","provider")
);
--> statement-breakpoint
ALTER TABLE "chat_connection" ADD CONSTRAINT "chat_connection_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;