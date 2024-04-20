ALTER TABLE session ADD `id` text PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `session_sessionToken_unique` ON `session` (`sessionToken`);