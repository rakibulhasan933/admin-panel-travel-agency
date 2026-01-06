ALTER TABLE "keywords" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "keywords" CASCADE;--> statement-breakpoint
ALTER TABLE "metadata" DROP CONSTRAINT "metadata_key_unique";--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "site_url" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "title_default" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "title_template" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "site_name" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "og_title" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "og_description" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "og_image_url" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "twitter_title" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "twitter_description" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "creator" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "publisher" text;--> statement-breakpoint
ALTER TABLE "metadata" ADD COLUMN "keywords" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "metadata" DROP COLUMN "key";--> statement-breakpoint
ALTER TABLE "metadata" DROP COLUMN "value";